import { MessageType } from "@prisma/client"

import { OpenAiAlert } from "@/components/ui/open-ai-alert"
import { CreateMessageForm } from "@/components/messages/create-message-form"

type Props = {
  children: React.ReactNode
  params: {
    chatId: string
  }
}

export default function ChatLayout({ children, params }: Props) {
  return (
    <section className="flex flex-1 flex-col">
      <OpenAiAlert />
      {children}
      <CreateMessageForm
        defaultValues={{
          chatId: params.chatId,
          content: "",
          type: MessageType.TABLE,
        }}
      />
    </section>
  )
}
