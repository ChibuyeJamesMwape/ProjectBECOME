import { prisma } from "../db.js";
import { env } from "../env.js";
import { computeGates, type GateResult } from "./gates.js";

interface DailyRecord {
  exposureText: string;
  exposureRegistered: boolean;
  journalDates: string[];
  habitCompleteDates: string[];
  hasMentee: boolean;
}

export async function getDailyRecord(userId: string): Promise<DailyRecord> {
  const [exposure, journalRows, habits, mentee] = await Promise.all([
    prisma.exposureAudit.findUnique({ where: { userId } }),
    prisma.journalEntry.findMany({ where: { userId }, select: { date: true } }),
    prisma.habit.findMany({
      where: { userId, archived: false },
      include: { checks: { select: { date: true } } },
    }),
    prisma.user.findFirst({ where: { referredById: userId }, select: { id: true } }),
  ]);

  const journalDates = journalRows.map((r) => r.date);

  let habitCompleteDates: string[] = [];
  if (habits.length > 0) {
    const perDate = new Map<string, number>();
    for (const h of habits) {
      for (const c of h.checks) {
        perDate.set(c.date, (perDate.get(c.date) ?? 0) + 1);
      }
    }
    habitCompleteDates = [...perDate.entries()]
      .filter(([, count]) => count >= habits.length)
      .map(([date]) => date);
  }

  return {
    exposureText: exposure?.text ?? "",
    exposureRegistered: !!exposure?.registeredAt,
    journalDates,
    habitCompleteDates,
    hasMentee: !!mentee,
  };
}

export async function getGatesForUser(userId: string): Promise<GateResult> {
  const record = await getDailyRecord(userId);
  return computeGates({ ...record, thresholds: env.gates });
}

const STAGE_NAMES = ["Exposure", "Internalization", "Reinforcement", "Solidification", "Replication"];

/** Express middleware factory: 403s unless stage `index` (0-4) is unlocked. */
export function requireStage(index: number) {
  return async (req: any, res: any, next: any) => {
    try {
      const gates = await getGatesForUser(req.userId);
      if (gates.locked[index]) {
        return res.status(403).json({
          error: `${STAGE_NAMES[index]} is still locked. Gates are computed from your data — there is no mark-as-complete.`,
        });
      }
      req.gates = gates;
      next();
    } catch (err) {
      next(err);
    }
  };
}
