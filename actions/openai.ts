"use server"

import fs from "fs"
import { prisma } from "@/prisma/db"
import { MessageRole, MessageType, Prisma } from "@prisma/client"
import { ChatCompletionRequestMessageRoleEnum } from "openai"

import { openai } from "@/lib/openai"

function readSchemaFileSync(filePath: string): string {
  const data = fs.readFileSync(filePath, "utf8")
  const startComment = "/// Exposed to AI"
  const endComment = "/// End exposed to AI"
  const regex = new RegExp(`${startComment}([\\s\\S]*?)${endComment}`, "gm")
  const match = regex.exec(data)

  return match![1].trim()
}

const SQL_PROMPT = `
Today's date is ${new Date().toLocaleDateString()}.
You are a database engineer tasked with creating a PostgreSQL query using the provided Prisma model schemas. Your query must answer a specific question, and may require JOINs, WHERE clauses, or aggregations. Follow these guidelines:

Use double quotes for table and column names.
Use single quotes for string values.
Your query must not end with a semicolon.
Provide only the SQL query without extra text or formatting.

Consider these example schemas:

${readSchemaFileSync("prisma/schema.prisma")}

Using these schemas, create a PostgreSQL query to answer this question:
{question}
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

How many applications were received in the last week?

The following is an acceptable response:

There has been 2 applications received in the last week.

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
