export type DayKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface TimeRange {
  start: string; // "HH:mm"
  end: string;
}

export type WeeklyAvailability = Record<DayKey, TimeRange[]>;

export interface TimeSlot {
  start: string; // ISO 8601
  end: string;
}

export interface SetAvailabilityPayload extends Partial<
  Record<DayKey, TimeRange[]>
> {
  timezone: string; // IANA
  slotIntervalMinutes?: number; // 0–30, default 10
}

export interface GetAvailabilityResponse {
  schedule: WeeklyAvailability;
  timezone: string;
  slotIntervalMinutes: number;
}

export interface BookSlotPayload {
  teacherId: string; // UUID
  slotStart: string; // ISO 8601
  slotEnd: string; // ISO 8601
  studentTimezone: string;
  levelId: string; // UUID
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  availability: WeeklyAvailability;
  timezone: string;
  reviews: number;
  averageRating: number;
}

export const DAYS: DayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DEFAULT_AVAILABILITY: WeeklyAvailability = {
  sunday: [],
  monday: [{ start: "09:00", end: "17:00" }],
  tuesday: [{ start: "09:00", end: "17:00" }],
  wednesday: [{ start: "09:00", end: "17:00" }],
  thursday: [{ start: "09:00", end: "17:00" }],
  friday: [{ start: "09:00", end: "17:00" }],
  saturday: [],
};

export const BASE_URL = "http://localhost:4000";
export const TEACHER_ID = "d9051f87-2a5e-44dd-a81e-a607e4983160";
