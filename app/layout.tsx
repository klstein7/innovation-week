import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { ClearMessages } from "@/components/ui/clear-messages-button"
import { GptSwitch } from "@/components/ui/gpt-switch"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex h-screen flex-col">
              <div className="flex h-12 w-full items-center justify-center border-b px-2">
                <div className="flex justify-start w-64">
                  <ClearMessages />
                </div>
                <div className="flex justify-center items-center w-64">
                  <GptSwitch />
                </div>
                <div className="flex justify-end w-64">
                  <ThemeToggle />
                </div>
              </div>
              <div className="flex flex-1 flex-col">{children}</div>
            </div>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </>
  )
}
