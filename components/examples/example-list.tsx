import { Example } from "@prisma/client"

import { OpenAiAlert } from "../ui/open-ai-alert"
import { ExampleItem } from "./example-item"

type Props = {
  examples: Example[]
}

export const ExampleList = ({ examples }: Props) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-3">
        <div className="text-center text-4xl font-semibold">
          Not sure where to start?
        </div>
        <div className="mb-2 text-center text-muted-foreground">
          Get started with one of these examples below:
        </div>
        <ul className="flex flex-col gap-3">
          {examples.map((example) => (
            <ExampleItem key={example.id} example={example} />
          ))}
        </ul>
      </div>
      <OpenAiAlert />
    </div>
  )
}
