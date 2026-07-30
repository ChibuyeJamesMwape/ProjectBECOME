import { useEffect, useState } from "react";
import { color, font } from "../../theme";
import { CheckIcon, LockedCard, ProgressBar } from "../../components/ui";
import { api } from "../../api";
import { fmt, todayISO } from "../../date";
import type { Gates, Habit } from "../../types";

function pct(x: number, y: number) {
  return Math.min(100, Math.round((100 * Math.min(x, y)) / y));
}

export function Actions({ gates, onChanged }: { gates: Gates; onChanged: () => void }) {
  const locked = gates.locked[2];
  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [presets, setPresets] = useState<string[]>([]);
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    if (locked) return;
    api.getHabits().then(setHabits);
    api.getHabitPresets().then(setPresets);
  }, [locked]);

  if (locked) {
    return (
      <div style={{ padding: "24px 22px 28px" }}>
        <Header />
        <LockedCard
          title="Seven days first."
          body="Reinforcement opens when the record shows seven consecutive days of journaling. You do not talk your way through this gate. You write your way through it."
          pct={pct(gates.journal.best, gates.thresholds.journalGateDays)}
          label={`${Math.min(gates.journal.best, gates.thresholds.journalGateDays)} OF ${gates.thresholds.journalGateDays} CONSECUTIVE DAYS`}
        />
      </div>
    );
  }

  if (!habits) return <div style={{ padding: "24px 22px 28px" }}><Header /></div>;

  const checkedCount = habits.filter((h) => h.checkedToday).length;
  const suggestions = presets.filter((p) => !habits.some((h) => h.name === p));

  async function toggle(id: string) {
    const updated = await api.toggleHabit(id);
    setHabits((prev) => prev!.map((h) => (h.id === id ? { ...h, checkedToday: updated.checkedToday } : h)));
    onChanged();
  }

  async function add(name: string) {
    if (!name.trim()) return;
    const habit = await api.addHabit(name.trim());
    setHabits((prev) => [...(prev ?? []), habit]);
    setNewHabit("");
  }

  return (
    <div style={{ padding: "24px 22px 28px" }}>
      <Header />
      <h2 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 26, margin: "0 0 4px" }}>{fmt(todayISO(0))}</h2>
      <p style={{ fontSize: 13, color: color.dim, margin: "0 0 18px" }}>
        {habits.length ? `${checkedCount} of ${habits.length} aligned actions checked today.` : "Define the actions that agree with your new identity."}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {habits.map((h) => (
          <button
            key={h.id}
            onClick={() => toggle(h.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              width: "100%",
              minHeight: 56,
              padding: "12px 16px",
              background: color.bgPanel,
              border: `1px solid ${h.checkedToday ? "rgba(195,134,43,0.45)" : "rgba(245,241,232,0.07)"}`,
              borderRadius: 16,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span
              style={{
                flex: "none",
                width: 28,
                height: 28,
                borderRadius: 999,
                border: `2px solid ${h.checkedToday ? color.gold : "rgba(245,241,232,0.25)"}`,
                background: h.checkedToday ? color.gold : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {h.checkedToday && <CheckIcon size={14} />}
            </span>
            <span style={{ fontFamily: font.sans, fontSize: 13.5, lineHeight: 1.4, color: h.checkedToday ? color.cream : color.dim }}>{h.name}</span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Write your own aligned action"
          style={{ flex: 1, height: 46, padding: "0 14px", background: color.bgPanel, border: `1px solid ${color.border}`, borderRadius: 999, color: color.cream, fontFamily: font.sans, fontSize: 12.5 }}
        />
        <button
          onClick={() => add(newHabit)}
          style={{ height: 46, padding: "0 18px", borderRadius: 999, border: "1px solid rgba(195,134,43,0.5)", background: "none", color: color.gold, fontFamily: font.sans, fontSize: 12.5, cursor: "pointer" }}
        >
          Add
        </button>
      </div>
      {suggestions.length > 0 && (
        <>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 8 }}>FROM THE MASTERCLASS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => add(s)}
                style={{ minHeight: 40, padding: "8px 14px", borderRadius: 999, border: "1px dashed rgba(195,134,43,0.45)", background: "none", color: color.gold, fontFamily: font.sans, fontSize: 12, cursor: "pointer" }}
              >
                + {s}
              </button>
            ))}
          </div>
        </>
      )}
      <div style={{ background: color.bgPanel, border: "1px solid rgba(245,241,232,0.07)", borderRadius: 16, padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer }}>TOWARD SOLIDIFICATION</span>
          <span style={{ fontFamily: font.mono, fontSize: 10, color: color.gold }}>
            {Math.min(gates.habits.best, gates.thresholds.habitGateDays)} OF {gates.thresholds.habitGateDays}
          </span>
        </div>
        <ProgressBar pct={pct(gates.habits.best, gates.thresholds.habitGateDays)} />
        <div style={{ fontSize: 11.5, lineHeight: 1.55, color: color.faint, marginTop: 8 }}>
          A day counts only when every action is checked. The gate does not negotiate.
        </div>
      </div>
    </div>
  );
}

function Header() {
  return <div style={{ fontFamily: font.mono, fontSize: 10.5, letterSpacing: 3, color: color.gold, marginBottom: 10 }}>03 · REINFORCEMENT</div>;
}
