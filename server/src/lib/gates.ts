// Server-side port of the gating math from the ProjectBECOME.dc.html prototype
// (its `run()` and `gates()` methods). Stages are never marked complete by hand —
// every gate is computed from rows that already exist in the database.

export function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

function shiftISO(date: string, days: number): string {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export interface Streak {
  best: number;
  cur: number;
}

/** Longest run of consecutive calendar days in `dates`, and the current run ending today (or yesterday). */
export function streak(dates: string[]): Streak {
  const set = new Set(dates);
  let best = 0;
  set.forEach((d) => {
    if (!set.has(shiftISO(d, -1))) {
      let len = 1;
      let cur = d;
      while (set.has(shiftISO(cur, 1))) {
        cur = shiftISO(cur, 1);
        len++;
      }
      if (len > best) best = len;
    }
  });
  let cur = 0;
  let day = todayISO(0);
  if (!set.has(day)) day = todayISO(1);
  while (set.has(day)) {
    cur++;
    day = shiftISO(day, -1);
  }
  return { best, cur };
}

export interface GateThresholds {
  auditMinChars: number;
  journalGateDays: number;
  habitGateDays: number;
  consistencyGateDays: number;
}

export interface GateInput {
  exposureText: string;
  exposureRegistered: boolean;
  journalDates: string[];
  /** Dates on which every one of the user's active habits was checked. */
  habitCompleteDates: string[];
  hasMentee: boolean;
  thresholds: GateThresholds;
}

export interface GateResult {
  thresholds: GateThresholds;
  journal: Streak;
  habits: Streak;
  consistency: Streak;
  exposureChars: number;
  /** Stage unlock booleans, index 0..4 = Exposure..Replication. done[i] means stage i is complete. */
  done: [boolean, boolean, boolean, boolean, boolean];
  /** locked[i] means stage i is not yet reachable. */
  locked: [boolean, boolean, boolean, boolean, boolean];
}

export function computeGates(input: GateInput): GateResult {
  const jset = new Set(input.journalDates);
  const consistentDates = input.habitCompleteDates.filter((d) => jset.has(d));

  const journal = streak(input.journalDates);
  const habits = streak(input.habitCompleteDates);
  const consistency = streak(consistentDates);

  const s1 = input.exposureRegistered; // Exposure: audit registered
  const s2 = s1 && journal.best >= input.thresholds.journalGateDays; // Internalization
  const s3 = s2 && habits.best >= input.thresholds.habitGateDays; // Reinforcement
  const s4 = s3 && consistency.best >= input.thresholds.consistencyGateDays; // Solidification
  const s5 = s4 && input.hasMentee; // Replication

  return {
    thresholds: input.thresholds,
    journal,
    habits,
    consistency,
    exposureChars: input.exposureText.length,
    done: [s1, s2, s3, s4, s5],
    locked: [false, !s1, !s2, !s3, !s4],
  };
}
