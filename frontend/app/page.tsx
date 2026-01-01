"use client";

import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { useNow } from "@/lib/hooks/use-now";
import { ReminderList } from "@/components/reminders/reminder-list";

import { useReminders } from "@/lib/hooks/use-reminders";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useDeleteReminder } from "@/lib/hooks/use-reminder-mutations";
import { ReminderStatus } from "@/lib/types/reminder";
import { StatCard } from "@/components/reminders/status-card";


export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | ReminderStatus>("all");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data, isLoading, isError, refetch, isFetching } = useReminders({ status: statusFilter, q: debouncedQuery });
  const reminders = data ?? [];
  const scheduledCount = reminders.filter((r) => r.status === "Scheduled").length;
  const completedCount = reminders.filter((r) => r.status === "Completed").length;
  const failedCount = reminders.filter((r) => r.status === "Failed").length;

  const nowMs = useNow(1000);

  const deleteMutation = useDeleteReminder();

  async function handleDelete(id: string) {
    await deleteMutation.mutateAsync(id);
  }

  return (
    <PageShell title="Upcoming reminders" description="Create a reminder and we’ll call you when it’s time.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Scheduled" value={scheduledCount} />
        <StatCard label="Completed" value={completedCount} />
        <StatCard label="Failed" value={failedCount} />
        <StatCard label="Total" value={reminders.length} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | ReminderStatus)}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="Completed">Completed</TabsTrigger>
            <TabsTrigger value="Failed">Failed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full sm:w-80">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or message…" />
        </div>
      </div>

      <div className="mt-6">
        {isLoading || isFetching ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-full max-w-xl" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-sm font-semibold">Something went wrong</div>
              <div className="mt-1 text-sm text-muted-foreground">We couldn’t load reminders. Please try again.</div>
              <Button onClick={() => refetch()} className="mt-4">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ReminderList reminders={reminders} nowMs={nowMs} onDelete={handleDelete} disableDelete={deleteMutation.isPending} />
        )}
      </div>
    </PageShell>
  );
}
