import { color, font } from "../theme";
import type { Gates } from "../types";

export type Tab = "path" | "journal" | "actions" | "data" | "circle";

const TABS: { key: Tab; label: string; lockIdx: number | null; icon: JSX.Element }[] = [
  {
    key: "path",
    label: "PATH",
    lockIdx: null,
    icon: (
      <>
        <path d="M3 21h18" />
        <path d="M6 21V8l6-5 6 5v13" />
      </>
    ),
  },
  {
    key: "journal",
    label: "JOURNAL",
    lockIdx: 1,
    icon: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
  },
  {
    key: "actions",
    label: "ACTIONS",
    lockIdx: 2,
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
  {
    key: "data",
    label: "DATA",
    lockIdx: 3,
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 5-6" />
      </>
    ),
  },
  {
    key: "circle",
    label: "CIRCLE",
    lockIdx: 4,
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
];

export function BottomNav({ tab, onChange, gates }: { tab: Tab; onChange: (t: Tab) => void; gates: Gates }) {
  return (
    <div style={{ flex: "none", height: 66, display: "flex", borderTop: "1px solid rgba(245,241,232,0.07)", background: "#12100C" }}>
      {TABS.map((t) => {
        const active = tab === t.key;
        const locked = t.lockIdx !== null && gates.locked[t.lockIdx];
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              flex: 1,
              border: "none",
              background: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              color: active ? color.gold : color.faint,
              position: "relative",
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              {t.icon}
            </svg>
            <span style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: 1.5 }}>{t.label}</span>
            {locked && (
              <span style={{ position: "absolute", top: 10, right: 16, width: 6, height: 6, borderRadius: 99, background: color.faint }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
