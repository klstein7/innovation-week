"use server"

import { prisma } from "@/prisma/db"
import { MessageRole, MessageType, Prisma } from "@prisma/client"

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
