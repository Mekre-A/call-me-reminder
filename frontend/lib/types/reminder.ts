export type ReminderStatus = "Scheduled" | "Completed" | "Failed";


export type ReminderDTO = {
  id: string;
  title: string;
  message: string;
  phone: string;
  scheduledAtIso: string;
  timezone: string;
  status: ReminderStatus;
  createdAtIso: string;
  updatedAtIso: string;
  lastError?: string | null;
};