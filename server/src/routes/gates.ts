import { Router } from "express";
import { requireAuth, requireProfile, type AuthedRequest } from "../middleware/auth.js";
import { getGatesForUser, getDailyRecord } from "../lib/userGates.js";
import { todayISO } from "../lib/gates.js";
import { ah } from "../lib/asyncHandler.js";

export const gatesRouter = Router();
gatesRouter.use(requireAuth, requireProfile);

gatesRouter.get(
  "/",
  ah(async (req: AuthedRequest, res) => {
    res.json(await getGatesForUser(req.userId!));
  })
);

// Per-day journal/habits completion for the last N days, used by the
// Solidification tab's bar chart. Not needed for gating itself.
gatesRouter.get(
  "/history",
  ah(async (req: AuthedRequest, res) => {
    const days = Math.min(60, Math.max(1, Number(req.query.days ?? 14)));
    const record = await getDailyRecord(req.userId!);
    const jset = new Set(record.journalDates);
    const hset = new Set(record.habitCompleteDates);

    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = todayISO(i);
      out.push({ date, journal: jset.has(date), habits: hset.has(date) });
    }
    res.json(out);
  })
);
