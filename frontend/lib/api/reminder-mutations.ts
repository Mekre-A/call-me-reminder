import { mockReminders, type Reminder } from "@/lib/reminders.mock";

function delay(ms: number = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function createReminder(input: Omit<Reminder, "id" | "status">): Promise<Reminder> {
  await delay();

  const reminder: Reminder = {
    ...input,
    id: crypto.randomUUID(),
    status: "Scheduled",
  };

  mockReminders.push(reminder);
  return reminder;
}

export async function updateReminder(id: string, input: Partial<Omit<Reminder, "id">>): Promise<Reminder> {
  await delay();

  const idx = mockReminders.findIndex((r) => r.id === id);
  if (idx === -1) {
    throw new Error("Reminder not found");
  }

  mockReminders[idx] = {
    ...mockReminders[idx],
    ...input,
  };

  return mockReminders[idx];
}

export async function deleteReminder(id: string): Promise<void> {
  await delay();

  const idx = mockReminders.findIndex((r) => r.id === id);
  if (idx === -1) {
    throw new Error("Reminder not found");
  }

  mockReminders.splice(idx, 1);
}
