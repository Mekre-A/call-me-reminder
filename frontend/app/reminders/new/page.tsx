"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ReminderForm } from "@/components/reminders/reminder-form";
import { useCreateReminder } from "@/lib/hooks/use-reminder-mutations";

export default function NewReminderPage() {
  const router = useRouter();
  const createMutation = useCreateReminder();

  return (
    <ReminderForm
      mode="create"
      title="New reminder"
      description="We’ll call the number and speak your message at the scheduled time."
      submitLabel={createMutation.isPending ? "Scheduling…" : "Schedule reminder"}
      submittingLabel="Scheduling…"
      onSubmit={async (payload) => {
        await createMutation.mutateAsync(payload);
        toast.success("Reminder scheduled");
        router.push("/");
      }}
    />
  );
}
