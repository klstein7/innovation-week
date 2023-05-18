import { Message, MessageType } from "@prisma/client"
import { atom } from "jotai"

type MessagingStatus =
  | "GENERATING"
  | "REFLECTING"
  | "EXECUTING"
  | "CREATING_TABLE"
  | "CREATING_TEXT"
  | "CREATING_CHART"

type GptVersionModel = "gpt-3.5-turbo" | "gpt-4"

export const isMessagingAtom = atom(false)
export const messagesAtom = atom<Message[]>([])
export const messageTypeAtom = atom<MessageType>(MessageType.TABLE)

export const messagingStatusAtom = atom<MessagingStatus>("GENERATING")

export const gptSwitchAtom = atom<GptVersionModel>("gpt-3.5-turbo")

export const isOpenAiAlertAtom = atom(false)
