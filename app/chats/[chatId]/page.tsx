import { prisma } from "@/prisma/db"

import { ExampleList } from "@/components/examples/example-list"
import { MessageList } from "@/components/messages/message-list"

export const revalidate = 0

type Props = {
  params: {
    chatId: string
  }
}

export default async function ChatPage({ params }: Props) {
  const examples = (await prisma.example.findMany())
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
  const messages = await prisma.message.findMany({
    where: {
      chatId: params.chatId,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
  return <MessageList messages={messages} examples={examples} />
}
