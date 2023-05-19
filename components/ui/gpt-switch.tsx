"use client"

import { gptAtom, isMessagingAtom } from "@/atoms"
import { useAtom } from "jotai"

import { Switch } from "./switch"

export const GptSwitch = () => {
  const [isMessaging] = useAtom(isMessagingAtom)
  const [gpt, setGpt] = useAtom(gptAtom)

  return (
    <div className="flex items-center gap-2 text-xs">
      <div>GPT 3.5</div>
      <Switch
        checked={gpt === "gpt-4"}
        disabled={isMessaging}
        onCheckedChange={(e) => {
          e ? setGpt("gpt-4") : setGpt("gpt-3.5-turbo")
        }}
      />
      <div>GPT 4</div>
    </div>
  )
}
