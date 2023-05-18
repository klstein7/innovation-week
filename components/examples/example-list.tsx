import { MessageType } from "@prisma/client"

import { ExampleItem } from "./example-item"

export const ExampleList = () => {
  const examples = [
    {
      type: MessageType.TABLE,
      content: "Count applications by business line and channel?",
    },
    {
      type: MessageType.TABLE,
      content: "What is each province's status count?",
    },
    {
      type: MessageType.TABLE,
      content:
        "What's the majority chosen language for applications by province?",
    },
    {
      type: MessageType.TEXT,
      content: "What is the id for the most recent application?",
    },
    {
      type: MessageType.TEXT,
      content: "Most popular channel of choice?",
    },
    {
      type: MessageType.TEXT,
      content: "Average amount of days between created and completed date?",
    },
    {
      type: MessageType.CHART,
      content: "How many French vs English applications have been received?",
    },
    {
      type: MessageType.CHART,
      content: "Number of applications by channel of choice?",
    },
    {
      type: MessageType.CHART,
      content: "Count the small business applications by status",
    },
    {
      type: MessageType.CHART,
      content: 'SELECT * FROM "Application" GROUP BY "Address"."province"',
    },
    {
      type: MessageType.TEXT,
      content: "How do I make toast? 🍞",
    },
  ]
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <div className="text-4xl font-semibold">Not sure where to start?</div>
      <div className="mb-2 text-center text-muted-foreground">
        Get started with one of these examples below:
      </div>
      <ul className="flex flex-col gap-3">
        {examples.map((example) => (
          <ExampleItem key={example.content} {...example} />
        ))}
      </ul>
    </div>
  )
}
