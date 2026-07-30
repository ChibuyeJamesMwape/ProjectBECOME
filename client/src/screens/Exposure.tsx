import { useEffect, useRef, useState } from "react";
import { color, font } from "../theme";
import { ScreenHeader, textareaStyle } from "../components/ui";
import { api, ApiError } from "../api";
import { fmtShort } from "../date";
import type { ExposureAudit, Gates } from "../types";

function pct(x: number, y: number) {
  return Math.min(100, Math.round((100 * Math.min(x, y)) / y));
}

export function Exposure({ gates, onBack, onRegistered }: { gates: Gates; onBack: () => void; onRegistered: () => void }) {
  const [exposure, setExposure] = useState<ExposureAudit | null>(null);
  const [text, setText] = useState("");
  const [videoOn, setVideoOn] = useState(false);
  const [err, setErr] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    api.getExposure().then((e) => {
      setExposure(e);
      setText(e.text);
    });
  }, []);

  function onChangeText(v: string) {
    setText(v);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      api.saveExposureDraft(v).catch(() => {});
    }, 500);
  }

  async function submit() {
    setErr("");
    try {
      const row = await api.registerExposure();
      setExposure(row);
      onRegistered();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Something went wrong.");
    }
  }

  const done = !!exposure?.registeredAt;
  const len = text.length;
  const threshold = gates.thresholds.auditMinChars;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <ScreenHeader label="01 · EXPOSURE" onBack={onBack} />
      <div className="hidebar" style={{ flex: 1, overflowY: "auto", padding: "22px 22px 30px" }}>
        <div style={{ background: color.bgPanelAlt, border: "1px solid rgba(245,241,232,0.08)", borderRadius: 18, overflow: "hidden", marginBottom: 20 }}>
          <button
            onClick={() => setVideoOn(!videoOn)}
            aria-label="Play"
            style={{ width: "100%", aspectRatio: "16/9", border: "none", background: "radial-gradient(90% 120% at 50% 0%,#241E11 0%,#14110B 70%)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <span style={{ width: 64, height: 64, borderRadius: 999, background: color.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {!videoOn ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#0F0E0C" style={{ marginLeft: 3 }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0F0E0C">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              )}
            </span>
          </button>
          <div style={{ padding: "14px 18px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 17 }}>The Installed Ceiling</div>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: color.dimmer }}>24:16</div>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: color.track, overflow: "hidden" }}>
              <div style={{ height: "100%", background: color.gold, width: videoOn ? "38%" : done ? "100%" : "0%" }} />
            </div>
            <div style={{ fontFamily: font.mono, fontSize: 9.5, letterSpacing: 1, color: color.faint, marginTop: 8 }}>
              MASTERCLASS · MODULE ONE OF ONE
            </div>
          </div>
        </div>

        <h2 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 24, lineHeight: 1.25, margin: "0 0 8px" }}>The paradigm audit.</h2>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: color.dim, margin: "0 0 18px" }}>
          Write down the beliefs that currently run your decisions. Where they came from. What they cost you. The next
          stage opens only when this passes {threshold} characters, because a paragraph is the minimum unit of
          honesty.
        </p>

        {!done ? (
          <>
            <textarea
              value={text}
              onChange={(e) => onChangeText(e.target.value)}
              placeholder="I still wait for permission before I move on anything that matters. I was trained to believe that..."
              style={{ ...textareaStyle, minHeight: 190, padding: 16 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: color.track, overflow: "hidden", marginRight: 12 }}>
                <div style={{ height: "100%", background: color.gold, width: `${pct(len, threshold + 1)}%` }} />
              </div>
              <div style={{ fontFamily: font.mono, fontSize: 11, color: len > threshold ? color.gold : color.dimmer }}>
                {len} / {threshold + 1}
              </div>
            </div>
            {err && <div style={{ color: color.goldHover, fontSize: 12, marginBottom: 10 }}>{err}</div>}
            <button
              onClick={submit}
              disabled={len <= threshold}
              style={{
                width: "100%",
                height: 54,
                border: "none",
                borderRadius: 999,
                background: color.gold,
                color: color.bg,
                fontFamily: font.sans,
                fontWeight: 600,
                fontSize: 15,
                cursor: len > threshold ? "pointer" : "default",
                opacity: len > threshold ? 1 : 0.35,
              }}
            >
              Register the audit
            </button>
            <p style={{ fontFamily: font.mono, fontSize: 9.5, letterSpacing: 1, color: color.faint, textAlign: "center", marginTop: 12 }}>
              THE GATE COUNTS CHARACTERS, NOT INTENTIONS
            </p>
          </>
        ) : (
          <>
            <div style={{ background: color.bgPanelAlt, border: "1px solid rgba(195,134,43,0.35)", borderRadius: 18, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.gold }}>
                  AUDIT REGISTERED · {fmtShort(exposure!.registeredAt!.slice(0, 10)).toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: color.dim, fontStyle: "italic" }}>"{exposure!.text}"</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "14px 16px", background: color.bgPanel, borderRadius: 14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color.gold} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0" />
              </svg>
              <span style={{ fontSize: 12.5, color: color.dim }}>Internalization is open. The daily record starts now.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
