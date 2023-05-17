"use server"

import { prisma } from "@/prisma/db"
import { MessageRole, MessageType, Prisma } from "@prisma/client"
import { ChatCompletionRequestMessageRoleEnum } from "openai"

import { createChatCompletion } from "./openai"

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

const stringify = (results: Record<string, unknown>[]) => {
  return JSON.stringify(results, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  )
}

export const createErrorMessage = async ({
  chatId,

  message,
}: {
  chatId: string
  message: string
}) => {
  await prisma.message.create({
    data: {
      type: MessageType.TEXT,
      content: message,
      chatId,
      role: MessageRole.ASSISTANT,
    },
  })
}

export const createMessage = async (
  input: Prisma.MessageUncheckedCreateInput
) => {
  return prisma.message.create({ data: input })
}

export const createTableMessage = async ({
  results,
  chatId,
  sql,
}: {
  results: Record<string, unknown>[]
  chatId: string
  sql: string
}) => {
  await prisma.message.create({
    data: {
      type: MessageType.TABLE,
      results: stringify(results),
      content: "Here are the results:",
      chatId,
      role: MessageRole.ASSISTANT,
      sql,
    },
  })
}

export const createTextMessage = async ({
  results,
  chatId,
  sql,
  question,
  gptVersionModel,
}: {
  results: Record<string, unknown>[]
  chatId: string
  sql: string
  question: string
  gptVersionModel: string
}) => {
  const textResponse = await createChatCompletion({
    type: "TEXT",
    question,
    gptVersionModel,
    input: stringify(results),
    role: ChatCompletionRequestMessageRoleEnum.System,
  })

  await prisma.message.create({
    data: {
      type: MessageType.TEXT,
      content: textResponse,
      chatId,
      role: MessageRole.ASSISTANT,
      results: textResponse,
      sql,
    },
  })
}

export const createChartMessage = async ({
  results,
  chatId,
  sql,
  question = "",
  gptVersionModel,
}: {
  results: Record<string, unknown>[]
  chatId: string
  sql: string
  question: string
  gptVersionModel: string
}) => {
  const chartResponse = await createChatCompletion({
    type: "CHART",
    question,
    gptVersionModel,
    input: stringify(results),
    role: ChatCompletionRequestMessageRoleEnum.System,
  })

  const parsedChartResponse = JSON.parse(chartResponse) as ChartResponse

  if (parsedChartResponse.status === "VALID") {
    await prisma.message.create({
      data: {
        type: MessageType.CHART,
        content: "Here is the chart:",
        chatId,
        role: MessageRole.ASSISTANT,
        results: JSON.stringify(parsedChartResponse.response),
        sql,
      },
    })
  } else {
    await createErrorMessage({
      chatId,
      message:
        "Sorry, I couldn't create a chart for that. Please modify your prompt and try again.",
    })
  }
}

export const clear = async ({ chatId }: { chatId: string }) => {
  // TODO: delete messages
}
