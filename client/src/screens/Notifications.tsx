import { useEffect, useState } from "react";
import { color, font } from "../theme";
import { ScreenHeader } from "../components/ui";
import { api } from "../api";
import type { NotificationSettings } from "../types";

const ROWS: { key: keyof NotificationSettings; label: string; desc: string }[] = [
  { key: "journal", label: "Journal reminder", desc: "DAILY · 06:00" },
  { key: "actions", label: "Aligned actions check", desc: "DAILY · 19:30" },
  { key: "review", label: "Weekly design review", desc: "SUNDAYS · 17:00" },
];

export function Notifications({ onBack }: { onBack: () => void }) {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);

  useEffect(() => {
    api.getNotifications().then(setSettings);
  }, []);

  async function toggle(key: keyof NotificationSettings) {
    if (!settings) return;
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await api.patchNotifications({ [key]: next[key] });
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <ScreenHeader label="REMINDERS" onBack={onBack} />
      <div className="hidebar" style={{ flex: 1, overflowY: "auto", padding: "24px 22px 30px" }}>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: color.dim, margin: "0 0 20px" }}>
          The system will remind you. It will not do the work for you, and it will not mark anything complete on your
          behalf.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ROWS.map((r) => {
            const on = settings?.[r.key] ?? false;
            return (
              <button
                key={r.key}
                onClick={() => toggle(r.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  width: "100%",
                  minHeight: 64,
                  padding: "14px 16px",
                  background: color.bgPanel,
                  border: "1px solid rgba(245,241,232,0.07)",
                  borderRadius: 16,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: color.cream }}>{r.label}</div>
                  <div style={{ fontFamily: font.mono, fontSize: 9.5, letterSpacing: 1, color: color.faint, marginTop: 3 }}>{r.desc}</div>
                </div>
                <span style={{ flex: "none", width: 46, height: 27, borderRadius: 999, background: on ? color.gold : color.track, position: "relative", transition: "background .2s" }}>
                  <span style={{ position: "absolute", top: 2.5, left: on ? 21 : 3, width: 22, height: 22, borderRadius: 999, background: color.cream, transition: "left .2s" }} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
