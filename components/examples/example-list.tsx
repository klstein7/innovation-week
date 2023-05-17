import { MessageType } from "@prisma/client"

import { ExampleItem } from "./example-item"

export const ExampleList = () => {
  const examples = [
    {
      type: MessageType.TABLE,
      content: "What is the average application amount by province?",
    },
  ]
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <div className="text-4xl font-semibold">Not sure where to start?</div>
      <div className="mb-2 text-center text-muted-foreground">
        Get started with one of these examples below.
      </div>
      <ul className="flex flex-col gap-2">
        {examples.map((example) => (
          <ExampleItem key={example.content} {...example} />
        ))}
      </ul>
    </div>
  )
}
