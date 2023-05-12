import { redirect } from "next/navigation"
import { prisma } from "@/prisma/db"

export default async function IndexPage() {
  const count = await prisma.chat.count()
  const chat = await prisma.chat.create({
    data: {
      name: `Chat ${count + 1}`,
    },
  })
  return redirect(`/chats/${chat.id}`)
}
