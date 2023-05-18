"use client"

import { useEffect, useRef } from "react"
import { isOpenAiAlertAtom } from "@/atoms"
import { useAtom } from "jotai"
import { Terminal } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function OpenAiAlert() {
  const [isOpenAiAlert] = useAtom(isOpenAiAlertAtom)

  const alertRef = useRef<HTMLDivElement>(null)
  const scrollToAlert = () => {
    alertRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToAlert()
  }, [isOpenAiAlert])

  if (!isOpenAiAlert) return null

  return (
    <Alert ref={alertRef} className="rounded-none border-0 border-t">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        When generating text and chart messages, the results of the SQL query
        will be sent to the OpenAI API.
      </AlertDescription>
    </Alert>
  )
}
