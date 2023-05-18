"use client"

import { useParams, useRouter } from "next/navigation"
import { MessageType } from "@prisma/client"

import { useCreateMessage } from "@/hooks/use-create-message"

import { Badge } from "../ui/badge"

type Props = {
  type: MessageType
  content: string
}
export const ExampleItem = ({ type, content }: Props) => {
  const params = useParams()
  const router = useRouter()
  const createMessageMutation = useCreateMessage()

  const chatId = params.chatId as string

  const getBadgeLabel = () => {
    switch (type) {
      case MessageType.TABLE:
        return "Table"
      case MessageType.CHART:
        return "Chart"
      default:
        return "Text"
    }
  }
  return (
    <li
      className="border-rounded flex cursor-pointer select-none items-center gap-2 rounded-full border px-6 py-2 transition-all duration-200 ease-in-out hover:border-primary hover:shadow-lg"
      onClick={async () => {
        await createMessageMutation({
          chatId,
          type,
          content,
        })
        router.refresh()
      }}
    >
      {content}
      <Badge>{getBadgeLabel()}</Badge>
    </li>
  )
}
