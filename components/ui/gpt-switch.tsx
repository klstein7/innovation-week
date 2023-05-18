"use client"

import { gptSwitchAtom, isMessagingAtom } from "@/atoms"
import { useAtom } from "jotai"

import { Switch } from "./switch"

export const GptSwitch = () => {
  const [isMessaging] = useAtom(isMessagingAtom)
  const [, setGptAtom] = useAtom(gptSwitchAtom)

  return (
    <div className="flex items-center gap-2">
      <div>GPT 3.5</div>
      <Switch
        disabled={isMessaging}
        onCheckedChange={(e) => {
          e ? setGptAtom("gpt-4") : setGptAtom("gpt-3.5-turbo")
        }}
      />
      <div>GPT 4</div>
    </div>
  )
}
