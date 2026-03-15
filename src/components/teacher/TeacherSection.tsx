"use client";
import { useToast } from "@/components/ui/Toast";
import { getAvailability, patchAvailability, saveAvailability } from "@/lib/api";
import { TIMEZONES } from "@/lib/timezones";
import {
  DEFAULT_AVAILABILITY,
  SetAvailabilityPayload,
  WeeklyAvailability,
} from "@/types";
import { useEffect, useState } from "react";
import { AvailabilityEditor } from "./AvailabilityEditor";

export function TeacherSection() {
  const toast = useToast();
  const [availability, setAvailability] =
    useState<WeeklyAvailability>(DEFAULT_AVAILABILITY);
  const [timezone, setTimezone] = useState("Africa/Lagos");
  const [slotInterval, setSlotInterval] = useState("10");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const data = await getAvailability();
        setAvailability(data.schedule);
        setTimezone(data.timezone);
        setSlotInterval(String(data.slotIntervalMinutes));
        setHasExisting(true);
      } catch {
        // No existing schedule — keep defaults for first-time setup
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const payload: SetAvailabilityPayload = {
        ...availability,
        timezone,
        slotIntervalMinutes: parseInt(slotInterval),
      };
      if (hasExisting) {
        await patchAvailability(payload);
      } else {
        await saveAvailability(payload);
        setHasExisting(true);
      }
      toast("Availability saved successfully!", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to save availability",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="teacher-layout">
        <div className="card">
          <div className="card-body">
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <p>Loading schedule...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="teacher-layout">
        {/* Availability card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              {hasExisting ? "Update Weekly Schedule" : "Set Weekly Schedule"}
            </span>
            <span className="badge badge-accent">Mon–Fri</span>
          </div>
          <div style={{ padding: "0 20px" }} className="avail-body">
            <AvailabilityEditor
              availability={availability}
              onChange={setAvailability}
            />
          </div>
          <div className="card-footer">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                "Saving…"
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="17,21 17,13 7,13 7,21" />
                    <polyline points="7,3 7,8 15,8" />
                  </svg>
                  {hasExisting ? "Update Availability" : "Save Availability"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Settings card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Slot Settings</span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Your Timezone</label>
              <select
                className="form-input"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Slot Interval (minutes)</label>
              <select
                className="form-input"
                value={slotInterval}
                onChange={(e) => setSlotInterval(e.target.value)}
              >
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
