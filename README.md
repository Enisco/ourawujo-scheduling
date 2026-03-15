# Ourawujo Scheduling — Frontend

Cal.com-style scheduling frontend built with **Next.js 14 (App Router)** and **TypeScript**.

## Stack

- Next.js 14 (App Router, `'use client'` components)
- TypeScript
- Pure CSS (no Tailwind) — design tokens via CSS variables
- `date-fns` / `date-fns-tz` for date utilities
- Google Fonts: DM Serif Display + DM Sans

## Project Structure

```
src/
├── app/
│   ├── globals.css         # All styles, mobile-first responsive
│   ├── layout.tsx
│   └── page.tsx            # Root page with tab switching
├── components/
│   ├── teacher/
│   │   ├── TeacherSection.tsx      # Weekly availability + settings
│   │   ├── AvailabilityEditor.tsx  # Day toggle + time range editor
│   │   └── OutOfOffice.tsx         # OOO period management
│   ├── student/
│   │   ├── StudentSection.tsx      # Full booking flow
│   │   ├── BookingCalendar.tsx     # Month calendar grid
│   │   ├── SlotsPanel.tsx          # Available time slots
│   │   └── BookingConfirm.tsx      # Name/email + confirm
│   └── ui/
│       ├── Toast.tsx               # Global toast context
│       └── Toggle.tsx              # Day toggle switch
├── lib/
│   └── api.ts              # API calls + mock fallbacks
└── types/
    └── index.ts            # Shared types + constants
```

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app connects to `http://localhost:4000` (your NestJS backend). All API calls degrade gracefully to demo/mock mode if the backend is not running.

## API Endpoints Used

| Method | Path                                                 | Description                  |
| ------ | ---------------------------------------------------- | ---------------------------- |
| POST   | `/api/availability`                                  | Save teacher weekly schedule |
| GET    | `/api/availability/:teacherId/slots?date=&timezone=` | Fetch free slots             |
| POST   | `/api/availability/bookings`                         | Book a slot                  |
| POST   | `/api/availability/out-of-office`                    | Add OOO period               |

## Mobile Responsiveness

- **< 640px**: Single column, slots appear below calendar, compact teacher strip
- **768px–1023px**: Teacher info sidebar + calendar in 2 columns, slots below calendar
- **≥ 1024px**: Full 3-column layout (teacher info | calendar | slots sidebar)

## Environment

Set `BASE_URL` in `src/types/index.ts` to point to your backend:

```ts
export const BASE_URL = "http://localhost:4000";
```
