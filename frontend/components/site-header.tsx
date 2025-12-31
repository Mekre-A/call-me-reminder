import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md border" />
          <span className="text-sm font-semibold tracking-tight">
            Call Me Reminder
          </span>
        </Link>

        <Button asChild>
          <Link href="/reminders/new">New reminder</Link>
        </Button>
      </div>
    </header>
  )
}