import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { prisma } from "../db.js";
import { env } from "../env.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { generateReferralCode } from "../lib/referral.js";
import { todayISO } from "../lib/gates.js";
import { PRESET_HABITS } from "./habits.js";
import { ah } from "../lib/asyncHandler.js";

// Dev-only persona fast-forward, mirroring the design prototype's demo rig
// (mkPersona in ProjectBECOME.dc.html). Lets a reviewer jump a test account
// to Day 5 / 21 / 45 / Replication without waiting real days. Gated behind
// ENABLE_DEV_TOOLS — never mount this in production.
export const devRouter = Router();

devRouter.use((_req, res, next) => {
  if (!env.enableDevTools) return res.status(404).json({ error: "Not found." });
  next();
});
devRouter.use(requireAuth);

const DEMO_PROFILE = {
  name: "Natasha Banda",
  role: "Senior Compliance Officer",
  city: "Lusaka, Zambia",
  org: "Corporate",
  years: "8 to 15 years",
  sys: [
    "The board calendar and its sign-off chain",
    "Processes I protect better than my own convictions",
    "Meetings where I edit myself before I speak",
  ],
  des: [
    "Rooms I convene on my own authority",
    "Systems that make young officers brave",
    "A voice that does not wait to be selected",
  ],
  constraints: ["Approval structures", "Family expectations", "Title ceiling"],
  commitment: "I will stop waiting to be selected.",
};

const EXPO_TEXT =
  "I still wait for permission before I move on anything that matters. I was trained to protect the process, so I hold my ideas until someone senior says them first. I treat my title as the ceiling of my contribution and I call that professionalism. I confuse being compliant with being faithful. I have named my smallness humility for so long that it almost feels like character. It is not. It was installed, and it can be reformed.";

function range(a: number, b: number): number[] {
  const r: number[] = [];
  for (let i = a; i <= b; i++) r.push(i);
  return r;
}

const personaSchema = z.object({ persona: z.enum(["first", "day5", "day21", "day45", "rep"]) });

devRouter.post("/persona", ah(async (req: AuthedRequest, res) => {
  const parsed = personaSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "persona must be one of first, day5, day21, day45, rep." });
  const { persona } = parsed.data;
  const userId = req.userId!;

  await prisma.$transaction(async (tx) => {
    // Wipe everything this persona rewrites.
    await tx.habitCheck.deleteMany({ where: { userId } });
    await tx.habit.deleteMany({ where: { userId } });
    await tx.journalEntry.deleteMany({ where: { userId } });
    await tx.exposureAudit.deleteMany({ where: { userId } });
    await tx.user.updateMany({ where: { referredById: userId }, data: { referredById: null } });
    await tx.user.deleteMany({ where: { referredById: userId } });

    if (persona === "first") {
      await tx.profile.deleteMany({ where: { userId } });
      return;
    }

    const dayOffset = { day5: 5, day21: 21, day45: 45, rep: 70 }[persona];
    const joined = todayISO(dayOffset);

    await tx.profile.upsert({
      where: { userId },
      update: { ...DEMO_PROFILE, createdAt: joined ? new Date(joined) : undefined },
      create: { userId, ...DEMO_PROFILE },
    });

    await tx.exposureAudit.create({
      data: { userId, text: EXPO_TEXT, registeredAt: new Date(joined + "T12:00:00Z") },
    });

    if (persona === "day5") {
      for (const off of range(1, 4)) {
        await tx.journalEntry.create({
          data: {
            userId,
            date: todayISO(off),
            tags: ["Compliance → Ownership"],
            text: "I kept the appointment with myself and wrote the honest version first.",
          },
        });
      }
      return;
    }

    const journalRange = { day21: [1, 20], day45: [1, 44], rep: [0, 60] }[persona] as [number, number];
    const habitRange = { day21: [1, 9], day45: [1, 26], rep: [0, 40] }[persona] as [number, number];
    const TAGS = ["Compliance → Ownership", "Permission → Initiative", "Performance → Presence", "Survival → Stewardship"];

    for (let i = journalRange[0]; i <= journalRange[1]; i++) {
      const idx = i - journalRange[0];
      await tx.journalEntry.create({
        data: {
          userId,
          date: todayISO(i),
          tags: [TAGS[idx % TAGS.length]],
          text:
            idx === 0
              ? "I said the true thing in the risk committee before checking who agreed with me. Small, but mine."
              : "I kept the appointment with myself and wrote the honest version first.",
        },
      });
    }

    const habits = [];
    for (const name of PRESET_HABITS) {
      habits.push(await tx.habit.create({ data: { userId, name } }));
    }
    for (let i = habitRange[0]; i <= habitRange[1]; i++) {
      const date = todayISO(i);
      for (const h of habits) {
        await tx.habitCheck.create({ data: { userId, habitId: h.id, date } });
      }
    }

    if (persona === "rep") {
      const menteeSeed = [
        { name: "Kunda Mulenga", offset: 12 },
        { name: "Thandiwe Phiri", offset: 4 },
      ];
      for (const m of menteeSeed) {
        // Scoped to the referrer so re-running this persona on different test
        // accounts never collides on the unique email constraint.
        const email = `${m.name.toLowerCase().replace(/\s+/g, ".")}.demo.${userId.slice(0, 8)}@example.invalid`;
        const passwordHash = await bcrypt.hash(randomUUID(), 12);
        let code = generateReferralCode();
        for (let i = 0; i < 5; i++) {
          const clash = await tx.user.findUnique({ where: { referralCode: code } });
          if (!clash) break;
          code = generateReferralCode();
        }
        const mentee = await tx.user.create({
          data: { email, passwordHash, referralCode: code, referredById: userId },
        });
        await tx.profile.create({
          data: {
            userId: mentee.id,
            name: m.name,
            role: "Mentee",
            city: "Lusaka, Zambia",
            org: "Corporate",
            years: "0 to 3 years",
            sys: ["", "", ""],
            des: ["", "", ""],
            constraints: [],
            commitment: "",
          },
        });
      }
    }
  });

  res.json({ ok: true, persona });
}));
