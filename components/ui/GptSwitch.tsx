"use client"

import { Switch } from "./switch"

export const GptSwitch = () => {
  //TODO: add logic for switch
  // const [gptAtom, setGptAtom] = useAtom(gptSwitchAtom)
  return (
    <div className="flex items-center gap-2">
      <div>GPT 3.5</div>
      <Switch />
    </div>
  )
}
