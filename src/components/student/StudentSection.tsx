'use client';
import { useState, useCallback } from 'react';
import { BookingCalendar } from './BookingCalendar';
import { SlotsPanel } from './SlotsPanel';
import { BookingConfirm } from './BookingConfirm';
import { DEFAULT_AVAILABILITY, TEACHER_ID, TimeSlot } from '@/types';
import { TIMEZONES } from '@/lib/timezones';
import { createBooking, fetchSlots } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

export function StudentSection() {
  const toast = useToast();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Lagos'
  );
  const [bookedEmail, setBookedEmail] = useState('');

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const selectDate = useCallback(async (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setBookedEmail('');
    setLoading(true);
    try {
      const data = await fetchSlots(TEACHER_ID, dateStr, timezone);
      setSlots(data);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to fetch available slots', 'error');
      setSlots([]);
    } finally { setLoading(false); }
  }, [timezone]);

  function onTzChange(tz: string) {
    setTimezone(tz);
    if (selectedDate) selectDate(selectedDate);
  }

  function selectSlot(slot: TimeSlot) {
    setSelectedSlot(slot);
    setBookedEmail('');
  }

  async function confirmBooking(name: string, email: string) {
    try {
      const { status, message } = await createBooking({
        teacherId: TEACHER_ID,
        slotStart: selectedSlot!.start,
        slotEnd: selectedSlot!.end,
        studentTimezone: timezone,
        levelId: '4aa70339-128b-4e81-9518-65e5b86686fb',
      });
      if (status === 409) {
        toast(message || 'This time slot is no longer available. Please select a different time.', 'error');
        await selectDate(selectedDate!);
        return;
      }
      if (status >= 400) {
        toast(message || 'Failed to book slot. Please try again.', 'error');
        return;
      }
      toast('Booking confirmed! Check your email for the Google Meet link.', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to book slot. Please try again.', 'error');
      return;
    }
    setBookedEmail(email);
    setSelectedSlot(null);
    setSelectedDate(null);
    setSlots([]);
  }

  const slotsPanel = (
    <SlotsPanel
      loading={loading}
      date={selectedDate}
      slots={slots}
      selectedSlot={selectedSlot}
      timezone={timezone}
      onSelect={selectSlot}
    />
  );

  return (
    <div className="student-layout">
      {/* LEFT: Teacher info — hidden on mobile */}
      <div className="student-sidebar">
        <div className="card teacher-info-card">
          <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 12 }}>
            <span className="card-title">Your Teacher</span>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <div className="teacher-info-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="teacher-avatar">O</div>
                <div>
                  <div className="teacher-name">Oladele Adewale</div>
                  <div className="teacher-meta">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    oladele@ourawujo.com
                  </div>
                </div>
              </div>
              <div className="divider" />
              <div className="info-row">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                30-minute sessions
              </div>
              <div className="info-row">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                West Africa Time (WAT)
              </div>
              <div className="info-row">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google Meet
              </div>
              <div className="divider" />
              <p className="caveat-note">
                Calendar synced via Google Workspace. Personal calendar events from Gmail, Outlook, or iCloud won't appear unless shared with the Workspace account.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER: Calendar + mobile slots */}
      <div>
        {/* Mobile: compact teacher info strip */}
        <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}
          id="mobile-teacher-strip">
          <style>{`
            @media (min-width: 768px) { #mobile-teacher-strip { display: none !important; } }
          `}</style>
          <div className="teacher-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>O</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Oladele Adewale</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>30 min · Google Meet · WAT</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="tz-select-wrap">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Timezone:</span>
              <select className="tz-select" value={timezone} onChange={e => onTzChange(e.target.value)}>
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            <BookingCalendar
              availability={DEFAULT_AVAILABILITY}
              selectedDate={selectedDate}
              onSelect={selectDate}
              year={year}
              month={month}
              onPrev={prevMonth}
              onNext={nextMonth}
            />
          </div>
        </div>

        {/* Mobile: slots drawer appears below calendar */}
        <div className="slots-drawer">
          {bookedEmail ? (
            <div className="card">
              <div className="empty-state">
                <svg width="48" height="48" fill="none" stroke="var(--success)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p style={{ color: 'var(--success)', fontWeight: 600 }}>Session booked!</p>
                <p style={{ marginTop: 4 }}>A Google Meet invite has been sent to {bookedEmail}</p>
              </div>
            </div>
          ) : (
            <>
              {(selectedDate || loading) && (
                <div className="card" style={{ padding: 20 }}>{slotsPanel}</div>
              )}
              {selectedSlot && (
                <div style={{ marginTop: 12 }}>
                  <BookingConfirm
                    slot={selectedSlot}
                    timezone={timezone}
                    onConfirm={confirmBooking}
                    onCancel={() => setSelectedSlot(null)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* RIGHT: Slots sidebar — desktop only */}
      <div className="slots-sidebar">
        {bookedEmail ? (
          <div className="card">
            <div className="empty-state">
              <svg width="48" height="48" fill="none" stroke="var(--success)" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p style={{ color: 'var(--success)', fontWeight: 600 }}>Session booked!</p>
              <p style={{ marginTop: 4, fontSize: 12 }}>A Google Meet invite has been sent to {bookedEmail}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="card" style={{ padding: 20, marginBottom: selectedSlot ? 16 : 0 }}>
              {slotsPanel}
            </div>
            {selectedSlot && (
              <BookingConfirm
                slot={selectedSlot}
                timezone={timezone}
                onConfirm={confirmBooking}
                onCancel={() => setSelectedSlot(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
