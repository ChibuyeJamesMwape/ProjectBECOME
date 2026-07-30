import { useState } from "react";
import { color, font } from "../theme";
import { PrimaryButton, ErrorNote, inputStyle } from "../components/ui";
import { useAuth } from "../AuthContext";
import { ApiError } from "../api";

export function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr("");
    setBusy(true);
    try {
      if (mode === "login") await login(email.trim(), password);
      else await register(email.trim(), password, referralCode.trim() || undefined);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "36px 30px",
        background: "radial-gradient(120% 70% at 20% 0%,#1C180D 0%,#0F0E0C 62%)",
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: 4, color: color.gold, marginBottom: 16 }}>
        PROJECT BECOME
      </div>
      <h1 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 30, lineHeight: 1.2, margin: "0 0 22px" }}>
        {mode === "login" ? (
          "Welcome back."
        ) : (
          <>
            Formation begins <em style={{ color: color.gold }}>with an account.</em>
          </>
        )}
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 7 }}>EMAIL</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@work.com"
            style={inputStyle}
          />
        </div>
        <div>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 7 }}>PASSWORD</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            style={inputStyle}
          />
        </div>
        {mode === "register" && (
          <div>
            <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 2, color: color.dimmer, marginBottom: 7 }}>
              FORMATION CODE (OPTIONAL)
            </div>
            <input
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="If someone sent you here"
              style={inputStyle}
            />
          </div>
        )}
      </div>

      {err && <ErrorNote message={err} />}

      <PrimaryButton onClick={submit} disabled={busy || !email || !password} style={{ marginTop: 22 }}>
        {mode === "login" ? "Log in" : "Create account"}
      </PrimaryButton>

      <button
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setErr("");
        }}
        style={{
          background: "none",
          border: "none",
          color: color.dim,
          fontSize: 12.5,
          marginTop: 18,
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        {mode === "login" ? "New here? Create an account" : "Already on record? Log in"}
      </button>
    </div>
  );
}
