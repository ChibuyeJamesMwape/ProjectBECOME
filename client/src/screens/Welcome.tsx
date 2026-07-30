import { color, font } from "../theme";

export function Welcome({ onBegin }: { onBegin: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "36px 30px 44px",
        background: "radial-gradient(120% 70% at 20% 0%,#1C180D 0%,#0F0E0C 62%)",
      }}
    >
      <div style={{ display: "flex", gap: 6, marginBottom: "auto", paddingTop: 26 }}>
        {[0.25, 0.4, 0.55, 0.75, 1].map((op, i) => (
          <div key={i} style={{ width: 26, height: 5, background: op === 1 ? color.gold : `rgba(195,134,43,${op})`, borderRadius: 2 }} />
        ))}
      </div>
      <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: 4, color: color.gold, marginBottom: 16 }}>
        PROJECT BECOME
      </div>
      <h1 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 36, lineHeight: 1.15, margin: "0 0 18px" }}>
        We do not develop leaders. <em style={{ color: color.gold }}>We form them.</em>
      </h1>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: color.dim, margin: "0 0 30px" }}>
        This is the formation cycle for professionals who are done performing a life that was installed for them.
        Before anything opens, you will sit the Identity Audit. Write honestly. The system reads what you write, not
        what you meant.
      </p>
      <button
        onClick={onBegin}
        style={{
          height: 56,
          border: "none",
          borderRadius: 999,
          background: color.gold,
          color: color.bg,
          fontFamily: font.sans,
          fontWeight: 600,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        Begin the audit
      </button>
      <div style={{ fontFamily: font.mono, fontSize: 9.5, letterSpacing: 2, color: color.faint, textAlign: "center", marginTop: 18 }}>
        FIVE GATES · NO SKIP BUTTON
      </div>
    </div>
  );
}
