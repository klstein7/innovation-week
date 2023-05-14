"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/prisma/db"
import { Message, MessageRole, Prisma } from "@prisma/client"
import { ChatCompletionRequestMessageRoleEnum } from "openai"

import { openai } from "@/lib/openai"

const BASE_PROMPT = `
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
id String @id @default(cuid())
amount Float
language Language @default(ENGLISH)
status ApplicationStatus @default(PENDING)
productLine ProductLine @default(INPUT_FINANCING)
businessLine BusinessLine @default(SMALL_BUSINESS)
channel Channel @default(ALLIANCE_SERVICES)
createdAt DateTime
updatedAt DateTime

businessPartner BusinessPartner @relation(fields: [businessPartnerId], references: [id])
businessPartnerId String
}

model BusinessPartner {
id String @id @default(cuid())
firstName String
lastName String
email String
phone String
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

applications Application[]
}

enum Role { SYSTEM, USER, ASSISTANT }
enum ApplicationStatus { PENDING, APPROVED, DENIED }
enum ProductLine { INPUT_FINANCING }
enum BusinessLine { SMALL_BUSINESS, CORPORATE_AND_COMMERCIAL }
enum Channel { ALLIANCE_SERVICES, JET, ONLINE_SERVICES }
enum Language { ENGLISH, FRENCH }

Using these schemas, create a PostgreSQL query to answer this question:
{inputQuestion}"
`

const REFLECTION_PROMPT = `
As an artificial intelligence model, analyze the provided SQL query and follow these steps:

Determine whether the query alters data. If so, mark its status as 'DENIED'.
Check if the query is syntactically incorrect. If it is, correct the syntax and mark its status as 'APPROVED'.
If the query is syntactically correct and does not alter data, mark its status as 'APPROVED'.
Provide your answer as a JSON object in this format:
{
  "status": "<APPROVED | DENIED>",
  "message": "<The original or corrected SQL query | An error message >",
}
For instance, given the query SELECT "User"."name", "User"."email" FROM "User" JOIN "Post" ON "User"."id" = "Post"."userId" WHERE "Post"."title" LIKE '%AI%', your output should be:
{
  "status": "APPROVED",
  "message": "SELECT \"User\".\"name\", \"User\".\"email\" FROM \"User\" JOIN \"Post\" ON \"User\".\"id\" = \"Post\".\"userId\" WHERE \"Post\".\"title\" LIKE '%AI%'"
}
Now, apply these steps to the following SQL query:
{inputQuery}"
`

const CHART_PROMPT = `
As an AI engineer specializing in natural language processing and data restructuring, you are tasked with transforming a given input dataset into a format suitable for generating a bar chart visualization. 
Your response will be evaluated based on your understanding of the underlying data, your ability to manipulate and structure the data appropriately, and your proficiency in generating a JSON object in the specified format.

Please follow these steps:

First, evaluate the provided dataset. If the dataset is not suitable for creating a bar chart, please indicate this by setting the 'status' field in your output JSON object to 'UNAVAILABLE'. If the dataset is suitable for creating a bar chart, indicate this by setting the 'status' field to 'AVAILABLE'.

Next, you need to restructure the dataset. The restructured data should include a title for the chart, an array of categories, and an array of data objects. Each data object should represent a separate bar in the bar chart and contain the following fields: 'topic', and one field for each category, where the field name is the category name and the field value is the corresponding data value.

Your response must only be a JSON object, and must not include any other text or formatting. Your response should be in this format:

{
  "status": "<AVAILABLE | UNAVAILABLE>",
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
  "status": "AVAILABLE",
  "response": {
    "title": "Channel by Language",
    "categories": ["ALLIANCE_SERVICES", "JET", "ONLINE_SERVICES"],
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
  "status": "AVAILABLE",
  "response": {
    "title": "Number of species threatened with extinction",
    "categories": ["Number of threatened species"],
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

Now, please apply these steps and principles to the following dataset: {inputData}
`

const createAIChatCompletion = async (
  model: string,
  temperature: number,
  messageContent: string
) => {
  const completion = await openai.createChatCompletion({
    model,
    temperature,
    messages: [
      {
        content: messageContent,
        role: ChatCompletionRequestMessageRoleEnum.User,
      },
    ],
  })

  const response = completion.data.choices[0].message?.content

  if (!response) {
    throw new Error("No response from OpenAI")
  }

  console.log(`Response: ${response}`)

  return response
}

const createChatMessage = async (
  chatId: string,
  content: string,
  responseToId?: string,
  results?: string
) => {
  await prisma.message.create({
    data: {
      chatId,
      content,
      results,
      role: MessageRole.ASSISTANT,
      responseToId,
    },
  })
}

export const createMessage = async (
  input: Prisma.MessageUncheckedCreateInput
) => {
  const message = await prisma.message.create({ data: input })

  console.log("Creating SQL...")

  const sqlResponse = await createAIChatCompletion(
    "gpt-3.5-turbo",
    0,
    BASE_PROMPT.replace("{inputQuestion}", message.content)
  )

  console.log("Reflecting on SQL...")

  const reflection = await createAIChatCompletion(
    "gpt-3.5-turbo",
    0,
    REFLECTION_PROMPT.replace("{inputQuery}", sqlResponse)
  )

  const parsedReflection = JSON.parse(reflection) as {
    status: "APPROVED" | "DENIED"
    message: string
  }

  if (parsedReflection.status === "DENIED") {
    await createChatMessage(
      message.chatId,
      parsedReflection.message,
      message.id
    )
  } else if (parsedReflection.status === "APPROVED") {
    const results = await prisma.$queryRawUnsafe(parsedReflection.message)
    const resultsString = JSON.stringify(results, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )

    await createChatMessage(
      message.chatId,
      parsedReflection.message,
      message.id,
      resultsString
    )
  }

  revalidatePath(`/chats/${message.chatId}`)
}

export const createChartMessage = async (
  input: Prisma.MessageUncheckedCreateInput
) => {
  console.log("Creating chart data...")

  const response = await createAIChatCompletion(
    "gpt-3.5-turbo",
    0,
    CHART_PROMPT.replace("{inputData}", input.content)
  )

  console.log(`Response: ${response}`)

  const parsedResponse = JSON.parse(response) as {
    status: "AVAILABLE" | "UNAVAILABLE"
    response: {
      title: string
      categories: string[]
      data: {
        topic: string
        [key: string]: string
      }[]
    } | null
  }

  if (parsedResponse.status === "UNAVAILABLE") {
    await prisma.message.create({
      data: {
        ...input,
        role: MessageRole.SYSTEM,
        content: "Unable to create chart from requested data",
      },
    })
  } else if (parsedResponse.status === "AVAILABLE") {
    await prisma.message.create({
      data: {
        ...input,
        role: MessageRole.CHART,
        content: parsedResponse.response?.title || "No chart available",
        results: JSON.stringify(parsedResponse.response),
      },
    })
  }

  revalidatePath(`/chats/${input.chatId}`)
}
