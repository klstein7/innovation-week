"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isMessagingAtom, isOpenAiAlertAtom, messageTypeAtom } from "@/atoms"
import { MessageUncheckedCreateInputSchema } from "@/prisma/generated/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { MessageType } from "@prisma/client"
import { useAtom } from "jotai"
import { BarChart, Database, MessageCircle, Send } from "lucide-react"
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

type Props = {
  defaultValues?: z.infer<typeof MessageUncheckedCreateInputSchema>
}

export const CreateMessageForm = ({ defaultValues }: Props) => {
  const router = useRouter()
  const [messageType, setMessageType] = useAtom(messageTypeAtom)
  const [isMessaging] = useAtom(isMessagingAtom)
  const [isOpenAiAlert, setIsOpenAiAlert] = useAtom(isOpenAiAlertAtom)
  const createMessageMutation = useCreateMessage()

  const form = useForm<z.infer<typeof MessageUncheckedCreateInputSchema>>({
    resolver: zodResolver(MessageUncheckedCreateInputSchema),
    defaultValues: {
      ...defaultValues,
      type: messageType,
    },
  })

  const watchForm = form.watch()

  useEffect(() => {
    if (watchForm.type) {
      setMessageType(watchForm.type)
    }
    setIsOpenAiAlert(watchForm.type !== "TABLE" ? true : false)
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
          className="z-0 w-full rounded-full pl-4 pr-12 shadow-2xl"
          placeholder="E.g. What applications did we get last week?"
          {...form.register("content")}
        />
        <button
          disabled={isMessaging}
          type="submit"
          className="absolute inset-y-0 right-0 z-10 flex items-center px-4 text-ring hover:text-primary disabled:pointer-events-none disabled:text-ring"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
      <Select
        disabled={isMessaging}
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
