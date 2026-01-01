import { Badge } from "@/components/ui/badge"
import type { ReminderStatus } from "@/lib/types/reminder"

export function StatusBadge({ status }: { status: ReminderStatus }) {
  if (status === "Scheduled") {
    return <Badge variant="secondary">Scheduled</Badge>
  }
  if (status === "Completed") {
    
    return <Badge>Completed</Badge>
  }
  return <Badge variant="destructive">Failed</Badge>
}