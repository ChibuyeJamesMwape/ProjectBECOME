import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth, requireProfile, type AuthedRequest } from "../middleware/auth.js";
import { requireStage, getGatesForUser } from "../lib/userGates.js";
import { ah } from "../lib/asyncHandler.js";

export const circleRouter = Router();
circleRouter.use(requireAuth, requireProfile);

const STAGE_NAMES = ["EXPOSURE", "INTERNALIZATION", "REINFORCEMENT", "SOLIDIFICATION", "REPLICATION"];

// Replication is locked until stage index 4 (thirty consistent days) opens.
circleRouter.get(
  "/",
  requireStage(4),
  ah(async (req: AuthedRequest, res) => {
    const [user, mentees] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.userId! }, select: { referralCode: true } }),
      prisma.user.findMany({
        where: { referredById: req.userId! },
        select: { id: true, createdAt: true, profile: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const menteeRows = await Promise.all(
      mentees.map(async (m) => {
        const gates = await getGatesForUser(m.id);
        const stageIdx = gates.done.findIndex((d) => !d);
        const stage = stageIdx < 0 ? "REPLICATION" : `0${stageIdx + 1} ${STAGE_NAMES[stageIdx]}`;
        return { name: m.profile?.name ?? "Unnamed", stage, joined: m.createdAt.toISOString().slice(0, 10) };
      })
    );

    res.json({
      inviteCode: user!.referralCode,
      inviteLink: `${process.env.APP_URL ?? "https://become.app"}/join/${user!.referralCode}`,
      mentees: menteeRows,
    });
  })
);

circleRouter.get(
  "/export",
  requireStage(4),
  ah(async (req: AuthedRequest, res) => {
    const [user, exposure, journalCount, habits, gates] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.userId! }, include: { profile: true } }),
      prisma.exposureAudit.findUnique({ where: { userId: req.userId! } }),
      prisma.journalEntry.count({ where: { userId: req.userId! } }),
      prisma.habit.findMany({ where: { userId: req.userId!, archived: false }, select: { name: true } }),
      getGatesForUser(req.userId!),
    ]);

    res.json({
      name: user?.profile?.name ?? "",
      code: user?.referralCode,
      gates: {
        exposure: gates.done[0],
        internalization: gates.done[1],
        reinforcement: gates.done[2],
        solidification: gates.done[3],
        replication: gates.done[4],
      },
      streaks: {
        journalBest: gates.journal.best,
        actionsBest: gates.habits.best,
        consistentBest: gates.consistency.best,
      },
      entries: journalCount,
      actions: habits.map((h) => h.name),
      exposureRegisteredAt: exposure?.registeredAt,
    });
  })
);
