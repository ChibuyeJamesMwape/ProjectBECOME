import { useState } from "react";
import { color, font } from "../theme";
import { BackIcon, Chip, ErrorNote, PrimaryButton, inputStyle, textareaStyle } from "../components/ui";
import { api, ApiError } from "../api";

const ORG_OPTIONS = ["Corporate", "Government", "NGO", "Founder", "Faith or ministry"];
const YEAR_OPTIONS = ["0 to 3 years", "4 to 7 years", "8 to 15 years", "15+ years"];
const CONSTRAINT_OPTIONS = [
  "Approval structures",
  "Title ceiling",
  "Financial obligations",
  "Family expectations",
  "Institutional politics",
  "Limited mobility",
];
const ROWS = [
  { key: "AUTHORITY", ph1: "Who you answer to today", ph2: "The conviction you carry anyway" },
  { key: "WORK", ph1: "What the system pays you to protect", ph2: "What you were designed to build" },
  { key: "VOICE", ph1: "Where you edit yourself", ph2: "Where you feel most alive" },
];

interface Draft {
  name: string;
  role: string;
  city: string;
  org: string | null;
  years: string | null;
  sys: [string, string, string];
  des: [string, string, string];
  cons: string[];
  commit: string;
}

const STEP_LABELS = ["STEP 01 / 03", "STEP 02 / 03", "STEP 03 / 03"];

export function Audit({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [d, setD] = useState<Draft>({
    name: "",
    role: "",
    city: "",
    org: null,
    years: null,
    sys: ["", "", ""],
    des: ["", "", ""],
    cons: [],
    commit: "",
  });

  function patch(p: Partial<Draft>) {
    setD((prev) => ({ ...prev, ...p }));
    setErr("");
  }

  async function next() {
    if (step === 0) {
      if (!d.name.trim() || !d.role.trim() || !d.city.trim() || !d.org || !d.years) {
        setErr("Every field on this page is part of your baseline. Complete it before you move.");
        return;
      }
    }
    if (step === 1) {
      const filled = [...d.sys, ...d.des].filter((x) => x.trim()).length;
      if (filled < 4) {
        setErr("Fill at least four of the six fields. Honest beats polished, but blank is neither.");
        return;
      }
    }
    if (step === 2) {
      if (!d.cons.length || !d.commit.trim()) {
        setErr("Name at least one constraint and write the commitment in your own words.");
        return;
      }
      setBusy(true);
      try {
        await api.submitAudit({
          name: d.name,
          role: d.role,
          city: d.city,
          org: d.org,
          years: d.years,
          sys: d.sys,
          des: d.des,
          constraints: d.cons,
          commitment: d.commit,
        });
        onDone();
      } catch (e) {
        setErr(e instanceof ApiError ? e.message : "Something went wrong.");
      } finally {
        setBusy(false);
      }
      return;
    }
    setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
    else onBack();
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ padding: "26px 26px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={back}
          aria-label="Back"
          style={{ width: 44, height: 44, marginLeft: -12, border: "none", background: "none", color: color.dim, cursor: "pointer" }}
        >
          <BackIcon />
        </button>
        <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: 3, color: color.gold }}>{STEP_LABELS[step]}</div>
        <div style={{ width: 32 }} />
      </div>
      <div style={{ display: "flex", gap: 5, padding: "0 26px 20px" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= i ? color.gold : color.track }} />
        ))}
      </div>
      <div className="hidebar" style={{ flex: 1, overflowY: "auto", padding: "0 26px 26px" }}>
        {step === 0 && (
          <>
            <h2 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 27, lineHeight: 1.2, margin: "0 0 8px" }}>
              Your baseline, on the record.
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: color.dim, margin: "0 0 22px" }}>
              Not a bio. A starting position. Everything you build here will be measured against this page.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="FULL NAME" value={d.name} placeholder="As it should be spoken" onChange={(v) => patch({ name: v })} />
              <Field label="CURRENT ROLE" value={d.role} placeholder="The title you hold today" onChange={(v) => patch({ role: v })} />
              <Field label="CITY AND COUNTRY" value={d.city} placeholder="Where the work happens" onChange={(v) => patch({ city: v })} />
              <div>
                <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 7 }}>
                  THE STRUCTURE THAT EMPLOYS YOU
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {ORG_OPTIONS.map((label) => (
                    <Chip key={label} label={label} active={d.org === label} onClick={() => patch({ org: label })} />
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 7 }}>
                  YEARS INSIDE IT
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {YEAR_OPTIONS.map((label) => (
                    <Chip key={label} label={label} active={d.years === label} onClick={() => patch({ years: label })} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 27, lineHeight: 1.2, margin: "0 0 8px" }}>
              The system, and <em style={{ color: color.gold }}>your design.</em>
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: color.dim, margin: "0 0 22px" }}>
              Two columns. On the left, the structure that formed your reflexes. On the right, what it never managed
              to remove. Fill at least four.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 6 }}>
              <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer }}>THE SYSTEM</div>
              <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.gold }}>YOUR DESIGN</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {ROWS.map((r, i) => (
                <div key={r.key}>
                  <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.faint, marginBottom: 6 }}>{r.key}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <textarea
                      value={d.sys[i]}
                      onChange={(e) => {
                        const sys = [...d.sys] as [string, string, string];
                        sys[i] = e.target.value;
                        patch({ sys });
                      }}
                      placeholder={r.ph1}
                      style={{ ...textareaStyle, minHeight: 84, padding: "12px 13px", fontSize: 12.5 }}
                    />
                    <textarea
                      value={d.des[i]}
                      onChange={(e) => {
                        const des = [...d.des] as [string, string, string];
                        des[i] = e.target.value;
                        patch({ des });
                      }}
                      placeholder={r.ph2}
                      style={{
                        ...textareaStyle,
                        minHeight: 84,
                        padding: "12px 13px",
                        fontSize: 12.5,
                        background: color.bgPanelAlt,
                        border: `1px solid ${color.goldBorder}`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 27, lineHeight: 1.2, margin: "0 0 8px" }}>
              Name the constraints.
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: color.dim, margin: "0 0 22px" }}>
              These are real. Formation does not pretend they are not there. It builds inside them until they are not
              the ceiling anymore.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {CONSTRAINT_OPTIONS.map((label) => {
                const on = d.cons.includes(label);
                return (
                  <Chip
                    key={label}
                    label={label}
                    active={on}
                    onClick={() => patch({ cons: on ? d.cons.filter((x) => x !== label) : [...d.cons, label] })}
                  />
                );
              })}
            </div>
            <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 7 }}>
              ONE COMMITMENT, IN YOUR OWN WORDS
            </div>
            <textarea
              value={d.commit}
              onChange={(e) => patch({ commit: e.target.value })}
              placeholder="Write the sentence you intend to live"
              style={{ ...textareaStyle, fontFamily: font.serif, fontStyle: "italic", fontSize: 16, minHeight: 96 }}
            />
          </>
        )}

        {err && <ErrorNote message={err} />}

        <PrimaryButton onClick={next} disabled={busy} style={{ marginTop: 22 }}>
          {step === 2 ? "Enter the work" : "Continue"}
        </PrimaryButton>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 7 }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}
