import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireProfile, type AuthedRequest } from "../middleware/auth.js";
import { ah } from "../lib/asyncHandler.js";

export const notificationsRouter = Router();
notificationsRouter.use(requireAuth, requireProfile);

notificationsRouter.get(
  "/",
  ah(async (req: AuthedRequest, res) => {
    const settings = await prisma.notificationSettings.upsert({
      where: { userId: req.userId! },
      update: {},
      create: { userId: req.userId! },
    });
    res.json(settings);
  })
);

const patchSchema = z.object({
  journal: z.boolean().optional(),
  actions: z.boolean().optional(),
  review: z.boolean().optional(),
});

notificationsRouter.patch(
  "/",
  ah(async (req: AuthedRequest, res) => {
    const parsed = patchSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input." });

    const settings = await prisma.notificationSettings.upsert({
      where: { userId: req.userId! },
      update: parsed.data,
      create: { userId: req.userId!, ...parsed.data },
    });
    res.json(settings);
  })
);
