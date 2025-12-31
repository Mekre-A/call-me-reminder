import { useQuery } from "@tanstack/react-query"
import { listReminders, type RemindersQuery } from "@/lib/api/reminders"

export function useReminders(query: RemindersQuery) {
  return useQuery({
    queryKey: ["reminders", query],
    queryFn: () => listReminders(query),
  })
}
