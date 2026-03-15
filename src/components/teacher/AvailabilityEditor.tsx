"use client";
import { Toggle } from "@/components/ui/Toggle";
import { DAYS, DAY_FULL, TimeRange, WeeklyAvailability } from "@/types";

interface Props {
  availability: WeeklyAvailability;
  onChange: (a: WeeklyAvailability) => void;
}

export function AvailabilityEditor({ availability, onChange }: Props) {
  function setDay(day: string, ranges: TimeRange[]) {
    onChange({ ...availability, [day]: ranges });
  }

  function toggleDay(day: string, enabled: boolean) {
    setDay(day, enabled ? [{ start: "09:00", end: "17:00" }] : []);
  }

  function updateRange(
    day: string,
    idx: number,
    field: "start" | "end",
    value: string,
  ) {
    const ranges = availability[day as keyof WeeklyAvailability].map((r, i) =>
      i === idx ? { ...r, [field]: value } : r,
    );
    setDay(day, ranges);
  }

  function addRange(day: string) {
    const ranges = availability[day as keyof WeeklyAvailability];
    const last = ranges[ranges.length - 1];
    setDay(day, [...ranges, { start: last.end, end: "18:00" }]);
  }

  function removeRange(day: string, idx: number) {
    const ranges = availability[day as keyof WeeklyAvailability].filter(
      (_, i) => i !== idx,
    );
    setDay(day, ranges.length === 0 ? [] : ranges);
  }

  return (
    <div>
      {DAYS.map((day, di) => {
        const enabled = availability[day].length > 0;
        const ranges = availability[day];
        return (
          <div className="day-row" key={day}>
            <div className="day-row-top">
              <Toggle checked={enabled} onChange={(v) => toggleDay(day, v)} />
              <span className="day-name">{DAY_FULL[di]}</span>
            </div>

            <div className="day-ranges">
              {!enabled ? (
                <span className="day-unavailable">Unavailable</span>
              ) : (
                ranges.map((range, idx) => (
                  <div className="time-range-row" key={idx}>
                    <input
                      type="time"
                      className="time-input"
                      value={range.start}
                      onChange={(e) =>
                        updateRange(day, idx, "start", e.target.value)
                      }
                    />
                    <span className="dash">—</span>
                    <input
                      type="time"
                      className="time-input"
                      value={range.end}
                      onChange={(e) =>
                        updateRange(day, idx, "end", e.target.value)
                      }
                    />
                    {idx === ranges.length - 1 && (
                      <button
                        className="icon-btn add"
                        title="Add range"
                        onClick={() => addRange(day)}
                      >
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    )}
                    {ranges.length > 1 && (
                      <button
                        className="icon-btn remove"
                        title="Remove"
                        onClick={() => removeRange(day, idx)}
                      >
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
