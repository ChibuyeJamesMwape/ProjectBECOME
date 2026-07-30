import { color, font, STAGE_NAMES } from "../../theme";
import { CheckIcon, LockIcon, ProgressBar } from "../../components/ui";
import type { Gates } from "../../types";
import type { Tab } from "../../components/BottomNav";

const DESCS = [
  "See the paradigms you inherited. Name them in writing.",
  "One honest entry a day until the new identity holds.",
  "Daily actions that agree with who you are becoming.",
  "The data proves the pattern. Consistency becomes character.",
  "Formation is not finished until it is passed on.",
];
const CUR_LINES = [
  "Watch the module, then put your paradigms in writing.",
  "Keep the daily record. The streak is the proof.",
  "Check the actions that agree with your design. Every one, every day.",
  "Hold the pattern. The data is doing the solidifying.",
  "Send your code. Formation ends in multiplication.",
  "The cycle is complete. It is not yours anymore.",
];

function pct(x: number, y: number) {
  return Math.min(100, Math.round((100 * Math.min(x, y)) / y));
}

export function Path({
  firstName,
  gates,
  onOpenExposure,
  onOpenTab,
}: {
  firstName: string;
  gates: Gates;
  onOpenExposure: () => void;
  onOpenTab: (t: Tab) => void;
}) {
  const meters: [string, number][] = [
    gates.done[0] ? ["Audit registered", 100] : [`${gates.exposureChars} of ${gates.thresholds.auditMinChars + 1} characters`, pct(gates.exposureChars, gates.thresholds.auditMinChars + 1)],
    gates.done[1]
      ? ["Seven days held", 100]
      : [`${Math.min(gates.journal.best, gates.thresholds.journalGateDays)} of ${gates.thresholds.journalGateDays} consecutive days`, pct(gates.journal.best, gates.thresholds.journalGateDays)],
    gates.done[2]
      ? ["Fourteen days held", 100]
      : [`${Math.min(gates.habits.best, gates.thresholds.habitGateDays)} of ${gates.thresholds.habitGateDays} aligned days`, pct(gates.habits.best, gates.thresholds.habitGateDays)],
    gates.done[3]
      ? ["Thirty days held", 100]
      : [`${Math.min(gates.consistency.best, gates.thresholds.consistencyGateDays)} of ${gates.thresholds.consistencyGateDays} consistent days`, pct(gates.consistency.best, gates.thresholds.consistencyGateDays)],
    gates.done[4] ? ["Code claimed. Cycle complete.", 100] : ["Waiting for your code to be used", 0],
  ];

  const openFns = [onOpenExposure, () => onOpenTab("journal"), () => onOpenTab("actions"), () => onOpenTab("data"), () => onOpenTab("circle")];

  const curIdx = gates.done.findIndex((d) => !d);
  const curStageName = curIdx < 0 ? "Replication" : STAGE_NAMES[curIdx];
  const curStageLine = curIdx < 0 ? CUR_LINES[5] : CUR_LINES[curIdx];

  return (
    <div style={{ padding: "24px 22px 28px" }}>
      <div style={{ fontFamily: font.mono, fontSize: 10.5, letterSpacing: 3, color: color.dimmer, marginBottom: 10 }}>
        THE FORMATION CYCLE
      </div>
      <h2 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 28, lineHeight: 1.2, margin: "0 0 6px" }}>
        {firstName}, you are in <em style={{ color: color.gold }}>{curStageName}.</em>
      </h2>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: color.dim, margin: "0 0 20px" }}>{curStageLine}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {STAGE_NAMES.map((name, i) => {
          const done = gates.done[i];
          const locked = gates.locked[i];
          const active = !done && !locked;
          return (
            <button
              key={name}
              onClick={openFns[i]}
              style={{
                textAlign: "left",
                background: color.bgPanel,
                border: active ? "1px solid rgba(195,134,43,0.55)" : "1px solid rgba(245,241,232,0.07)",
                borderRadius: 18,
                padding: "16px 18px",
                cursor: "pointer",
                color: color.cream,
                fontFamily: font.sans,
                width: "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                <span style={{ fontFamily: font.mono, fontSize: 11, color: color.gold }}>{"0" + (i + 1)}</span>
                <span style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 19, color: locked ? color.faint : color.cream }}>{name}</span>
                <span style={{ marginLeft: "auto" }}>
                  {done && <CheckIcon size={18} stroke={color.gold} />}
                  {locked && <LockIcon size={15} />}
                  {active && (
                    <span style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: 2, color: color.bg, background: color.gold, padding: "3px 8px", borderRadius: 999 }}>
                      NOW
                    </span>
                  )}
                </span>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.55, color: color.dimmer, marginBottom: 10 }}>{DESCS[i]}</div>
              <ProgressBar pct={meters[i][1]} />
              <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 1, color: color.dimmer, marginTop: 7 }}>{meters[i][0]}</div>
            </button>
          );
        })}
      </div>
      <p style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 1, lineHeight: 1.8, color: color.faint, margin: "20px 4px 0" }}>
        GATES ARE COMPUTED FROM YOUR DATA. THERE IS NO MARK-AS-COMPLETE.
      </p>
    </div>
  );
}
