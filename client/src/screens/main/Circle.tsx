import { useEffect, useState } from "react";
import { color, font } from "../../theme";
import { LockedCard } from "../../components/ui";
import { api } from "../../api";
import { fmtShort } from "../../date";
import type { CircleData, Gates } from "../../types";

function pct(x: number, y: number) {
  return Math.min(100, Math.round((100 * Math.min(x, y)) / y));
}

export function Circle({ gates }: { gates: Gates }) {
  const locked = gates.locked[4];
  const [data, setData] = useState<CircleData | null>(null);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    if (locked) return;
    api.getCircle().then(setData);
  }, [locked]);

  if (locked) {
    return (
      <div style={{ padding: "24px 22px 28px" }}>
        <Header />
        <LockedCard
          title="Solidify first."
          body="You cannot replicate what has not solidified. Thirty consistent days, then this opens and you carry someone with you."
          pct={pct(gates.consistency.best, gates.thresholds.consistencyGateDays)}
          label={`${Math.min(gates.consistency.best, gates.thresholds.consistencyGateDays)} OF ${gates.thresholds.consistencyGateDays} CONSISTENT DAYS`}
        />
      </div>
    );
  }

  if (!data) return <div style={{ padding: "24px 22px 28px" }}><Header /></div>;

  const repDone = gates.done[4];

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(`https://${data!.inviteLink.replace(/^https?:\/\//, "")}`);
    } catch {
      // clipboard permissions may be denied; the code is still shown on screen
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function exportMetrics() {
    const metrics = await api.exportMetrics();
    const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "become-journey.json";
    a.click();
    URL.revokeObjectURL(a.href);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  return (
    <div style={{ padding: "24px 22px 28px" }}>
      <Header />
      {repDone && (
        <div style={{ background: color.gold, borderRadius: 18, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.bg, marginBottom: 4 }}>REPLICATION REGISTERED</div>
          <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 20, color: color.bg, lineHeight: 1.3 }}>
            Your code has been built with. The cycle is complete, and it is not yours anymore.
          </div>
        </div>
      )}
      <div style={{ background: color.bgPanelAlt, border: "1px solid rgba(195,134,43,0.35)", borderRadius: 18, padding: 20, marginBottom: 16 }}>
        <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 8 }}>YOUR FORMATION CODE</div>
        <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: color.gold, marginBottom: 14 }}>{data.inviteCode}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: color.bg, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
          <span style={{ flex: 1, fontFamily: font.mono, fontSize: 11, color: color.dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {data.inviteLink}
          </span>
          <button
            onClick={copyInvite}
            style={{ flex: "none", height: 34, padding: "0 14px", border: "none", borderRadius: 999, background: color.gold, color: color.bg, fontFamily: font.sans, fontWeight: 600, fontSize: 12, cursor: "pointer" }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: color.dimmer, margin: 0 }}>
          Replication is not achieved when you send this. It is achieved when someone registers with it and starts building.
        </p>
      </div>
      <button
        onClick={exportMetrics}
        style={{ width: "100%", height: 50, border: "1px solid rgba(195,134,43,0.5)", borderRadius: 999, background: "none", color: color.gold, fontFamily: font.sans, fontWeight: 500, fontSize: 14, cursor: "pointer", marginBottom: 22 }}
      >
        {exported ? "Metrics exported" : "Export journey metrics"}
      </button>
      <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 10 }}>BUILDING WITH YOUR CODE</div>
      {data.mentees.length === 0 && (
        <div style={{ background: color.bgPanel, border: "1px dashed rgba(245,241,232,0.15)", borderRadius: 16, padding: 20, textAlign: "center", fontSize: 12.5, lineHeight: 1.6, color: color.dimmer }}>
          Your code is unclaimed. Choose one person who reminds you of who you were, and send it.
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.mentees.map((m) => (
          <div key={m.name + m.joined} style={{ display: "flex", alignItems: "center", gap: 14, background: color.bgPanel, border: "1px solid rgba(245,241,232,0.07)", borderRadius: 16, padding: "14px 16px" }}>
            <span
              style={{
                flex: "none",
                width: 42,
                height: 42,
                borderRadius: 999,
                background: color.bgPanelAlt,
                border: "1px solid rgba(195,134,43,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: font.serif,
                fontWeight: 600,
                fontSize: 16,
                color: color.gold,
              }}
            >
              {m.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</div>
              <div style={{ fontFamily: font.mono, fontSize: 9.5, letterSpacing: 1, color: color.dimmer, marginTop: 2 }}>IN {m.stage}</div>
            </div>
            <div style={{ fontFamily: font.mono, fontSize: 9.5, color: color.faint }}>{fmtShort(m.joined).toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header() {
  return <div style={{ fontFamily: font.mono, fontSize: 10.5, letterSpacing: 3, color: color.gold, marginBottom: 10 }}>05 · REPLICATION</div>;
}
