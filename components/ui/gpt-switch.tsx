"use client"

import { gptSwitchAtom, isMessagingAtom } from "@/atoms"
import { useAtom } from "jotai"

import { Switch } from "./switch"

export const GptSwitch = () => {
  const [isMessaging] = useAtom(isMessagingAtom)
  const [gptSwitch, setGptSwitch] = useAtom(gptSwitchAtom)

  return (
    <div className="flex items-center gap-2 text-xs">
      <div>GPT 3.5</div>
      <Switch
        checked={gptSwitch === "gpt-4"}
        disabled={isMessaging}
        onCheckedChange={(e) => {
          e ? setGptSwitch("gpt-4") : setGptSwitch("gpt-3.5-turbo")
        }}
      />
      <div>GPT 4</div>
    </div>
  )
}
