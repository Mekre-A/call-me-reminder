"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

import { getMockReminderById } from "@/lib/reminders.mock";
import { useUpdateReminder } from "@/lib/hooks/use-reminder-mutations";

const reminderSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(60).trim(),
  message: z.string().min(1, "Message is required").max(500).trim(),
  phone: z
    .string()
    .min(8, "Phone number looks too short")
    .max(20)
    .regex(/^\+?[1-9]\d{7,14}$/, "Use E.164 format, e.g. +14155552671"),
  datetimeLocal: z.string().min(1, "Date & time is required"),
  timezone: z.string().min(1, "Timezone is required"),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

function toDatetimeLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export default function EditReminderPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const updateMutation = useUpdateReminder();

  const reminder = useMemo(() => (id ? getMockReminderById(id) : null), [id]);

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: reminder
      ? {
          title: reminder.title,
          message: reminder.message,
          phone: reminder.phone,
          datetimeLocal: toDatetimeLocalInput(reminder.scheduledAtIso),
          timezone: reminder.timezone,
        }
      : {
          title: "",
          message: "",
          phone: "",
          datetimeLocal: "",
          timezone: "UTC",
        },
    mode: "onChange",
  });

  const isSubmitting = updateMutation.isPending;
  const isValid = form.formState.isValid;
  const messageValue = form.watch("message");

  function validateFuture(datetimeLocal: string) {
    const ms = new Date(datetimeLocal).getTime();
    if (Number.isNaN(ms)) return "Invalid date/time";
    if (ms <= Date.now()) return "Date/time must be in the future";
    return null;
  }

  async function onSubmit(values: ReminderFormValues) {
    const futureError = validateFuture(values.datetimeLocal);
    if (futureError) {
      form.setError("datetimeLocal", { type: "manual", message: futureError });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        input: {
          title: values.title,
          message: values.message,
          phone: values.phone,
          timezone: values.timezone,
          scheduledAtIso: new Date(values.datetimeLocal).toISOString(),
        },
      });

      toast.success("Reminder updated");
      router.push("/");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update reminder");
    }
  }

  if (!reminder) {
    return (
      <PageShell title="Reminder not found" description="That reminder ID doesn't exist in mock data.">
        <Card className="max-w-2xl">
          <CardContent className="py-10">
            <div className="text-sm text-muted-foreground">Try editing one of the mock reminders from the dashboard.</div>
            <Button asChild className="mt-4">
              <Link href="/">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell title="Edit reminder" description="Update details. Changes will apply to the next scheduled call.">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Reminder details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pay rent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What should we say on the call?" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormDescription className="flex items-center justify-between">
                      <span>This is the text that will be spoken during the call.</span>
                      <span className="tabular-nums">{messageValue?.length ?? 0}/500</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="+14155552671" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="datetimeLocal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date & time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
                    </FormControl>
                    <FormDescription>Auto-detected/stored timezone.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="ghost" asChild>
                  <Link href="/">Cancel</Link>
                </Button>

                <Button type="submit" disabled={!isValid || isSubmitting}>
                  {isSubmitting ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
