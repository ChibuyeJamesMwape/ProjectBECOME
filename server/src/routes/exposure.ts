import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { env } from "../env.js";
import { requireAuth, requireProfile, type AuthedRequest } from "../middleware/auth.js";
import { ah } from "../lib/asyncHandler.js";

export const exposureRouter = Router();
exposureRouter.use(requireAuth, requireProfile);

exposureRouter.get(
  "/",
  ah(async (req: AuthedRequest, res) => {
    const row = await prisma.exposureAudit.findUnique({ where: { userId: req.userId! } });
    res.json(row ?? { userId: req.userId, text: "", registeredAt: null });
  })
);

const draftSchema = z.object({ text: z.string().max(10000) });

// Autosave the draft while the audit is still being written.
exposureRouter.put(
  "/draft",
  ah(async (req: AuthedRequest, res) => {
    const existing = await prisma.exposureAudit.findUnique({ where: { userId: req.userId! } });
    if (existing?.registeredAt) {
      return res.status(409).json({ error: "The audit is already registered. The gate reads the record, not edits after the fact." });
    }
    const parsed = draftSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input." });

    const row = await prisma.exposureAudit.upsert({
      where: { userId: req.userId! },
      update: { text: parsed.data.text },
      create: { userId: req.userId!, text: parsed.data.text },
    });
    res.json(row);
  })
);

// Register (lock in) the audit. Only succeeds once the text passes the
// character-count gate — the same rule that unlocks Internalization.
exposureRouter.post(
  "/register",
  ah(async (req: AuthedRequest, res) => {
    const existing = await prisma.exposureAudit.findUnique({ where: { userId: req.userId! } });
    if (existing?.registeredAt) {
      return res.status(409).json({ error: "The audit is already registered." });
    }
    const text = existing?.text ?? "";
    if (text.length <= env.gates.auditMinChars) {
      return res.status(400).json({
        error: `The gate counts characters, not intentions: needs more than ${env.gates.auditMinChars}.`,
      });
    }
    const row = await prisma.exposureAudit.upsert({
      where: { userId: req.userId! },
      update: { registeredAt: new Date() },
      create: { userId: req.userId!, text, registeredAt: new Date() },
    });
    res.json(row);
  })
);
