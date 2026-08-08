import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import type { ReactNode } from "react"
import "../styles.css"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title:
          "PROBEX AI — The Interviewer That Thinks Beyond the Answer",
      },
      {
        name: "description",
        content:
          "Personalized adaptive technical interviews powered by learning context.",
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}