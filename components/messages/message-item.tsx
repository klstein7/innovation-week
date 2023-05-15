"use client"

import { useCallback, useMemo } from "react"
import { isMessagingAtom } from "@/atoms"
import { Message, MessageRole, MessageType } from "@prisma/client"
import { BarChart } from "@tremor/react"
import { useAtom } from "jotai"
import { Download } from "lucide-react"
import moment from "moment"
import { CSVLink } from "react-csv"

import { cn } from "@/lib/utils"

import { DataTable } from "../results/data-table"

type Props = {
  message: Message
}

const useParsedResults = (results: string | null) => {
  return useMemo(() => {
    if (!results) return null
    try {
      return JSON.parse(results)
    } catch (e) {
      return null
    }
  }, [results])
}

const CSVLinkWrapper = ({ data }: { data: any }) => (
  <div className="flex items-center gap-2">
    <CSVLink
      className="flex select-none items-center justify-center gap-2 rounded border px-3 py-1 text-xs hover:bg-primary hover:text-primary-foreground"
      data={data}
      target="_blank"
      filename="results.csv"
    >
      <Download className="h-3 w-3" />
      CSV
    </CSVLink>
  </div>
)

const MessageItemContent = ({
  message,
  parsedResults,
}: {
  message: Message
  parsedResults: any
}) => {
  if (!parsedResults) return <>{message.content}</>

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

export const MessageItem = ({ message }: Props) => {
  const [isMessaging, setIsMessaging] = useAtom(isMessagingAtom)
  const parsedResults = useParsedResults(message.results as string)

  const getCsvData = useCallback(() => {
    if (!parsedResults) return []
    if (message.type === MessageType.CHART) {
      return parsedResults.data
    }

    return parsedResults
  }, [parsedResults, message.type])

  if (!parsedResults) {
    return (
      <li
        className={cn(
          "flex flex-col gap-1",
          message.role === MessageRole.USER ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "flex w-fit max-w-[calc(100vw-3rem)] flex-col overflow-x-auto rounded-md px-4 py-2",
            message.role === MessageRole.USER
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {message.content}
        </div>
        <div className="text-xs text-muted-foreground">
          {moment(message.createdAt).fromNow()}
        </div>
      </li>
    )
  }

  return (
    <li
      className={cn(
        "flex flex-col gap-1",
        message.role === MessageRole.USER ? "items-end" : "items-start"
      )}
    >
      <div className="flex items-center gap-2">
        <CSVLinkWrapper data={getCsvData()} />
        <button
          onClick={() => {
            console.log(message.sql)
          }}
        >
          SQL
        </button>
      </div>
      <div
        className={cn(
          "flex w-fit max-w-[calc(100vw-3rem)] flex-col overflow-x-auto rounded-md p-2",
          message.role === MessageRole.USER
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        <MessageItemContent message={message} parsedResults={parsedResults} />
      </div>
      <div className="text-xs text-muted-foreground">
        {moment(message.createdAt).fromNow()}
      </div>
    </li>
  )
}
