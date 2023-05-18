"use client"

import { Button } from "@/components/ui/button"
import { clearMessage } from "@/components/clear-message"
import { useParams } from "next/navigation"

export function ClearMessages() {
  const params = useParams()
  return <Button onClick={() => clearMessage({chatId: params.chatId})}>Clear History</Button>
}
