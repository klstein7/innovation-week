"use client"

import { MessageType } from "@prisma/client"
import { ExampleItem } from "./example-item"
import { gptSwitchAtom, GptType} from "@/atoms";
import { useAtom } from "jotai"

export const ExampleList = () => {
  const [currentGpt] = useAtom(gptSwitchAtom)

  const examples = [
    {
      type: MessageType.TABLE,
      content: "Count applications by business line and channel?",
      gpt: GptType.GPT3
    },
    {
      type: MessageType.TABLE,
      content: "What is each province's status count?",
      gpt: GptType.GPT3
    },
    {
      type: MessageType.TABLE,
      content: "What's the majority chosen language for applications by province?",
      gpt: GptType.GPT3
    },
    {
      type: MessageType.TEXT,
      content: "What is the id for the most recent application?",
      gpt: GptType.GPT3
    },
    {
      type: MessageType.TEXT,
      content: "Most popular channel of choice?",
      gpt: GptType.GPT3
    },
    {
      type: MessageType.CHART,
      content: "How many French vs English applications have been received?",
      gpt: GptType.GPT3
    },
    {
      type: MessageType.CHART,
      content: "Number of applications by channel of choice?",
      gpt: GptType.GPT3
    },
    {
      type: MessageType.CHART,
      content: "Count the small business applications by status",
      gpt: GptType.GPT3
    },
    {
      type: MessageType.CHART,
      content: 'SELECT * FROM "Application" GROUP BY "Address"."province"',
      gpt: GptType.GPT3
    },
    {
      type: MessageType.TEXT,
      content: "Average amount of days between created and completed date?",
      gpt: GptType.GPT4
    },
    {
      type: MessageType.TEXT,
      content: "How do I make toast? 🍞",
      gpt: GptType.GPT4
    },
  ]

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-3">
      <div className="text-center text-4xl font-semibold">
        Not sure where to start?
      </div>
      <div className="mb-2 text-center text-muted-foreground">
        Get started with one of these examples below:
      </div>
      <ul className="flex flex-col gap-3">{
        examples
          .filter((example) => (example.gpt === currentGpt))
          .sort(() => Math.random() - 0.5)
          .slice(0, 5)
          .map((example) => (
            <ExampleItem key={example.content} {...example} />
          ))
        }
      </ul>
    </div>
  )
}
