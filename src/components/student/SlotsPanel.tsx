'use client';
import { TimeSlot } from '@/types';
import { formatDateLabel } from '@/lib/api';

interface Props {
  loading: boolean;
  date: string | null;
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  timezone: string;
  onSelect: (slot: TimeSlot) => void;
}

function fmtTime(iso: string, tz: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', timeZone: tz,
  });
}

export function SlotsPanel({ loading, date, slots, selectedSlot, timezone, onSelect }: Props) {
  if (!date) {
    return (
      <div className="empty-state">
        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <p>Select a date to<br />see available times</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-dots">
        <span /><span /><span />
      </div>
    );
  }

  const dateLabel = formatDateLabel(date);

  if (slots.length === 0) {
    return (
      <>
        <div className="slots-date-title">{dateLabel}</div>
        <div className="empty-state" style={{ padding: '28px 0' }}>
          <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>No available slots<br />on this day</p>
        </div>
      </>
    );
  }

  return (
    <div className="slots-panel">
      <div>
        <div className="slots-date-title">{dateLabel}</div>
        <div className="slots-tz">Times in {timezone.replace('_', ' ')}</div>
      </div>
      <div className="slots-grid">
        {slots.map((slot, i) => {
          const isSelected = selectedSlot?.start === slot.start;
          return (
            <button
              key={i}
              className={`slot-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(slot)}
            >
              {fmtTime(slot.start, timezone)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
