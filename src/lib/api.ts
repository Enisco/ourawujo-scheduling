import {
  BASE_URL,
  BookSlotPayload,
  GetAvailabilityResponse,
  SetAvailabilityPayload,
  Teacher,
  TimeSlot,
} from "@/types";

const TEACHER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMjI1ZWNlMC04ZWU4LTQ4OTAtYTQ0Zi01ODYxOGVhYTU5M2UiLCJ0eXBlIjoiYWNjZXNzIiwic2lkIjoiMTQ4ZDliNDctZGIwMi00OTlkLWFkYzktZTk2ODFlNTVhNjZhIiwiaWF0IjoxNzczNTU4NzcwLCJleHAiOjE3NzM1NjIzNzB9.Q_N972Hi5hAWN6BmJxkZx9os8Af5ouquZg-PjNl7tqk";

// TODO: Replace with real student token
const STUDENT_TOKEN = "PLACEHOLDER_STUDENT_TOKEN";

function teacherHeaders(withBody = true): HeadersInit {
  const headers: HeadersInit = { Authorization: `Bearer ${TEACHER_TOKEN}` };
  if (withBody) headers["Content-Type"] = "application/json";
  return headers;
}

function studentHeaders(withBody = true): HeadersInit {
  const headers: HeadersInit = { Authorization: `Bearer ${STUDENT_TOKEN}` };
  if (withBody) headers["Content-Type"] = "application/json";
  return headers;
}

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Teacher Availability ────────────────────────────────────────────

export async function saveAvailability(
  payload: SetAvailabilityPayload,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/teachers/availability`, {
    method: "POST",
    headers: teacherHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save availability");
}

export async function patchAvailability(
  payload: Partial<SetAvailabilityPayload>,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/teachers/availability`, {
    method: "PATCH",
    headers: teacherHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update availability");
}

export async function getAvailability(): Promise<GetAvailabilityResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/teachers/availability`, {
    headers: teacherHeaders(false),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch availability");
  const json = await res.json();
  return json.data;
}

// ─── Student: Browse Teachers ────────────────────────────────────────

export async function fetchTeachersForLevel(levelId: string): Promise<Teacher[]> {
  const res = await fetch(`${BASE_URL}/api/v1/levels/${levelId}/teachers`, {
    headers: studentHeaders(false),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch teachers");
  const json = await res.json();
  return json.data;
}

// ─── Student: Slots & Booking ────────────────────────────────────────

export async function fetchSlots(
  teacherId: string,
  dateStr: string,
  studentTimezone: string,
): Promise<TimeSlot[]> {
  const res = await fetch(
    `${BASE_URL}/api/v1/availability/${teacherId}/slots?date=${dateStr}&studentTimezone=${encodeURIComponent(studentTimezone)}`,
    {
      headers: studentHeaders(false),
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch slots");
  const json = await res.json();
  return json.data?.slots || [];
}

export async function createBooking(
  payload: BookSlotPayload,
): Promise<{ status: number }> {
  const res = await fetch(`${BASE_URL}/api/v1/enrollments/ba-mi-soro/book`, {
    method: "POST",
    headers: studentHeaders(),
    body: JSON.stringify(payload),
  });
  return { status: res.status };
}

// ─── Helpers ─────────────────────────────────────────────────────────

export function formatDateLabel(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function toDateStr(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}
