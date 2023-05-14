"use client"

import { createMessage } from "@/actions/message"
import { isMessagingAtom, messagesAtom } from "@/atoms"
import { MessageUncheckedCreateInputSchema } from "@/prisma/generated/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { MessageRole } from "@prisma/client"
import { useAtom } from "jotai"
import { Loader2, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "../ui/input"

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

  console.log(messages)

  return (
    <form
      autoComplete="off"
      className="flex h-24 shrink-0 items-center justify-center border-t px-4"
      onSubmit={form.handleSubmit(async (values) => {
        setIsMessaging(true)

        setMessages([
          ...messages,
          {
            id: "optimistic",
            chatId: values.chatId,
            content: values.content,
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
          className="w-full rounded-full px-4 shadow-2xl"
          placeholder="E.g. What applications did we get last week?"
          {...form.register("content")}
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-4">
          {isMessaging ? (
            <Loader2 className="h-5 w-5 animate-spin text-ring" />
          ) : (
            <Send className="h-5 w-5 text-ring" />
          )}
        </div>
      </div>
    </form>
  )
}
