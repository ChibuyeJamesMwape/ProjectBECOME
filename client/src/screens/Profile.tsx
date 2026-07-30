import { useEffect, useState } from "react";
import { color, font, STAGE_NAMES } from "../theme";
import { ScreenHeader } from "../components/ui";
import { api } from "../api";
import { fmt } from "../date";
import type { Gates, Me } from "../types";

export function Profile({ me, gates, onBack }: { me: Me; gates: Gates; onBack: () => void }) {
  const [journalCount, setJournalCount] = useState<number | null>(null);

  useEffect(() => {
    api.getJournal().then((entries) => setJournalCount(entries.length));
  }, []);

  const p = me.profile!;
  const initials = p.name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2);
  const curIdx = gates.done.findIndex((d) => !d);
  const curStageFull = curIdx < 0 ? "CYCLE COMPLETE" : `0${curIdx + 1} ${STAGE_NAMES[curIdx].toUpperCase()}`;
  const pairRows = p.sys.map((l, i) => ({ l: l || "Not recorded", r: p.des[i] || "Not recorded" }));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <ScreenHeader label="BASELINE RECORD" onBack={onBack} />
      <div className="hidebar" style={{ flex: 1, overflowY: "auto", padding: "24px 22px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 999,
              background: color.bgPanelAlt,
              border: "1px solid rgba(195,134,43,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: font.serif,
              fontWeight: 600,
              fontSize: 24,
              color: color.gold,
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 22, lineHeight: 1.2 }}>{p.name}</div>
            <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 1, color: color.dimmer, marginTop: 4 }}>
              {p.role.toUpperCase()} · {p.city.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ background: color.bgPanelAlt, border: `1px solid ${color.goldBorder}`, borderRadius: 16, padding: "16px 18px", marginBottom: 20 }}>
          <div style={{ fontFamily: font.mono, fontSize: 9.5, letterSpacing: 2, color: color.dimmer, marginBottom: 6 }}>THE COMMITMENT</div>
          <div style={{ fontFamily: font.serif, fontStyle: "italic", fontSize: 17, lineHeight: 1.45, color: color.gold }}>"{p.commitment}"</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 6 }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer }}>THE SYSTEM</div>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.gold }}>YOUR DESIGN</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {pairRows.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: color.bgPanel, border: "1px solid rgba(245,241,232,0.07)", borderRadius: 12, padding: "11px 13px", fontSize: 12, lineHeight: 1.5, color: color.dim }}>
                {r.l}
              </div>
              <div style={{ background: color.bgPanelAlt, border: "1px solid rgba(195,134,43,0.25)", borderRadius: 12, padding: "11px 13px", fontSize: 12, lineHeight: 1.5, color: color.cream }}>
                {r.r}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 8 }}>NAMED CONSTRAINTS</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
          {p.constraints.map((c) => (
            <span key={c} style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(245,241,232,0.14)", color: color.dim, fontSize: 12 }}>
              {c}
            </span>
          ))}
        </div>

        <div style={{ background: color.bgPanel, border: "1px solid rgba(245,241,232,0.07)", borderRadius: 16, padding: "16px 18px" }}>
          <Row label="On record since" value={fmt(p.createdAt.slice(0, 10)).toUpperCase()} />
          <Row label="Current stage" value={curStageFull} accent />
          <Row label="Days journaled" value={journalCount === null ? "…" : String(journalCount)} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
      <span style={{ fontSize: 12.5, color: color.dimmer }}>{label}</span>
      <span style={{ fontFamily: font.mono, fontSize: 11, color: accent ? color.gold : color.cream }}>{value}</span>
    </div>
  );
}
