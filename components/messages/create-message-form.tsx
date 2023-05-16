"use client"

import { useRouter } from "next/navigation"
import { createMessage } from "@/actions/message"
import {
  createChartMessage,
  createChatCompletion,
  createTableMessage,
  createTextMessage,
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
  const router = useRouter()

  const [messagingStatus, setMessagingStatus] = useAtom(messagingStatusAtom)
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

        setMessagingStatus("GENERATING")
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
          setMessagingStatus("EXECUTING")
          const results = await getSqlResults({
            sql: reflection.response,
          })

          if (values.type === MessageType.TABLE) {
            await createTableMessage({
              chatId: values.chatId,
              results,
              sql: reflection.response,
            })
          } else if (values.type === MessageType.TEXT) {
            await createTextMessage({
              chatId: values.chatId,
              question: values.content,
              results,
              sql: reflection.response,
            })
          } else if (values.type === MessageType.CHART) {
            await createChartMessage({
              chatId: values.chatId,
              question: values.content,
              results,
              sql: reflection.response,
            })
          }
        }

        setMessagingStatus("DONE")

        // await createMessage(values)

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
