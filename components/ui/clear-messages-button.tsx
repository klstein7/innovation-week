"use client"

import { useParams } from "next/navigation"
import { isMessagingAtom } from "@/atoms"
import { useAtom } from "jotai"
import { Delete, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { clearMessage } from "@/components/clear-message"

export function ClearMessages() {
  const [isMessaging] = useAtom(isMessagingAtom)
  const params = useParams()
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isMessaging}
      onClick={() => clearMessage({ chatId: params.chatId })}
    >
      <Trash className="mr-2 h-4 w-4" />
      Clear
    </Button>
  )
}
