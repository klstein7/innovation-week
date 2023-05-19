"use client"

import {
  createChartMessage,
  createErrorMessage,
  createMessage,
  createTableMessage,
  createTextMessage,
} from "@/actions/message"
import {
  createChatCompletion,
  getSqlReflection,
  getSqlResults,
} from "@/actions/openai"
import { isMessagingAtom, messagesAtom, messagingStatusAtom } from "@/atoms"
import { MessageRole, MessageType, Prisma } from "@prisma/client"
import { useAtom } from "jotai"
import { ChatCompletionRequestMessageRoleEnum } from "openai"

export const useCreateMessage = () => {
  const DEFAULT_ERROR_MESSAGE =
    "Something went wrong. Please modify your prompt and try again."

  const [, setMessagingStatus] = useAtom(messagingStatusAtom)
  const [, setIsMessaging] = useAtom(isMessagingAtom)
  const [messages, setMessages] = useAtom(messagesAtom)

  return async function (
    values: Prisma.MessageUncheckedCreateInput,
    gpt: string
  ) {
    setMessagingStatus("GENERATING")
    setIsMessaging(true)

    setMessages([
      ...messages,
      {
        id: "optimistic",
        chatId: values.chatId,
        content: values.content,
        type: MessageType.TEXT,
        sql: null,
        results: null,
        responseToId: null,
        role: MessageRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    await createMessage(values)

    const sql = await createChatCompletion({
      question: values.content,
      role: ChatCompletionRequestMessageRoleEnum.System,
      type: "SQL",
      gptVersionModel: gpt,
    })

    setMessagingStatus("REFLECTING")
    const reflection = await getSqlReflection({
      input: sql,
      chatId: values.chatId,
      gptVersionModel: gpt,
    })

    if (reflection?.status === "VALID") {
      try {
        setMessagingStatus("EXECUTING")
        const results = await getSqlResults({
          sql: reflection.response,
        })

        if (values.type === MessageType.TABLE) {
          setMessagingStatus("CREATING_TABLE")
          try {
            await createTableMessage({
              chatId: values.chatId,
              results,
              sql: reflection.response,
            })
          } catch {
            await createErrorMessage({
              chatId: values.chatId,
              message: DEFAULT_ERROR_MESSAGE,
            })
          }
        } else if (values.type === MessageType.TEXT) {
          setMessagingStatus("CREATING_TEXT")
          try {
            await createTextMessage({
              chatId: values.chatId,
              question: values.content,
              results,
              sql: reflection.response,
              gptVersionModel: gpt,
            })
          } catch {
            try {
              await createMessage({
                ...values,
                role: MessageRole.ASSISTANT,
                chatId: values.chatId,
                content:
                  "Token limit exceeded. Attempting to create a table message instead.",
              })
              setMessagingStatus("CREATING_TABLE")
              await createTableMessage({
                chatId: values.chatId,
                results,
                sql: reflection.response,
              })
            } catch {
              await createErrorMessage({
                chatId: values.chatId,
                message: DEFAULT_ERROR_MESSAGE,
              })
            }
          }
        } else if (values.type === MessageType.CHART) {
          setMessagingStatus("CREATING_CHART")
          try {
            await createChartMessage({
              chatId: values.chatId,
              question: values.content,
              results,
              sql: reflection.response,
              gptVersionModel: gpt,
            })
          } catch {
            await createErrorMessage({
              chatId: values.chatId,
              message: DEFAULT_ERROR_MESSAGE,
            })
          }
        }
      } catch {
        await createErrorMessage({
          chatId: values.chatId,
          message: DEFAULT_ERROR_MESSAGE,
        })
      }
    } else {
      await createErrorMessage({
        chatId: values.chatId,
        message: reflection?.response || DEFAULT_ERROR_MESSAGE,
      })
    }

    setIsMessaging(false)
  }
}
