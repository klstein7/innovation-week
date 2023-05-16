import { Message } from "@prisma/client"
import { atom } from "jotai"

type MessagingStatus = "GENERATING" | "REFLECTING" | "EXECUTING" | "DONE"

export const isMessagingAtom = atom(false)
export const messagesAtom = atom<Message[]>([])

export const messagingStatusAtom = atom<MessagingStatus>("GENERATING")
