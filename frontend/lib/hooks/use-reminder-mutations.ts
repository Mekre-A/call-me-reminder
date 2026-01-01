import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReminder, updateReminder, deleteReminder } from "@/lib/api/reminders";
import { type ReminderStatus } from "@/lib/types/reminder";


export function useCreateReminder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { title: string; message: string; phone: string; scheduledAtIso: string; timezone: string }) =>
      createReminder(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useUpdateReminder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (args: {
      id: string;
      patch: Partial<{
        title: string;
        message: string;
        phone: string;
        scheduledAtIso: string;
        timezone: string;
        status: ReminderStatus;
        lastError: string | null;
      }>;
    }) => updateReminder({ id: args.id, patch: args.patch }),
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
