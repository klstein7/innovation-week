"use client"

import { clearMessages } from "@/actions/openai"
import { Button } from "@/components/ui/button"
import { useClearMessage } from "@/hooks/use-clear-message"

export function ClearMessages() {
  return <Button onClick={useClearMessage}>Clear History</Button>
}
