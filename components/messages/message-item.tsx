import { Message, MessageRole } from "@prisma/client"
import moment from "moment"

import { cn } from "@/lib/utils"

type Props = {
  message: Message
}

export const MessageItem = ({ message }: Props) => {
  return (
    <li
      className={cn(
        "flex flex-col gap-1",
        message.role === MessageRole.USER ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "rounded-md px-4 py-2",
          message.role === MessageRole.USER
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {message.results ? JSON.stringify(message.results) : message.content}
      </div>
      <div className="text-xs text-muted-foreground">
        {moment(message.createdAt).fromNow()}
      </div>
    </li>
  )
}
