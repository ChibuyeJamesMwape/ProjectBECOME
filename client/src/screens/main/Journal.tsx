import { useEffect, useState } from "react";
import { color, font } from "../../theme";
import { CheckIcon, Chip, ErrorNote, LockedCard, PrimaryButton, textareaStyle } from "../../components/ui";
import { api, ApiError } from "../../api";
import { todayISO, fmt, weekdayLetter } from "../../date";
import type { Gates, JournalEntry } from "../../types";

const PRESET_TAGS = ["Compliance → Ownership", "Permission → Initiative", "Performance → Presence", "Survival → Stewardship"];

function pct(x: number, y: number) {
  return Math.min(100, Math.round((100 * Math.min(x, y)) / y));
}

export function Journal({ gates, onChanged }: { gates: Gates; onChanged: () => void }) {
  const locked = gates.locked[1];
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [customIn, setCustomIn] = useState("");
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (locked) return;
    api.getJournal().then(setEntries);
  }, [locked]);

  if (locked) {
    return (
      <div style={{ padding: "24px 22px 28px" }}>
        <Header />
        <LockedCard
          title="Sealed until the audit lands."
          body="Internalization opens when your Exposure audit passes three hundred characters of honest writing. The gate reads the record, not your intentions."
          pct={pct(gates.exposureChars, gates.thresholds.auditMinChars + 1)}
          label={`${gates.exposureChars} / ${gates.thresholds.auditMinChars + 1}`}
        />
      </div>
    );
  }

  if (!entries) return <div style={{ padding: "24px 22px 28px" }}><Header /></div>;

  const today = todayISO(0);
  const todayEntry = entries.find((e) => e.date === today);
  const dots: { date: string; on: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = todayISO(i);
    dots.push({ date: d, on: entries.some((e) => e.date === d) });
  }
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const allTags = [...PRESET_TAGS, ...customTags];

  async function save() {
    setErr("");
    if (!text.trim()) return setErr("Write the entry. One honest paragraph is enough.");
    if (!tags.length) return setErr("Tag the identity shift this entry belongs to.");
    setBusy(true);
    try {
      const entry = await api.addJournalEntry(tags, text.trim());
      setEntries((prev) => [entry, ...(prev ?? [])]);
      setTags([]);
      setText("");
      onChanged();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: "24px 22px 28px" }}>
      <Header />
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
        <span style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 44, lineHeight: 1 }}>{gates.journal.cur}</span>
        <span style={{ fontFamily: font.mono, fontSize: 10.5, letterSpacing: 2, color: color.dimmer }}>DAY STREAK</span>
      </div>
      <div style={{ display: "flex", gap: 7, margin: "12px 0 22px" }}>
        {dots.map((d) => (
          <div key={d.date} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 999,
                background: d.on ? color.gold : color.bgPanel,
                border: `1px solid ${d.on ? color.gold : "rgba(245,241,232,0.12)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {d.on && <CheckIcon size={13} />}
            </div>
            <div style={{ fontFamily: font.mono, fontSize: 9, color: color.faint }}>{weekdayLetter(d.date)}</div>
          </div>
        ))}
      </div>

      {todayEntry ? (
        <div style={{ background: color.bgPanelAlt, border: "1px solid rgba(195,134,43,0.35)", borderRadius: 18, padding: "18px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <CheckIcon size={15} stroke={color.gold} />
            <span style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.gold }}>TODAY IS ON THE RECORD</span>
          </div>
          <div style={{ fontSize: 12, color: color.dimmer, marginBottom: 6 }}>{todayEntry.tags.join(" · ")}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, color: color.cream }}>{todayEntry.text}</div>
        </div>
      ) : (
        <>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 8 }}>
            TAG THE SHIFT THIS ENTRY BELONGS TO
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {allTags.map((t) => {
              const on = tags.includes(t);
              return (
                <Chip
                  key={t}
                  label={t}
                  active={on}
                  onClick={() => setTags(on ? tags.filter((x) => x !== t) : [...tags, t])}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input
              value={customIn}
              onChange={(e) => setCustomIn(e.target.value)}
              placeholder="Name your own shift"
              style={{ flex: 1, height: 44, padding: "0 14px", background: color.bgPanel, border: `1px solid ${color.border}`, borderRadius: 999, color: color.cream, fontFamily: font.sans, fontSize: 12.5 }}
            />
            <button
              onClick={() => {
                const v = customIn.trim();
                if (!v) return;
                setCustomTags([...customTags, v]);
                setTags([...tags, v]);
                setCustomIn("");
              }}
              style={{ height: 44, padding: "0 18px", borderRadius: 999, border: "1px solid rgba(195,134,43,0.5)", background: "none", color: color.gold, fontFamily: font.sans, fontSize: 12.5, cursor: "pointer" }}
            >
              Add
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did the new identity do today that the old one would not have done?"
            style={{ ...textareaStyle, minHeight: 130, borderRadius: 16 }}
          />
          {err && <ErrorNote message={err} />}
          <PrimaryButton onClick={save} disabled={busy} style={{ height: 52, marginTop: 14, fontSize: 14.5 }}>
            Log the day
          </PrimaryButton>
        </>
      )}

      <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, margin: "24px 0 10px" }}>THE RECORD</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map((e) => (
          <div key={e.id} style={{ background: color.bgPanel, border: "1px solid rgba(245,241,232,0.07)", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontFamily: font.mono, fontSize: 10, color: color.gold }}>{fmt(e.date).toUpperCase()}</span>
              <span style={{ fontSize: 11, color: color.faint }}>{e.tags.join(" · ")}</span>
            </div>
            <div
              style={{
                fontSize: 12.5,
                lineHeight: 1.55,
                color: color.dim,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {e.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div style={{ fontFamily: font.mono, fontSize: 10.5, letterSpacing: 3, color: color.gold, marginBottom: 10 }}>02 · INTERNALIZATION</div>
  );
}
