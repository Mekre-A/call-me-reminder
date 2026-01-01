"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export type ReminderFormValues = z.infer<typeof reminderSchema>;

function getLocalTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function toDatetimeLocalInput(isoUtc: string, timeZone: string) {;
  return formatInTimeZone(new Date(isoUtc), timeZone, "yyyy-MM-dd'T'HH:mm");
}

function validateFuture(datetimeLocal: string, timeZone: string) {
  const ms = fromZonedTime(datetimeLocal, timeZone).getTime();
  if (Number.isNaN(ms)) return "Invalid date/time";
  if (ms <= Date.now()) return "Date/time must be in the future";
  return null;
}

type Props = {
  mode: "create" | "edit";
  title: string;
  description: string;

  // for Edit: pass initial from server data; for Create: pass empty defaults
  initialValues?: Partial<ReminderFormValues>

  onSubmit: (payload: {
    title: string;
    message: string;
    phone: string;
    timezone: string;
    scheduledAtIso: string;
  }) => Promise<void>;

  submitLabel: string;
  submittingLabel: string;
  cancelHref?: string;
};

export function ReminderForm({
  mode,
  title,
  description,
  initialValues,
  onSubmit,
  submitLabel,
  submittingLabel,
  cancelHref = "/",
}: Props) {
  const tz = useMemo(() => getLocalTimezone(), []);

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

  useEffect(() => {
    if (!initialValues) return;

    const timezone = initialValues.timezone ?? tz;
    const datetimeLocal = initialValues.datetimeLocal ? toDatetimeLocalInput(initialValues.datetimeLocal, timezone) : ""

    form.reset({
      title: initialValues.title ?? "",
      message: initialValues.message ?? "",
      phone: initialValues.phone ?? "",
      timezone,
      datetimeLocal,
    });
  }, [initialValues, form, tz, mode]);

  const isValid = form.formState.isValid;
  const isSubmitting = form.formState.isSubmitting;
  const messageValue = form.watch("message");

  async function handleSubmit(values: ReminderFormValues) {
    const futureError = validateFuture(values.datetimeLocal, values.timezone);
    if (futureError) {
      form.setError("datetimeLocal", { type: "manual", message: futureError });
      return;
    }

    try {
      await onSubmit({
        title: values.title,
        message: values.message,
        phone: values.phone,
        timezone: values.timezone,
        scheduledAtIso: fromZonedTime(values.datetimeLocal, values.timezone).toISOString(),
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save reminder");
      throw e;
    }
  }

  return (
    <PageShell title={title} description={description}>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Reminder details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  <Link href={cancelHref}>Cancel</Link>
                </Button>

                <Button type="submit" disabled={!isValid || isSubmitting}>
                  {isSubmitting ? submittingLabel : submitLabel}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
