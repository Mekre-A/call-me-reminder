import { Badge } from "@/components/ui/badge"
import type { ReminderDTO } from "@/lib/types/reminder"

function formatRemaining(ms: number) {
  if (ms <= 0) return "due now"

  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `in ${hours}h ${minutes}m`
  if (minutes > 0) return `in ${minutes}m ${seconds}s`
  return `in ${seconds}s`
}

export function TimeRemaining({
  reminder,
  nowMs,
}: {
  reminder: ReminderDTO
  nowMs: number
}) {
  if (reminder.status !== "Scheduled") return null

  const dueMs = new Date(reminder.scheduledAtIso).getTime()
  const remaining = dueMs - nowMs

  return (
    <Badge variant="outline" className="font-normal tabular-nums">
      {formatRemaining(remaining)}
    </Badge>
  )
}
