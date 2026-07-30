import "dotenv/config";

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  jwtSecret: req("JWT_SECRET"),
  enableDevTools: process.env.ENABLE_DEV_TOOLS === "true",
  gates: {
    auditMinChars: Number(process.env.GATE_AUDIT_MIN_CHARS ?? 300),
    journalGateDays: Number(process.env.GATE_JOURNAL_DAYS ?? 7),
    habitGateDays: Number(process.env.GATE_HABIT_DAYS ?? 14),
    consistencyGateDays: Number(process.env.GATE_CONSISTENCY_DAYS ?? 30),
  },
};
