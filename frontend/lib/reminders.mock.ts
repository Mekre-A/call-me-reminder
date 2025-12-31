export type ReminderStatus = "Scheduled" | "Completed" | "Failed"

export type Reminder = {
  id: string
  title: string
  message: string
  phone: string
  scheduledAtIso: string 
  timezone: string
  status: ReminderStatus
}

export const mockReminders: Reminder[] = [
  {
    id: "r1",
    title: "Pay rent",
    message: "Pay the rent today.",
    phone: "+14155552671",
    scheduledAtIso: new Date(Date.now() + 1000 * 60 * 7).toISOString(),
    timezone: "Africa/Addis_Ababa",
    status: "Scheduled",
  },
  {
    id: "r2",
    title: "Stretch",
    message: "Stand up and stretch your shoulders and neck.",
    phone: "+14155550000",
    scheduledAtIso: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    timezone: "Africa/Addis_Ababa",
    status: "Scheduled",
  },
  {
    id: "r3",
    title: "Follow up",
    message: "Follow up with the client about the proposal.",
    phone: "+447700900000",
    scheduledAtIso: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    timezone: "Africa/Addis_Ababa",
    status: "Completed",
  },
  {
    id: "r4",
    title: "Call attempt failed",
    message: "This is a failed reminder example.",
    phone: "+33123456789",
    scheduledAtIso: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    timezone: "Africa/Addis_Ababa",
    status: "Failed",
  },
]

export function getMockReminderById(id: string) {
  return mockReminders.find((r) => r.id === id) || null
}
