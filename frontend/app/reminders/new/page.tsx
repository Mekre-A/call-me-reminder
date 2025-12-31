"use client";

import { useMemo } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useCreateReminder } from "@/lib/hooks/use-reminder-mutations";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

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

function getLocalTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export default function NewReminderPage() {
  const tz = useMemo(() => getLocalTimezone(), []);
  const router = useRouter();
  const createMutation = useCreateReminder();

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: "",
      message: "",
      phone: "",
      datetimeLocal: "",
      timezone: tz,
    },
    mode: "onChange",
  });

  const isSubmitting = createMutation.isPending;

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
      await createMutation.mutateAsync({
        title: values.title,
        message: values.message,
        phone: values.phone,
        timezone: values.timezone,
        scheduledAtIso: new Date(values.datetimeLocal).toISOString(),
      });

      toast.success("Reminder scheduled");
      router.push("/");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to schedule reminder");
    }
  }

  return (
    <PageShell title="New reminder" description="We’ll call the number and speak your message at the scheduled time.">
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
                    <FormDescription>Short and clear.</FormDescription>
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
                      <FormDescription>E.164 recommended.</FormDescription>
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
                      <FormDescription>Must be in the future.</FormDescription>
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
                    <FormDescription>Auto-detected from your device.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="ghost" asChild>
                  <Link href="/">Cancel</Link>
                </Button>

                <Button type="submit" disabled={!isValid || isSubmitting}>
                  {isSubmitting ? "Scheduling…" : "Schedule reminder"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
