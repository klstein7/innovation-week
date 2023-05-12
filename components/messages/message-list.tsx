"use client"

import { useEffect } from "react"
import { isMessagingAtom, messagesAtom } from "@/atoms"
import { Message } from "@prisma/client"
import { useAtom } from "jotai"
import { Loader, Loader2 } from "lucide-react"

import { MessageItem } from "./message-item"

type Props = {
  messages: Message[]
}

export const MessageList = ({ messages }: Props) => {
  const [optimisticMessages, setMessages] = useAtom(messagesAtom)
  const [isMessaging] = useAtom(isMessagingAtom)
  useEffect(() => {
    setMessages(messages)
  }, [messages, setMessages])
  return (
    <ul className="flex flex-1 flex-col gap-2 p-4">
      {optimisticMessages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isMessaging && <Loader2 className="h-5 w-5 animate-spin text-ring" />}
    </ul>
  )
}
