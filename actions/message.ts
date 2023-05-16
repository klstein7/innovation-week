"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/prisma/db"
import { MessageRole, MessageType, Prisma } from "@prisma/client"
import { ChatCompletionRequestMessageRoleEnum } from "openai"

import { openai } from "@/lib/openai"

const BASE_PROMPT = `
Today's date is ${new Date().toLocaleDateString()}.
You are a database engineer tasked with creating a PostgreSQL query using the provided Prisma model schemas. Your query must answer a specific question, and may require JOINs, WHERE clauses, or aggregations. Follow these guidelines:

Use double quotes for table and column names.
Use single quotes for string values.
Provide only the SQL query without extra text or formatting.

Consider these example schemas:

model User {
id String @id @default(uuid())
name String @db.VarChar(50)
age Int
email String @db.VarChar(50)
posts Post[]
}

model Post {
id String @id @default(uuid())
title String @db.VarChar(50)
content String
user User @relation(fields: [userId], references: [id])
userId String
}

Example question: 'What are the names and email addresses of users who have published a post with 'AI' in the title?'

Example SQL query:

SELECT "User"."name", "User"."email" FROM "User" JOIN "Post" ON "User"."id" = "Post"."userId" WHERE "Post"."title" LIKE '%AI%'

Now consider these schemas:

model Application {
  id           String            @id @default(cuid())
  amount       Float
  language     Language          @default(ENGLISH)
  status       ApplicationStatus @default(PENDING)
  productLine  ProductLine       @default(INPUT_FINANCING)
  businessLine BusinessLine      @default(SMALL_BUSINESS)
  channel      Channel           @default(ALLIANCE_SERVICES)
  createdAt    DateTime
  updatedAt    DateTime

  businessPartner   BusinessPartner @relation(fields: [businessPartnerId], references: [id])
  businessPartnerId String
}

model BusinessPartner {
  id        String   @id @default(cuid())
  firstName String
  lastName  String
  email     String
  phone     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  address   Address @relation(fields: [addressId], references: [id], onDelete: Cascade)
  addressId String

  applications Application[]
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


Using these schemas, create a PostgreSQL query to answer this question:
{input}
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
As an AI engineer specializing in natural language processing and data restructuring, you are tasked with transforming a given input dataset into a format suitable for generating a bar chart visualization. 
Your response will be evaluated based on your understanding of the underlying data, your ability to manipulate and structure the data appropriately, and your proficiency in generating a JSON object in the specified format.

Please follow these steps:

First, evaluate the provided dataset. If the dataset is not suitable for creating a bar chart, please indicate this by setting the 'status' field in your output JSON object to 'INVALID'. If the dataset is suitable for creating a bar chart, indicate this by setting the 'status' field to 'VALID'.

Next, you need to restructure the dataset. The restructured data should include a title for the chart, an array of categories, and an array of data objects. Each data object should represent a separate bar in the bar chart and contain the following fields: 'topic', and one field for each category, where the field name is the category name and the field value is the corresponding data value.

Your response must only be a JSON object, and must not include any other text or formatting. Your response should be in this format:

{
  "status": "<VALID | INVALID>",
  "response": <{
    "title": "<Title of the chart>",
    "categories": ["<Array of categories>"],
    "data": [
      {
        "topic": "<Topic of the data object>",
        "<Category 1>": "<Data value for Category 1>",
        "<Category 2>": "<Data value for Category 2>",
        "<Category 3>": "<Data value for Category 3>",
        "<...>": "<...>"
      }
    ]
  } | null>
}

Here's an example:

Given this data:

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
  },
  {
    "language": "FRENCH",
    "channel": "ONLINE_SERVICES",
    "count": "59"
  },
  {
    "language": "ENGLISH",
    "channel": "ONLINE_SERVICES",
    "count": "57"
  },
  {
    "language": "ENGLISH",
    "channel": "JET",
    "count": "45"
  }
]

Your output should be:

{
  "status": "VALID",
  "response": {
    "title": "Channel by Language",
    "categories": ["ALLIANCE_SERVICES", "JET", "ONLINE_SERVICES"],
    "minValue": 45,
    "maxValue": 59,
    "data": [
      {
        "topic": "FRENCH",
        "ALLIANCE_SERVICES": "48",
        "JET": "45",
        "ONLINE_SERVICES": "59"
      },
      {
        "topic": "ENGLISH",
        "ALLIANCE_SERVICES": "46",
        "JET": "45",
        "ONLINE_SERVICES": "57"
      }
    ]
  }
}

Another example:

Given this data:

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
]

Your output should be:

{
  "status": "VALID",
  "response": {
    "title": "Number of species threatened with extinction",
    "categories": ["Number of threatened species"],
    "maxValue": 2488,
    "data": [
      {
        "topic": "Amphibians",
        "Number of threatened species": 2488,
      },
      {
        "topic": "Birds",
        "Number of threatened species": 1445,
      },
      {
        "topic": "Crustaceans",
        "Number of threatened species": 743,
      },
    ]
  }
}

Now, please apply these steps and principles to the following dataset: 
{input}
`

const TEXT_PROMPT = `
Today's date is: ${new Date().toLocaleDateString()}
As an AI analyst, you are tasked to effectively analyze the provided data and provide a short and concise summary of it. Please follow these guidelines:

Craft a short and concise response using the data retrieved from the SQL query. Analyze the results of the SQL query and incorporate relevant information to answer the given question. 
If the question asks about a specific date range, assume that the SQL result provides data in that date range.
If the SQL result provides a count, assume that the count represents the answer to the question.

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

There has been 48 French applications through Alliance Services, 45 French through Jet, and 46 English applications through Alliance Services.

Another example:

Given the dataset provided:

[{"count": "2"}]

And the question:

How many applications were received in the last 30 days?

The following is an acceptable response:

There has been 2 applications received in the last 30 days.

Now, please apply these steps and principles to the following dataset and question: 

Dataset:

{input} 

Question:

{question}
`

type ReflectionResponse = {
  status: "VALID" | "INVALID"
  response: string
}

type ChartResponse = {
  status: "VALID" | "INVALID"
  response: {
    title: string
    categories: string[]
    maxValue?: number
    data: {
      topic: string
      [key: string]: string | number
    }
  } | null
}

export const createErrorMessage = async ({
  chatId,
  responseToId,
  message,
}: {
  chatId: string
  responseToId: string
  message: string
}) => {
  await prisma.message.create({
    data: {
      type: MessageType.TEXT,
      content: message,
      chatId,
      role: MessageRole.ASSISTANT,
      responseToId,
    },
  })
}

type OpenAiCompletionRequestParams = {
  prompt: string
  question: string
  input: string
  role: ChatCompletionRequestMessageRoleEnum
}

const createChatCompletion = async ({
  prompt,
  question,
  input,
  role,
}: OpenAiCompletionRequestParams) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    max_tokens: 2048,
    messages: [
      {
        content: prompt
          .replace("{input}", input)
          .replace("{question}", question),
        role,
      },
    ],
  })

  const messageContent = response.data.choices[0].message?.content
  if (!messageContent) {
    throw new Error("No response from OpenAI")
  }

  return messageContent
}

const processSQLResponse = async (
  input: Prisma.MessageUncheckedCreateInput
) => {
  const sqlResponse = await createChatCompletion({
    prompt: BASE_PROMPT,
    question: "",
    input: input.content,
    role: ChatCompletionRequestMessageRoleEnum.User,
  })

  const reflectionResponse = await createChatCompletion({
    prompt: REFLECTION_PROMPT,
    question: "",
    input: sqlResponse,
    role: ChatCompletionRequestMessageRoleEnum.System,
  })

  const parsedReflection = JSON.parse(reflectionResponse) as ReflectionResponse

  if (parsedReflection.status === "VALID") {
    const results = await prisma.$queryRawUnsafe(parsedReflection.response)
    return {
      results,
      parsedReflection,
    }
  }

  return null
}

const processChartResponse = async (
  resultsString: string,
  results: any,
  input: Prisma.MessageUncheckedCreateInput,
  messageId: string
) => {
  const chartResponse = await createChatCompletion({
    prompt: CHART_PROMPT,
    question: "",
    input: resultsString,
    role: ChatCompletionRequestMessageRoleEnum.System,
  })

  console.log("chartResponse", chartResponse)

  const parsedChartResponse = JSON.parse(chartResponse) as ChartResponse

  if (parsedChartResponse.status === "VALID") {
    await prisma.message.create({
      data: {
        type: MessageType.CHART,
        content: "Here is the chart:",
        chatId: input.chatId,
        role: MessageRole.ASSISTANT,
        results: JSON.stringify(parsedChartResponse.response),
        sql: results.parsedReflection.response,
        responseToId: messageId,
      },
    })
  } else {
    await createErrorMessage({
      chatId: input.chatId,
      responseToId: messageId,
      message:
        "Sorry, I couldn't create a chart for that. Please modify your prompt and try again.",
    })
  }
}

const processTextResponse = async (
  resultsString: string,
  results: any,
  input: Prisma.MessageUncheckedCreateInput,
  messageId: string
) => {
  const textResponse = await createChatCompletion({
    prompt: TEXT_PROMPT,
    question: input.content,
    input: resultsString,
    role: ChatCompletionRequestMessageRoleEnum.System,
  })

  await prisma.message.create({
    data: {
      type: MessageType.TEXT,
      content: textResponse,
      chatId: input.chatId,
      role: MessageRole.ASSISTANT,
      results: textResponse,
      sql: results.parsedReflection.response,
      responseToId: messageId,
    },
  })
}

export const createMessage = async (
  input: Prisma.MessageUncheckedCreateInput
) => {
  const message = await prisma.message.create({ data: input })
  console.log(input)

  try {
    const results = await processSQLResponse(input)
    console.log(results)

    if (!results) {
      throw new Error("Invalid SQL response from OpenAI")
    }

    const resultsString = JSON.stringify(results.results, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
    console.log(resultsString)

    if (input.type === MessageType.TABLE) {
      await prisma.message.create({
        data: {
          type: MessageType.TABLE,
          results: resultsString,
          content: "Here are the results:",
          chatId: input.chatId,
          role: MessageRole.ASSISTANT,
          sql: results.parsedReflection.response,
          responseToId: message.id,
        },
      })
    } else if (input.type === MessageType.CHART) {
      await processChartResponse(resultsString, results, input, message.id)
    } else if (input.type === MessageType.TEXT) {
      try {
        await processTextResponse(resultsString, results, input, message.id)
      } catch {
        throw new Error(
          "Token limit exceeded, please try to use the Table or Chart type instead."
        )
      }
    }
  } catch (error: any) {
    await createErrorMessage({
      chatId: input.chatId,
      responseToId: message.id,
      message: error.message,
    })

    console.error(error)
  } finally {
    revalidatePath(`/chats/${input.chatId}`)
  }
}
