'use client';
import { useState } from 'react';
import { TimeSlot } from '@/types';

interface Props {
  slot: TimeSlot;
  timezone: string;
  onConfirm: (name: string, email: string) => Promise<void>;
  onCancel: () => void;
}

function fmtTime(iso: string, tz: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: tz });
}

function fmtDateFull(iso: string, tz: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: tz,
  });
}

export function BookingConfirm({ slot, timezone, onConfirm, onCancel }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    await onConfirm(name, email);
    setLoading(false);
  }

  return (
    <div className="booking-confirm">
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Confirm Booking</div>
      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Review your session details</div>

      <div className="booking-summary">
        <div className="summary-row">
          <span className="summary-label">Date</span>
          <span className="summary-value">{fmtDateFull(slot.start, timezone)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Time</span>
          <span className="summary-value">{fmtTime(slot.start, timezone)} – {fmtTime(slot.end, timezone)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Timezone</span>
          <span className="summary-value">{timezone}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Platform</span>
          <span className="summary-value">Google Meet</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Your Name</label>
        <input className="form-input" type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="form-group" style={{ marginBottom: 16 }}>
        <label className="form-label">Your Email</label>
        <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        <button
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={handleConfirm}
          disabled={loading || !name.trim() || !email.trim()}
        >
          {loading ? 'Booking…' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}
