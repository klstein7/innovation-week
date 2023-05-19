import { Message, MessageType } from "@prisma/client"
import { atom } from "jotai"

type MessagingStatus =
  | "GENERATING"
  | "REFLECTING"
  | "EXECUTING"
  | "CREATING_TABLE"
  | "CREATING_TEXT"
  | "CREATING_CHART"

export type GptVersionModel = "gpt-3.5-turbo" | "gpt-4"
export const GptType = {
  GPT3 : <GptVersionModel>("gpt-3.5-turbo"),
  GPT4 : <GptVersionModel>("gpt-4")
};

export type GptType = (typeof GptType)[keyof typeof GptType]
export const isMessagingAtom = atom(false)
export const messagesAtom = atom<Message[]>([])
export const messageTypeAtom = atom<MessageType>(MessageType.TABLE)

export const messagingStatusAtom = atom<MessagingStatus>("GENERATING")

export const gptSwitchAtom = atom<GptVersionModel>("gpt-3.5-turbo")

export const isOpenAiAlertAtom = atom(false)
