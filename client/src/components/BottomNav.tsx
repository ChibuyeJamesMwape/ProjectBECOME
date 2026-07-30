import { color, font } from "../theme";
import { TABS, type Tab } from "./tabs";
import type { Gates } from "../types";

export type { Tab };

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
