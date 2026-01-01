import { ReminderDTO, ReminderStatus } from "@/lib/types/reminder";
import { normalizeUtcIso, toQuery } from "../utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

function mapFromApi(r: any): ReminderDTO {
  return {
    id: r.id,
    title: r.title,
    message: r.message,
    phone: r.phone,
    scheduledAtIso: normalizeUtcIso(r.scheduled_at),
    timezone: r.timezone,
    status: r.status,
    createdAtIso: normalizeUtcIso(r.created_at),
    updatedAtIso: normalizeUtcIso(r.updated_at),
    lastError: r.last_error ?? null,
  };
}

function assertOk(res: Response) {
  if (res.ok) return;
  return res
    .json()
    .catch(() => null)
    .then((body) => {
      const detail = body?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail
              .map((d) => d?.msg)
              .filter(Boolean)
              .join(", ")
          : res.statusText;

      throw new Error(msg || `Request failed (${res.status})`);
    });
}

export async function getReminder(id: string): Promise<ReminderDTO> {
  const res = await fetch(`${API_BASE_URL}/reminders/${id}`, { cache: "no-store" });
  await assertOk(res);
  return mapFromApi(await res.json());
}

export async function listReminders(params: { status?: ReminderStatus; q?: string }): Promise<ReminderDTO[]> {
  const status = typeof params.status === "string" && params.status.toLowerCase() === "all" ? undefined : params.status;
  const qs = toQuery({ status, q: params.q });
  const res = await fetch(`${API_BASE_URL}/reminders${qs}`, { cache: "no-store" });
  await assertOk(res);
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapFromApi) : [];
}

export async function createReminder(input: {
  title: string;
  message: string;
  phone: string;
  scheduledAtIso: string;
  timezone: string;
}): Promise<ReminderDTO> {
  const res = await fetch(`${API_BASE_URL}/reminders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: input.title,
      message: input.message,
      phone: input.phone,
      scheduled_at: input.scheduledAtIso,
      timezone: input.timezone,
    }),
  });

  await assertOk(res);
  return mapFromApi(await res.json());
}

export async function updateReminder(input: {
  id: string;
  patch: Partial<{
    title: string;
    message: string;
    phone: string;
    scheduledAtIso: string;
    timezone: string;
    status: ReminderStatus;
    lastError: string | null;
  }>;
}): Promise<ReminderDTO> {
  const body: any = {};
  if (input.patch.title !== undefined) body.title = input.patch.title;
  if (input.patch.message !== undefined) body.message = input.patch.message;
  if (input.patch.phone !== undefined) body.phone = input.patch.phone;
  if (input.patch.timezone !== undefined) body.timezone = input.patch.timezone;
  if (input.patch.status !== undefined) body.status = input.patch.status;
  if (input.patch.lastError !== undefined) body.last_error = input.patch.lastError;

  if (input.patch.scheduledAtIso !== undefined) {
    body.scheduled_at = input.patch.scheduledAtIso;
  }

  const res = await fetch(`${API_BASE_URL}/reminders/${input.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  await assertOk(res);
  return mapFromApi(await res.json());
}

export async function deleteReminder(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/reminders/${id}`, { method: "DELETE" });
  if (res.status === 204) return;
  await assertOk(res);
}
