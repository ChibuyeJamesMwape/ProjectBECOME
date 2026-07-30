import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireProfile, type AuthedRequest } from "../middleware/auth.js";
import { requireStage } from "../lib/userGates.js";
import { todayISO } from "../lib/gates.js";
import { ah } from "../lib/asyncHandler.js";

export const habitsRouter = Router();
habitsRouter.use(requireAuth, requireProfile);

export const PRESET_HABITS = [
  "Speak first in one meeting",
  "Write before touching the phone",
  "One decision without seeking cover",
  "Reach one person beyond my level",
];

habitsRouter.get("/presets", (_req, res) => res.json(PRESET_HABITS));

habitsRouter.get(
  "/",
  ah(async (req: AuthedRequest, res) => {
    const today = todayISO(0);
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId!, archived: false },
      orderBy: { createdAt: "asc" },
      include: { checks: { where: { date: today } } },
    });
    res.json(habits.map((h) => ({ id: h.id, name: h.name, checkedToday: h.checks.length > 0 })));
  })
);

const nameSchema = z.object({ name: z.string().trim().min(1) });

// Reinforcement is locked until stage index 2 (seven consecutive journal days) opens.
habitsRouter.post(
  "/",
  requireStage(2),
  ah(async (req: AuthedRequest, res) => {
    const parsed = nameSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Name the action." });
    const habit = await prisma.habit.create({ data: { userId: req.userId!, name: parsed.data.name } });
    res.status(201).json({ id: habit.id, name: habit.name, checkedToday: false });
  })
);

habitsRouter.post(
  "/:id/toggle",
  requireStage(2),
  ah(async (req: AuthedRequest, res) => {
    const { id } = req.params;
    const habit = await prisma.habit.findFirst({ where: { id, userId: req.userId! } });
    if (!habit) return res.status(404).json({ error: "Action not found." });

    const today = todayISO(0);
    const existing = await prisma.habitCheck.findUnique({
      where: { habitId_date: { habitId: id, date: today } },
    });
    if (existing) {
      await prisma.habitCheck.delete({ where: { id: existing.id } });
      return res.json({ checkedToday: false });
    }
    await prisma.habitCheck.create({ data: { userId: req.userId!, habitId: id, date: today } });
    res.json({ checkedToday: true });
  })
);
