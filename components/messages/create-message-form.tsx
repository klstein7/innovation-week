"use client"

import { createMessage } from "@/actions/message"
import { isMessagingAtom, messagesAtom } from "@/atoms"
import { MessageUncheckedCreateInputSchema } from "@/prisma/generated/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { MessageRole, MessageType } from "@prisma/client"
import { useAtom } from "jotai"
import {
  BarChart,
  Database,
  Languages,
  Loader2,
  MessageCircle,
  Send,
  TextCursor,
} from "lucide-react"
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
  const [isMessaging, setIsMessaging] = useAtom(isMessagingAtom)
  const [messages, setMessages] = useAtom(messagesAtom)
  const form = useForm<z.infer<typeof MessageUncheckedCreateInputSchema>>({
    resolver: zodResolver(MessageUncheckedCreateInputSchema),
    defaultValues,
  })

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
            results: null,
            responseToId: null,
            role: MessageRole.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ])

        await createMessage(values)

        form.reset()

        setIsMessaging(false)
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
      <Select defaultValue={MessageType.TABLE}>
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
