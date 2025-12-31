import { mockReminders, type Reminder } from "@/lib/reminders.mock"

export type RemindersQuery = {
  status?: "all" | "scheduled" | "completed" | "failed"
  q?: string
}

function matchesStatus(r: Reminder, status: RemindersQuery["status"]) {
  if (!status || status === "all") return true
  if (status === "scheduled") return r.status === "Scheduled"
  if (status === "completed") return r.status === "Completed"
  return r.status === "Failed"
}

export async function listReminders(query: RemindersQuery): Promise<Reminder[]> {
  
  await new Promise((res) => setTimeout(res, 350))

  const q = (query.q ?? "").trim().toLowerCase()
  const status = query.status ?? "all"

  return mockReminders
    .filter((r) => matchesStatus(r, status))
    .filter((r) => {
      if (!q) return true
      return r.title.toLowerCase().includes(q) || r.message.toLowerCase().includes(q)
    })
    .slice()
    .sort(
      (a, b) =>
        new Date(a.scheduledAtIso).getTime() - new Date(b.scheduledAtIso).getTime()
    )
}
