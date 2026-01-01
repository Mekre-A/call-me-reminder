"use client";

import { toast } from "sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ReminderForm } from "@/components/reminders/reminder-form";
import { useReminder } from "@/lib/hooks/use-reminders";
import { useUpdateReminder } from "@/lib/hooks/use-reminder-mutations";

export default function EditReminderPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const updateMutation = useUpdateReminder();

  const { data: reminder, isLoading } = useReminder(id);

  if (isLoading) {
    return (
      <PageShell title="Edit reminder" description="Loading reminder...">
        <Card className="max-w-2xl">
          <CardContent className="py-10">
            <div className="text-sm text-muted-foreground">Loading…</div>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  if (!reminder) {
    return (
      <PageShell title="Reminder not found" description="That reminder ID doesn't exist.">
        <Card className="max-w-2xl">
          <CardContent className="py-10">
            <div className="text-sm text-muted-foreground">This reminder may have been deleted.</div>
            <Button asChild className="mt-4">
              <Link href="/">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <ReminderForm
      mode="edit"
      title="Edit reminder"
      description="Update details. Changes will apply to the next scheduled call."
      initialValues={{
        title: reminder.title,
        message: reminder.message,
        phone: reminder.phone,
        timezone: reminder.timezone,
        datetimeLocal: reminder.scheduledAtIso,
      }}
      submitLabel="Save changes"
      submittingLabel="Saving…"
      onSubmit={async (payload) => {
        await updateMutation.mutateAsync({
          id,
          patch: payload,
        });
        toast.success("Reminder updated");
        router.push("/");
      }}
    />
  );
}
