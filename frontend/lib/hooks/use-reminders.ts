import { useQuery } from "@tanstack/react-query";
import { listReminders, getReminder } from "@/lib/api/reminders";

export function useReminders(params: { status?: any; q?: string }) {
  return useQuery({
    queryKey: ["reminders", params],
    queryFn: () => listReminders({ status: params.status, q: params.q }),
  });
}

export function useReminder(id?: string) {
  return useQuery({
    queryKey: ["reminder", id],
    queryFn: () => getReminder(id as string),
    enabled: !!id,
  });
}