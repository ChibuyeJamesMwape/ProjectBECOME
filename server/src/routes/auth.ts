import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db.js";
import { env } from "../env.js";
import { generateReferralCode } from "../lib/referral.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { getGatesForUser } from "../lib/userGates.js";
import { ah } from "../lib/asyncHandler.js";

export const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

function issueToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: "30d" });
}

authRouter.post("/register", ah(async (req, res) => {
  const parsed = credentialsSchema.extend({ referralCode: z.string().trim().optional() }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
  }
  const { email, password, referralCode } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "An account with that email already exists." });

  let referredById: string | undefined;
  if (referralCode) {
    const referrer = await prisma.user.findUnique({ where: { referralCode: referralCode.trim().toUpperCase() } });
    if (!referrer) return res.status(400).json({ error: "That formation code was not recognized." });
    referredById = referrer.id;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  let code = generateReferralCode();
  for (let i = 0; i < 5; i++) {
    const clash = await prisma.user.findUnique({ where: { referralCode: code } });
    if (!clash) break;
    code = generateReferralCode();
  }

  const user = await prisma.user.create({
    data: { email, passwordHash, referralCode: code, referredById },
  });

  res.status(201).json({ token: issueToken(user.id) });
}));

authRouter.post("/login", ah(async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Email or password is incorrect." });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Email or password is incorrect." });

  res.json({ token: issueToken(user.id) });
}));

authRouter.get("/me", requireAuth, ah(async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { profile: true, notificationSettings: true },
  });
  if (!user) return res.status(404).json({ error: "User not found." });

  const gates = await getGatesForUser(user.id);

  res.json({
    id: user.id,
    email: user.email,
    referralCode: user.referralCode,
    hasProfile: !!user.profile,
    profile: user.profile,
    notificationSettings: user.notificationSettings,
    gates,
  });
}));
