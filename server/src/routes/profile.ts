import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { ah } from "../lib/asyncHandler.js";

export const profileRouter = Router();

const auditSchema = z.object({
  name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  city: z.string().trim().min(1),
  org: z.string().trim().min(1),
  years: z.string().trim().min(1),
  sys: z.array(z.string()).length(3),
  des: z.array(z.string()).length(3),
  constraints: z.array(z.string().trim().min(1)).min(1, "Name at least one constraint."),
  commitment: z.string().trim().min(1, "Write the commitment in your own words."),
});

// Identity Audit onboarding: this is a one-time, one-shot submission. It is
// gated purely by validation, not by a "mark complete" button — the same
// worksheet rules the prototype enforces client-side are re-checked here.
profileRouter.post(
  "/",
  requireAuth,
  ah(async (req: AuthedRequest, res) => {
    const existing = await prisma.profile.findUnique({ where: { userId: req.userId! } });
    if (existing) return res.status(409).json({ error: "The Identity Audit has already been recorded." });

    const parsed = auditSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    }
    const d = parsed.data;

    const filled = [...d.sys, ...d.des].filter((x) => x.trim().length > 0).length;
    if (filled < 4) {
      return res.status(400).json({ error: "Fill at least four of the six fields. Honest beats polished, but blank is neither." });
    }

    const profile = await prisma.profile.create({
      data: {
        userId: req.userId!,
        name: d.name,
        role: d.role,
        city: d.city,
        org: d.org,
        years: d.years,
        sys: d.sys,
        des: d.des,
        constraints: d.constraints,
        commitment: d.commitment,
      },
    });

    res.status(201).json(profile);
  })
);

profileRouter.get(
  "/",
  requireAuth,
  ah(async (req: AuthedRequest, res) => {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId! } });
    if (!profile) return res.status(404).json({ error: "No Identity Audit on record." });
    res.json(profile);
  })
);
