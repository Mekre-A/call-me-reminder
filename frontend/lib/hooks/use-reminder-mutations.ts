import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReminder, updateReminder, deleteReminder } from "@/lib/api/reminder-mutations";
import type { Reminder } from "@/lib/reminders.mock";
import type { RemindersQuery } from "@/lib/api/reminders";

export function useCreateReminder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<Reminder, "id" | "status">) => createReminder(input),
    onSuccess: () => {
      
      qc.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useUpdateReminder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (args: { id: string; input: Partial<Omit<Reminder, "id">> }) => updateReminder(args.id, args.input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useDeleteReminder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReminder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}
