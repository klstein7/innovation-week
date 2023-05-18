"use server"

import { prisma } from "@/prisma/db"
import { MessageRole, MessageType, Prisma } from "@prisma/client"
import { ChatCompletionRequestMessageRoleEnum } from "openai"

import { openai } from "@/lib/openai"

const SQL_PROMPT = `
Today's date is ${new Date().toLocaleDateString()}.
You are a database engineer and your task is to build a PostgreSQL query, drawing upon the Prisma model schemas provided below. The query you create will answer a specific question, and it might necessitate the use of JOINs, WHERE clauses, or aggregations. Please follow these guidelines while writing your query:

Use double quotes for table and column names.
Use single quotes for string values.
Do not end your query with a semicolon.
Assign short descriptive aliases to your columns.
Present only the SQL query, with no supplementary text or formatting.

Here are the model schemas you'll be working with:

model Application {
  id           String            @id @default(cuid())
  amount       Float
  language     Language          @default(ENGLISH)
  status       ApplicationStatus @default(PENDING)
  productLine  ProductLine       @default(INPUT_FINANCING)
  businessLine BusinessLine      @default(SMALL_BUSINESS)
  channel      Channel           @default(ALLIANCE_SERVICES)
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
  completedAt  DateTime?

  outlet  BusinessPartner @relation("OutletApplications", fields: [outletId], references: [id], onDelete: Cascade)
  outletId String

  borrower   BusinessPartner @relation("BorrowerApplications", fields: [borrowerId], references: [id], onDelete: Cascade)
  borrowerId String
}

model BusinessPartner {
  id          String              @id @default(cuid())
  type        BusinessPartnerType @default(CUSTOMER)
  displayName String
  email       String
  phone       String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  address   Address @relation(fields: [addressId], references: [id], onDelete: Cascade)
  addressId String

  outletApplications   Application[] @relation("OutletApplications")
  borrowerApplications Application[] @relation("BorrowerApplications")
}

model Address {
  id        String   @id @default(cuid())
  street    String
  city      String
  province  String
  postal    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  businessPartners BusinessPartner[]
}

enum ApplicationStatus {
  PENDING
  APPROVED
  DENIED
}

enum ProductLine {
  INPUT_FINANCING
}

enum BusinessLine {
  SMALL_BUSINESS
  CORPORATE_AND_COMMERCIAL
}

enum Channel {
  ALLIANCE_SERVICES
  JET
  ONLINE_SERVICES
}

enum Language {
  ENGLISH
  FRENCH
}

enum BusinessPartnerType {
  ALLIANCE_PARTNER
  CUSTOMER
}

Using these schemas, please create a PostgreSQL query to answer the following question:

{question}

For instance, if the question was 'What is the email of the business partner who has an application with an amount greater than 5000?' an example query could be:

SELECT "BusinessPartner"."email" as "email"
FROM "BusinessPartner"
JOIN "Application"
ON "BusinessPartner"."id" = "Application"."borrowerId"
WHERE "Application"."amount" > 5000
`

const REFLECTION_PROMPT = `
As an artificial intelligence model, analyze the provided SQL query and follow these steps:

Determine whether the query alters data. If so, mark its status as 'INVALID'.
Check if the query is syntactically incorrect. If it is, correct the syntax and mark its status as 'VALID'.
If the query is syntactically correct and does not alter data, mark its status as 'VALID'.
Provide your answer as a JSON object in this format:
{
  "status": "<VALID | INVALID>",
  "response": "<The original or corrected SQL query | An error message >",
}
For instance, given the query SELECT "User"."name", "User"."email" FROM "User" JOIN "Post" ON "User"."id" = "Post"."userId" WHERE "Post"."title" LIKE '%AI%', your output should be:
{
  "status": "VALID",
  "response": "SELECT \"User\".\"name\", \"User\".\"email\" FROM \"User\" JOIN \"Post\" ON \"User\".\"id\" = \"Post\".\"userId\" WHERE \"Post\".\"title\" LIKE '%AI%'"
}
Now, apply these steps to the following SQL query:
{input}
`

const CHART_PROMPT = `
As an AI model, you're tasked with reformatting a given dataset into a structure suited for a bar chart visualization. The output must be a JSON object in the following format:

{
"status": "VALID" or "INVALID",
"response": {
"title": "Title",
"categories": ["Category 1", "Category 2"],
"data": [
{
"topic": "Topic 1",
"Category 1": "Value 1",
"Category 2": "Value 2"
},
{...}
]
}
}

If the input dataset isn't suitable for a bar chart, indicate this with a 'status' value of 'INVALID'. If suitable, use 'VALID'.

The restructured data must include a title, categories, and data objects. Each data object represents a bar in the chart, with a 'topic' field and a field for each category's corresponding value.
Each topic must be less than 10 characters long. If a topic is longer than 10 characters, truncate it to 10 characters.
Your response must only be a valid JSON object in the format specified above. Do not include any other information in your response.

For example, given the following dataset:

[
  {
    name: "Amphibians",
    "Number of threatened species": 2488,
  },
  {
    name: "Birds",
    "Number of threatened species": 1445,
  },
  {
    name: "Crustaceans",
    "Number of threatened species": 743,
  },
];

Your output should be:

{
  "status": "VALID",
  "response": {
      "title": "Number of species threatened with extinction",
      "categories": [
          "Number of threatened species"
      ],
      "maxValue": 2488,
      "data": [
          {
              "topic": "Amphibians",
              "Number of threatened species": 2488
          },
          {
              "topic": "Birds",
              "Number of threatened species": 1445
          },
          {
              "topic": "Crustacean",
              "Number of threatened species": 743
          },
      ]
  }
}
Please apply these instructions to this dataset: {input}
`

const TEXT_PROMPT = `
Today's date is: ${new Date().toLocaleDateString()}

Your role as an AI system involves the interpretation and processing of an array of data to generate answers to user queries. Leveraging the data presented, your task is to conceive a precise, yet robust, response in natural English. Ensure that your responses are conversational, blending seamlessly into a dialogue, without explicitly referencing the source dataset.

When dealing with numerical or count-based data, treat the count as the direct answer to the user's question. However, maintain the subtlety of not revealing the actual numerical data source.

For example, given the dataset provided:

[
  {
    "language": "FRENCH",
    "channel": "ALLIANCE_SERVICES",
    "count": "48"
  },
  {
    "language": "FRENCH",
    "channel": "JET",
    "count": "45"
  },
  {
    "language": "ENGLISH",
    "channel": "ALLIANCE_SERVICES",
    "count": "46"
  }
]

And the question:

How many Jet and Alliance Services applications were received in French? How many Alliance Services applications were received in English?

The following is an acceptable response:

There were a total of 93 applications received in French across both Jet and Alliance Services. Specifically, 48 were through Alliance Services and 45 were through Jet. As for Alliance Services applications received in English, there were 46 in total.

Another example:

Given the dataset provided:

[{"count": "2"}]

And the question:

How many applications were received?

The following is an acceptable response:

We received a total of 2 Jet and Alliance Services applications.

Now, please apply these steps and principles to the following dataset and question: 

Dataset:

{input} 

Question:

{question}
`

type ChatCompletionMessageEnum = "TEXT" | "CHART" | "SQL" | "REFLECTION"

type ReflectionResponse = {
  status: "VALID" | "INVALID"
  response: string
}

type ChatCompletionRequest = {
  question?: string
  input?: string
  gptVersionModel: string
  role: ChatCompletionRequestMessageRoleEnum
  type: ChatCompletionMessageEnum
}

const getPrompt = (type: ChatCompletionMessageEnum) => {
  switch (type) {
    case "TEXT":
      return TEXT_PROMPT
    case "CHART":
      return CHART_PROMPT
    case "SQL":
      return SQL_PROMPT
    case "REFLECTION":
      return REFLECTION_PROMPT
  }
}

export const createChatCompletion = async ({
  question,
  input,
  role,
  type,
  gptVersionModel,
}: ChatCompletionRequest) => {
  let prompt = getPrompt(type)
  if (input) {
    prompt = prompt.replace("{input}", input)
  }
  if (question) {
    prompt = prompt.replace("{question}", question)
  }
  const response = await openai.createChatCompletion({
    model: gptVersionModel,
    temperature: 0,
    max_tokens: 2048,
    messages: [
      {
        content: prompt,
        role,
      },
    ],
  })

  const messageContent = response.data.choices[0].message?.content
  if (!messageContent) {
    throw new Error("No response from OpenAI")
  }

  console.log(messageContent)

  return messageContent
}

export const getSqlReflection = async ({
  input,
  chatId,
  gptVersionModel,
}: {
  input: string
  chatId: string
  gptVersionModel: string
}) => {
  const reflection = await createChatCompletion({
    question: "",
    input,
    role: ChatCompletionRequestMessageRoleEnum.System,
    type: "REFLECTION",
    gptVersionModel,
  })

  try {
    return JSON.parse(reflection) as ReflectionResponse
  } catch {
    await prisma.message.create({
      data: {
        content:
          "Sorry, unable to parse reflection response. Please try again.",
        role: MessageRole.ASSISTANT,
        type: MessageType.TEXT,
        sql: input,
        chatId,
      },
    })
  }
}

export const getSqlResults = async ({ sql }: { sql: string }) => {
  const results = await prisma.$queryRawUnsafe(sql)
  return results as Record<string, unknown>[]
}

