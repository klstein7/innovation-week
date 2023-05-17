"use client"

import {
  createChartMessage,
  createErrorMessage,
  createMessage,
  createTableMessage,
  createTextMessage,
} from "@/actions/message"
import {
  clearMessages
} from "@/actions/openai"

import { MessageRole, MessageType, Prisma } from "@prisma/client"
import { ChatCompletionRequestMessageRoleEnum } from "openai"

export const useClearMessage = () => {
  return async function (values: Prisma.MessageUncheckedCreateInput) {
    
    const chatId = values.chatId;

    await clearMessages(values)

  }
}
