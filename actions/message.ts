"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/prisma/db"
import { Message, MessageRole, Prisma } from "@prisma/client"
import { ChatCompletionRequestMessageRoleEnum } from "openai"

import { openai } from "@/lib/openai"

const BASE_PROMPT = `
As a skilled database engineer, your task is to create a syntactically correct PostgreSQL query using the provided Prisma model schemas that accurately addresses a given input question. 
Analyze the relationships between the schemas, and consider any necessary JOINs, WHERE clauses, or aggregations to form a precise and efficient query.
Your SQL query must have double quotes around the table and column names, and single quotes around any string values.
Your response must only include the SQL query itself, and should not include any additional text or formatting.

Example:

Given Schemas:        

model User {
  id    String   @id @default(uuid())
  name  String   @db.VarChar(50)
  age   Int
  email String   @db.VarChar(50)
  posts Post[]
}

model Post {
  id      String @id @default(uuid())
  title   String @db.VarChar(50)
  content String
  user    User   @relation(fields: [userId], references: [id])
  userId  String
}

Input Question:

Retrieve the names and email addresses of users who have published a post with 'AI' in the title.

Your SQL query should resemble:        

SELECT "User"."name", "User"."email" FROM "User" JOIN "Post" ON "User"."id" = "Post"."userId" WHERE "Post"."title" LIKE '%AI%'

Now use the provided schemas to answer the following questions:

Given Schemas:

model Application {
  id           String            @id @default(uuid())
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

  applications Application[]
}

enum Role {
  SYSTEM
  USER
  ASSISTANT
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

Input Question:
{inputQuestion}
`

const REFLECTION_PROMPT = `
  As a skilled database engineer, your task is to review a given SQL query and do one of the following:
  1. If the query mutates data, set the query's status to 'DENIED'.
  2. If the query is syntactically incorrect, modify the query to be syntactically correct and set the query's status to 'APPROVED'.
  3. If the query is syntactically correct and does not mutate data, set the query's status to 'APPROVED'.
  Your response must be a valid JSON object with the following format:
  {
    "status": "APPROVED" | "DENIED"
    "query": "SELECT ..."
  }

  Example:
  SELECT "User"."name", "User"."email" FROM "User" JOIN "Post" ON "User"."id" = "Post"."userId" WHERE "Post"."title" LIKE '%AI%'

  Your response should resemble:
  {
    "status": "APPROVED",
    "query": "SELECT \"User\".\"name\", \"User\".\"email\" FROM \"User\" JOIN \"Post\" ON \"User\".\"id\" = \"Post\".\"userId\" WHERE \"Post\".\"title\" LIKE '%AI%'"
  }

  Now do the same for the following SQL query:
  {inputQuery}
`

export const createMessage = async (
  input: Prisma.MessageUncheckedCreateInput
) => {
  const message = await prisma.message.create({
    data: input,
  })

  let completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        content: BASE_PROMPT.replace("{inputQuestion}", message.content),
        role: ChatCompletionRequestMessageRoleEnum.User,
      },
    ],
  })

  const response = completion.data.choices[0].message?.content

  if (!response) {
    throw new Error("No response from OpenAI")
  }

  completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        content: REFLECTION_PROMPT.replace("{inputQuery}", response),
        role: ChatCompletionRequestMessageRoleEnum.User,
      },
    ],
  })

  const reflection = completion.data.choices[0].message?.content

  if (!reflection) {
    throw new Error("No reflection from OpenAI")
  }

  const parsedReflection = JSON.parse(reflection) as {
    status: "APPROVED" | "DENIED"
    query: string
  }

  if (parsedReflection.status === "DENIED") {
    await prisma.message.create({
      data: {
        chatId: message.chatId,
        content: "Mutation queries are not allowed.",
        role: MessageRole.ASSISTANT,
        responseToId: message.id,
      },
    })
  } else if (parsedReflection.status === "APPROVED") {
    const results = await prisma.$queryRawUnsafe(parsedReflection.query)

    await prisma.message.create({
      data: {
        chatId: message.chatId,
        content: parsedReflection.query,
        results: JSON.stringify(
          JSON.stringify(results, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        ),
        role: MessageRole.ASSISTANT,
        responseToId: message.id,
      },
    })
  }

  revalidatePath(`/chats/${message.chatId}`)
}
