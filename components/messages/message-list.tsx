"use client"

import { useEffect, useRef } from "react"
import { isMessagingAtom, messagesAtom, messagingStatusAtom } from "@/atoms"
import { Message } from "@prisma/client"
import { useAtom } from "jotai"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

import { MessageItem } from "./message-item"

type Props = {
  messages: Message[]
}

export const MessageList = ({ messages }: Props) => {
  const [messagingStatus] = useAtom(messagingStatusAtom)
  const [optimisticMessages, setMessages] = useAtom(messagesAtom)
  const [isMessaging] = useAtom(isMessagingAtom)

  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getMessageStatus = () => {
    switch (messagingStatus) {
      case "GENERATING":
        return "Generating SQL..."
      case "REFLECTING":
        return "Reflecting on SQL..."
      case "EXECUTING":
        return "Executing SQL..."
      case "DONE":
        return "Done!"
    }
  }

  useEffect(() => {
    setMessages(messages)
  }, [messages, setMessages])

  useEffect(() => {
    scrollToBottom()
  }, [optimisticMessages])

  return (
    <div className="flex max-h-[calc(100vh-9rem)] flex-1 flex-col overflow-y-auto">
      <ul className="flex  flex-1 flex-col gap-4 p-4">
        {optimisticMessages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </ul>
      <div
        ref={bottomRef}
        className={cn(
          "flex items-center justify-center gap-2 p-2",
          isMessaging ? "visible" : "invisible"
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin text-ring" />
        <div className="text-xs text-muted-foreground">
          {getMessageStatus()}
        </div>
      </div>
    </div>
  )
}
