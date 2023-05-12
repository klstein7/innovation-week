import { prisma } from "@/prisma/db"

import { CreateMessageForm } from "@/components/messages/create-message-form"
import { MessageList } from "@/components/messages/message-list"

type Props = {
  params: {
    chatId: string
  }
}

export default async function ChatPage({ params }: Props) {
  const messages = await prisma.message.findMany({
    where: {
      chatId: params.chatId,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
  return (
    <section className="flex flex-1 flex-col">
      <MessageList messages={messages} />
      <CreateMessageForm
        defaultValues={{
          chatId: params.chatId,
          content: "",
        }}
      />
    </section>
  )
}
