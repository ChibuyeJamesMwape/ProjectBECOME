import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireProfile, type AuthedRequest } from "../middleware/auth.js";
import { requireStage } from "../lib/userGates.js";
import { todayISO } from "../lib/gates.js";
import { ah } from "../lib/asyncHandler.js";

export const journalRouter = Router();
journalRouter.use(requireAuth, requireProfile);

journalRouter.get(
  "/",
  ah(async (req: AuthedRequest, res) => {
    const entries = await prisma.journalEntry.findMany({
      where: { userId: req.userId! },
      orderBy: { date: "desc" },
    });
    res.json(entries);
  })
);

const entrySchema = z.object({
  tags: z.array(z.string().trim().min(1)).min(1, "Tag the identity shift this entry belongs to."),
  text: z.string().trim().min(1, "Write the entry. One honest paragraph is enough."),
});

// Internalization is locked until the Exposure gate (stage index 1) opens.
journalRouter.post(
  "/",
  requireStage(1),
  ah(async (req: AuthedRequest, res) => {
    const parsed = entrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    }
    const date = todayISO(0);

    const existing = await prisma.journalEntry.findUnique({
      where: { userId_date: { userId: req.userId!, date } },
    });
    if (existing) return res.status(409).json({ error: "Today is already on the record." });

    const entry = await prisma.journalEntry.create({
      data: { userId: req.userId!, date, tags: parsed.data.tags, text: parsed.data.text },
    });
    res.status(201).json(entry);
  })
);
