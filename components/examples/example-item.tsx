"use client"

import { useParams, useRouter } from "next/navigation"
import { GptVersionModel, gptSwitchAtom, messageTypeAtom } from "@/atoms"
import { Example, MessageType } from "@prisma/client"
import { useAtom } from "jotai"

import { useCreateMessage } from "@/hooks/use-create-message"

import { Badge } from "../ui/badge"

type Props = {
  example: Example
}
export const ExampleItem = ({ example }: Props) => {
  const params = useParams()
  const router = useRouter()
  const createMessageMutation = useCreateMessage()
  const [, setMessageType] = useAtom(messageTypeAtom)
  const [, setGptSwitch] = useAtom(gptSwitchAtom)

  const chatId = params.chatId as string

  const getBadgeLabel = () => {
    switch (example.type) {
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
      className="border-rounded flex cursor-pointer select-none items-center justify-between gap-8 rounded-full border px-6 py-2 transition-all duration-200 ease-in-out hover:border-primary hover:shadow-lg"
      onClick={async () => {
        setMessageType(example.type)
        setGptSwitch(example.gpt as GptVersionModel)
        await createMessageMutation({
          chatId,
          type: example.type,
          content: example.content,
        })
        router.refresh()
      }}
    >
      <div>
        <div className="text-xs text-muted-foreground">
          {example.gpt === "gpt-3.5-turbo" ? "GPT 3.5" : "GPT 4"}
        </div>
        <div className="text-sm">{example.content}</div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="flex w-[5rem] items-center justify-center"
        >
          {getBadgeLabel()}
        </Badge>
      </div>
    </li>
  )
}
