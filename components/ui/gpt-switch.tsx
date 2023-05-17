"use client"

import { useAtom } from "jotai"
import { Switch } from "./switch"
import { gptSwitchAtom } from "@/atoms"

export const GptSwitch = () => {
  const [, setGptAtom] = useAtom(gptSwitchAtom)

  return (
    <div className="flex items-center gap-2">
      <div>GPT 3.5</div>
      <Switch onCheckedChange={e => {e ? setGptAtom("gpt-4") : setGptAtom("gpt-3.5-turbo")}}/>
      <div>GPT 4</div>
    </div>
  )
}
