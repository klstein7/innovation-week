"use client"

import { useRouter } from "next/navigation"
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
import { MessageUncheckedCreateInputSchema } from "@/prisma/generated/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { MessageRole, MessageType } from "@prisma/client"
import { useAtom } from "jotai"
import { BarChart, Database, MessageCircle, Send } from "lucide-react"
import { ChatCompletionRequestMessageRoleEnum } from "openai"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

type Props = {
  defaultValues?: z.infer<typeof MessageUncheckedCreateInputSchema>
}

export const CreateMessageForm = ({ defaultValues }: Props) => {
  const DEFAULT_ERROR_MESSAGE =
    "Something went wrong. Please modify your prompt and try again."
  const router = useRouter()

  const [, setMessagingStatus] = useAtom(messagingStatusAtom)
  const [isMessaging, setIsMessaging] = useAtom(isMessagingAtom)
  const [messages, setMessages] = useAtom(messagesAtom)
  const form = useForm<z.infer<typeof MessageUncheckedCreateInputSchema>>({
    resolver: zodResolver(MessageUncheckedCreateInputSchema),
    defaultValues,
  })

  const watchForm = form.watch()

  return (
    <form
      autoComplete="off"
      className="flex h-24 shrink-0 items-center justify-center gap-4 border-t px-4"
      onSubmit={form.handleSubmit(async (values) => {
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
        })

        setMessagingStatus("REFLECTING")
        const reflection = await getSqlReflection({
          input: sql,
          chatId: values.chatId,
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

        form.reset({
          ...watchForm,
          content: "",
        })

        setIsMessaging(false)

        router.refresh()
      })}
    >
      <div className="relative w-full max-w-2xl">
        <Input
          disabled={isMessaging}
          className="w-full rounded-full px-4 shadow-2xl"
          placeholder="E.g. What applications did we get last week?"
          {...form.register("content")}
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-4">
          <Send className="h-5 w-5 text-ring" />
        </div>
      </div>
      <Select
        value={watchForm.type}
        onValueChange={(value: MessageType) => {
          form.setValue("type", value)
        }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select type..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={MessageType.TEXT}>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>Text</div>
            </div>
          </SelectItem>
          <SelectItem value={MessageType.TABLE}>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <div>Table</div>
            </div>
          </SelectItem>
          <SelectItem value={MessageType.CHART}>
            <div className="flex items-center gap-2">
              <BarChart />
              <div>Chart</div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </form>
  )
}
