"use client";
import { StudentSection } from "@/components/student/StudentSection";
import { TeacherSection } from "@/components/teacher/TeacherSection";
import { ToastProvider } from "@/components/ui/Toast";
import { useState } from "react";

type Tab = "teacher" | "student";

export default function Home() {
  const [tab, setTab] = useState<Tab>("teacher");

  return (
    <ToastProvider>
      <div className="app">
        {/* Topbar */}
        <header className="topbar">
          <div className="logo">
            awujo<span>.</span>
          </div>

          <nav className="tab-nav" role="tablist">
            <button
              className={`tab-btn ${tab === "teacher" ? "active" : ""}`}
              onClick={() => setTab("teacher")}
              role="tab"
              aria-selected={tab === "teacher"}
            >
              Teacher Portal
            </button>
            <button
              className={`tab-btn ${tab === "student" ? "active" : ""}`}
              onClick={() => setTab("student")}
              role="tab"
              aria-selected={tab === "student"}
            >
              Student Booking
            </button>
          </nav>

          <div
            style={{
              fontSize: 11,
              color: "var(--muted)",
              flexShrink: 0,
              display: "none",
            }}
            id="url-label"
          >
            localhost:4000
          </div>
          <style>{`@media (min-width: 640px) { #url-label { display: block !important; } }`}</style>
        </header>

        <main className="main">
          {tab === "teacher" && (
            <div>
              <div className="page-header">
                <div className="page-title">Manage Your Schedule</div>
                <div className="page-subtitle">
                  Set your weekly availability and block time off
                </div>
              </div>
              <TeacherSection />
            </div>
          )}

          {tab === "student" && (
            <div>
              <div className="page-header">
                <div className="page-title">Book a Session</div>
                <div className="page-subtitle">
                  Select a date and time that works for you
                </div>
              </div>
              <StudentSection />
            </div>
          )}
        </main>
      </div>
    </ToastProvider>
  );
}
