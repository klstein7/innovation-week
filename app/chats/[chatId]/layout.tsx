import { MessageType } from "@prisma/client"

import { CreateMessageForm } from "@/components/messages/create-message-form"

import { OpenAiAlert } from "@/components/ui/OpenAiAlert"

type Props = {
  children: React.ReactNode
  params: {
    chatId: string
  }
}

export default function ChatLayout({ children, params }: Props) {
  return (
    <section className="flex flex-1 flex-col">
      <div><OpenAiAlert/></div>
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
