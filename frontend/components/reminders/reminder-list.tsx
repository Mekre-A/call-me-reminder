import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Reminder } from "@/lib/reminders.mock";
import { ReminderRow } from "@/components/reminders/reminder-row";

export function ReminderList({
  reminders,
  nowMs,
  onDelete,
  disableDelete,
}: {
  reminders: Reminder[];
  nowMs: number;
  onDelete: (id: string) => Promise<void>;
  disableDelete?: boolean;
}) {
  if (reminders.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-14 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border bg-background">
            <span className="text-lg">📞</span>
          </div>
          <div className="text-base font-semibold">No reminders found</div>
          <div className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Try adjusting filters/search, or create a new reminder.</div>
          <Button asChild className="mt-6">
            <Link href="/reminders/new">Create reminder</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {reminders.map((r) => (
        <ReminderRow key={r.id} reminder={r} nowMs={nowMs} onDelete={onDelete} disableDelete={disableDelete} />
      ))}
    </div>
  );
}
