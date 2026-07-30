import { useEffect, useState } from "react";
import { color, font } from "../../theme";
import { CheckIcon, LockedCard } from "../../components/ui";
import { api } from "../../api";
import { fmtShort, todayISO } from "../../date";
import type { Gates } from "../../types";

function pct(x: number, y: number) {
  return Math.min(100, Math.round((100 * Math.min(x, y)) / y));
}

const RING_C = 389.6;

export function Data({ gates }: { gates: Gates }) {
  const locked = gates.locked[3];
  const [history, setHistory] = useState<{ date: string; journal: boolean; habits: boolean }[] | null>(null);

  useEffect(() => {
    if (locked) return;
    api.getGateHistory(14).then(setHistory);
  }, [locked]);

  if (locked) {
    return (
      <div style={{ padding: "24px 22px 28px" }}>
        <Header />
        <LockedCard
          title="Fourteen aligned days."
          body="The dashboard opens when your record shows fourteen consecutive days with every aligned action complete. Consistency is the only key that fits."
          pct={pct(gates.habits.best, gates.thresholds.habitGateDays)}
          label={`${Math.min(gates.habits.best, gates.thresholds.habitGateDays)} OF ${gates.thresholds.habitGateDays} DAYS`}
        />
      </div>
    );
  }

  if (!history) return <div style={{ padding: "24px 22px 28px" }}><Header /></div>;

  const cVal = Math.min(gates.consistency.cur, gates.thresholds.consistencyGateDays);
  const ringOff = (RING_C * (1 - cVal / gates.thresholds.consistencyGateDays)).toFixed(1);

  const milestones = [
    { label: "Audit registered", detail: `EXPOSURE · ${gates.thresholds.auditMinChars}+ CHARACTERS`, done: gates.done[0] },
    { label: "Seven days internalized", detail: "JOURNAL · CONSECUTIVE", done: gates.done[1] },
    { label: "Fourteen days reinforced", detail: "ACTIONS · ALL CHECKED", done: gates.done[2] },
    { label: "Thirty days consistent", detail: "JOURNAL AND ACTIONS TOGETHER", done: gates.done[3] },
  ];

  return (
    <div style={{ padding: "24px 22px 28px" }}>
      <Header />
      <div style={{ display: "flex", justifyContent: "center", margin: "6px 0 4px" }}>
        <div style={{ position: "relative", width: 170, height: 170 }}>
          <svg width="170" height="170" viewBox="0 0 170 170" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="85" cy="85" r="62" fill="none" stroke={color.track} strokeWidth="10" />
            <circle
              cx="85"
              cy="85"
              r="62"
              fill="none"
              stroke={color.gold}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={ringOff}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 42, lineHeight: 1 }}>{gates.consistency.cur}</div>
            <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: 2, color: color.dimmer, marginTop: 4 }}>CONSISTENT DAYS</div>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 1, color: color.dimmer, textAlign: "center", marginBottom: 20 }}>
        {Math.min(gates.consistency.best, gates.thresholds.consistencyGateDays)} OF {gates.thresholds.consistencyGateDays} CONSISTENT DAYS
      </div>
      <div style={{ background: color.bgPanel, border: "1px solid rgba(245,241,232,0.07)", borderRadius: 16, padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 12 }}>LAST FOURTEEN DAYS</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 44 }}>
          {history.map((d) => {
            const score = (d.journal ? 1 : 0) + (d.habits ? 1 : 0);
            const bg = score === 2 ? color.gold : score === 1 ? "#8A6528" : color.track;
            return <div key={d.date} style={{ flex: 1, borderRadius: "3px 3px 0 0", background: bg, height: `${6 + score * 17}px` }} />;
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontFamily: font.mono, fontSize: 9, color: color.faint }}>{fmtShort(todayISO(13)).toUpperCase()}</span>
          <span style={{ fontFamily: font.mono, fontSize: 9, color: color.faint }}>TODAY</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {milestones.map((m) => (
          <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 12, background: color.bgPanel, border: "1px solid rgba(245,241,232,0.07)", borderRadius: 14, padding: "13px 16px" }}>
            <span
              style={{
                flex: "none",
                width: 24,
                height: 24,
                borderRadius: 999,
                background: m.done ? color.gold : "transparent",
                border: `1px solid ${m.done ? color.gold : "rgba(245,241,232,0.2)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {m.done && <CheckIcon size={12} />}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: m.done ? color.cream : color.dimmer }}>{m.label}</div>
              <div style={{ fontFamily: font.mono, fontSize: 9.5, color: color.faint, marginTop: 2 }}>{m.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header() {
  return <div style={{ fontFamily: font.mono, fontSize: 10.5, letterSpacing: 3, color: color.gold, marginBottom: 10 }}>04 · SOLIDIFICATION</div>;
}
