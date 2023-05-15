"use client"

import { useMemo } from "react"
import { createChartMessage } from "@/actions/message"
import { isMessagingAtom } from "@/atoms"
import { Message, MessageRole, MessageType } from "@prisma/client"
import { BarChart } from "@tremor/react"
import { useAtom } from "jotai"
import { BarChart3, Download } from "lucide-react"
import moment from "moment"
import { CSVLink } from "react-csv"
import { set } from "zod"

import { cn } from "@/lib/utils"

import { DataTable } from "../results/data-table"

type Props = {
  message: Message
}

export const MessageItem = ({ message }: Props) => {
  const [isMessaging, setIsMessaging] = useAtom(isMessagingAtom)
  const parsedResults = useMemo(() => {
    if (!message.results) return null
    try {
      const parsed = JSON.parse(message.results as string)
      return parsed
    } catch (e) {
      return null
    }
  }, [message.results])

  console.log(parsedResults)

  const renderMessage = () => {
    if (!parsedResults) return message.content

    if (message.type === MessageType.CHART) {
      return (
        <div className="flex min-w-[980px] flex-col gap-2">
          <h4 className="text-center text-xs text-muted-foreground/75">
            {parsedResults.title.toUpperCase()}
          </h4>
          <BarChart
            className="w-full"
            index="topic"
            categories={parsedResults.categories}
            data={parsedResults.data}
            maxValue={parsedResults.maxValue}
          />
        </div>
      )
    }

    return <DataTable data={parsedResults} />
  }

  return (
    <li
      className={cn(
        "flex flex-col gap-1",
        message.role === MessageRole.USER ? "items-end" : "items-start"
      )}
    >
      {parsedResults && message.role === MessageRole.ASSISTANT && (
        <div className="flex items-center gap-2">
          <CSVLink
            className="flex select-none items-center justify-center gap-2 rounded border px-3 py-1 text-xs hover:bg-primary hover:text-primary-foreground"
            data={parsedResults as any}
            target="_blank"
            filename="results.csv"
          >
            <Download className="h-3 w-3" />
            CSV
          </CSVLink>

          <button
            className="flex select-none items-center justify-center gap-2 rounded border px-3 py-1 text-xs hover:bg-primary hover:text-primary-foreground"
            onClick={async () => {
              setIsMessaging(true)
              await createChartMessage({
                chatId: message.chatId,
                content: JSON.stringify(parsedResults),
              })
              setIsMessaging(false)
            }}
          >
            <BarChart3 className="h-3 w-3" />
            Chart
          </button>
        </div>
      )}
      <div
        className={cn(
          "flex w-fit max-w-[calc(100vw-3rem)] flex-col overflow-x-auto rounded-md",
          message.role === MessageRole.USER
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground",
          parsedResults ? "p-2" : "px-4 py-2"
        )}
      >
        {renderMessage()}
      </div>
      <div className="text-xs text-muted-foreground">
        {moment(message.createdAt).fromNow()}
      </div>
    </li>
  )
}
