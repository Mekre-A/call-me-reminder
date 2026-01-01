import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/reminders/status-badge";
import { ReminderActions } from "@/components/reminders/reminder-actions";
import { TimeRemaining } from "@/components/reminders/time-remaining";
import { format } from "date-fns";
import { ReminderDTO } from "@/lib/api/reminders";

function maskPhone(phone: string) {
  if (phone.length <= 6) return phone;
  return `${phone.slice(0, 4)}•••${phone.slice(-3)}`;
}

export function ReminderRow({
  reminder,
  nowMs,
  onDelete,
  disableDelete,
}: {
  reminder: ReminderDTO;
  nowMs: number;
  onDelete: (id: string) => Promise<void>;
  disableDelete?: boolean;
}) {
  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="truncate text-sm font-semibold">{reminder.title}</div>
              <StatusBadge status={reminder.status} />
              <TimeRemaining reminder={reminder} nowMs={nowMs} />
            </div>

            <div className="mt-1 line-clamp-1 text-sm text-muted-foreground">{reminder.message}</div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{format(new Date(reminder.scheduledAtIso), "EEE, MMM d • h:mm a")}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{reminder.timezone}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{maskPhone(reminder.phone)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ReminderActions id={reminder.id} title={reminder.title} onDelete={onDelete} disableDelete={disableDelete} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
