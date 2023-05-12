import { Message } from "@prisma/client"
import { atom } from "jotai"

export const isMessagingAtom = atom(false)
export const messagesAtom = atom<Message[]>([])
