import express from "express";
import cors from "cors";
import { env } from "./env.js";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { exposureRouter } from "./routes/exposure.js";
import { journalRouter } from "./routes/journal.js";
import { habitsRouter } from "./routes/habits.js";
import { circleRouter } from "./routes/circle.js";
import { notificationsRouter } from "./routes/notifications.js";
import { gatesRouter } from "./routes/gates.js";
import { devRouter } from "./routes/dev.js";

const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/exposure", exposureRouter);
app.use("/api/journal", journalRouter);
app.use("/api/habits", habitsRouter);
app.use("/api/circle", circleRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/gates", gatesRouter);
app.use("/api/dev", devRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong." });
});

app.listen(env.port, () => {
  console.log(`projectBECOME API listening on :${env.port}`);
});
