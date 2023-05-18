"use client"

import {
  clearMessages
} from "@/actions/message"

import { useParams } from "next/navigation"

export const clearMessage = async ({
  chatId,
}: {
  chatId: string
}) => {
    await clearMessages({chatId: chatId})
}

