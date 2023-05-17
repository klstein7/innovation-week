"use client"

import { useRouter } from "next/navigation"
import {
  createChartMessage,
  createErrorMessage,
  createMessage,
  createTableMessage,
  createTextMessage,
} from "@/actions/message"
import {
  createChatCompletion,
  getSqlReflection,
  getSqlResults,
} from "@/actions/openai"
import {
  gptSwitchAtom,
  isMessagingAtom,
  messagesAtom,
  messagingStatusAtom,
} from "@/atoms"
import { MessageUncheckedCreateInputSchema } from "@/prisma/generated/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { MessageRole, MessageType } from "@prisma/client"
import { useAtom } from "jotai"
import { BarChart, Database, MessageCircle, Send } from "lucide-react"
import { ChatCompletionRequestMessageRoleEnum } from "openai"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useCreateMessage } from "@/hooks/use-create-message"

import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useEffect } from "react"

type Props = {
  defaultValues?: z.infer<typeof MessageUncheckedCreateInputSchema>
}

export const CreateMessageForm = ({ defaultValues }: Props) => {
  const router = useRouter()
  const [isMessaging] = useAtom(isMessagingAtom)
  const createMessageMutation = useCreateMessage()

  const form = useForm<z.infer<typeof MessageUncheckedCreateInputSchema>>({
    resolver: zodResolver(MessageUncheckedCreateInputSchema),
    defaultValues,
  })

  const watchForm = form.watch()

  useEffect(() => {
    console.log(watchForm.type)
    setIsOpenAiAlert(watchForm.type === "TABLE" ? true : false)
    console.log(getIsOpenAiAlert)

  }, [watchForm.type])

  return (
    <form
      autoComplete="off"
      className="flex h-24 shrink-0 items-center justify-center gap-4 border-t px-4"
      onSubmit={form.handleSubmit(async (values) => {
        await createMessageMutation(values)

        form.reset({
          ...values,
          type: values.type,
          content: "",
        })

        router.refresh()
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
      <Select
        value={watchForm.type}
        onValueChange={(value: MessageType) => {
          form.setValue("type", value)
        }}
      >
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
