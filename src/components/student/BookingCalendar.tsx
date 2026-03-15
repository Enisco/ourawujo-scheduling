'use client';
import { DAYS, DAY_LABELS, MONTHS, WeeklyAvailability } from '@/types';
import { toDateStr } from '@/lib/api';

interface Props {
  availability: WeeklyAvailability;
  selectedDate: string | null;
  onSelect: (date: string) => void;
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export function BookingCalendar({ availability, selectedDate, onSelect, year, month, onPrev, onNext }: Props) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <>
      <div className="cal-header">
        <div className="cal-month">{MONTHS[month]} {year}</div>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={onPrev} aria-label="Previous month">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="cal-nav-btn" onClick={onNext} aria-label="Next month">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="cal-grid">
        {DAY_LABELS.map(d => (
          <div className="cal-day-header" key={d}>{d}</div>
        ))}

        {Array.from({ length: startOffset }).map((_, i) => (
          <div className="cal-day empty" key={`e-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const date = new Date(year, month, d);
          const dayName = DAYS[date.getDay()];
          const isAvailable = availability[dayName]?.length > 0;
          const isPast = date < today;
          const isToday = date.getTime() === today.getTime();
          const dateStr = toDateStr(year, month, d);
          const isSelected = dateStr === selectedDate;

          let cls = 'cal-day';
          if (isSelected) cls += ' selected';
          else if (isPast || !isAvailable) cls += ' past';
          else cls += ' available';
          if (isToday && !isSelected && isAvailable && !isPast) cls += ' today';

          const clickable = isAvailable && !isPast;

          return (
            <div
              key={d}
              className={cls}
              onClick={clickable ? () => onSelect(dateStr) : undefined}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onKeyDown={clickable ? (e) => e.key === 'Enter' && onSelect(dateStr) : undefined}
              aria-label={clickable ? `Select ${dateStr}` : undefined}
            >
              {d}
              {isAvailable && !isPast && <div className="dot" />}
            </div>
          );
        })}
      </div>
    </>
  );
}
