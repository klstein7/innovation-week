import { CreateMessageForm } from "@/components/messages/create-message-form"

export const revalidate = 0

type Props = {
  children: React.ReactNode
  params: {
    chatId: string
  }
}

export default function ChatLayout({ children, params }: Props) {
  return (
    <section className="flex flex-1 flex-col">
      {children}
      <CreateMessageForm
        defaultValues={{
          chatId: params.chatId,
          content: "",
        }}
      />
    </section>
  )
}
