import { useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { PhoneShell } from "./components/PhoneShell";
import { DevRig } from "./components/DevRig";
import { AuthScreen } from "./screens/AuthScreen";
import { Welcome } from "./screens/Welcome";
import { Audit } from "./screens/Audit";
import { MainScreen } from "./screens/MainScreen";
import { Exposure } from "./screens/Exposure";
import { Profile } from "./screens/Profile";
import { Notifications } from "./screens/Notifications";
import { color, font } from "./theme";

type OnboardScreen = "welcome" | "audit";
type AppScreen = "main" | "exposure" | "profile" | "notifs";

export function App() {
  const { me, loading, refresh } = useAuth();
  const [onboardScreen, setOnboardScreen] = useState<OnboardScreen>("welcome");
  const [appScreen, setAppScreen] = useState<AppScreen>("main");

  let body: ReactNode;

  if (loading) {
    body = <Loading />;
  } else if (!me) {
    body = <AuthScreen />;
  } else if (!me.hasProfile) {
    body =
      onboardScreen === "welcome" ? (
        <Welcome onBegin={() => setOnboardScreen("audit")} />
      ) : (
        <Audit onBack={() => setOnboardScreen("welcome")} onDone={refresh} />
      );
  } else {
    const gates = me.gates;
    const firstName = (me.profile?.name || "Friend").split(" ")[0];
    if (appScreen === "exposure") {
      body = <Exposure gates={gates} onBack={() => setAppScreen("main")} onRegistered={refresh} />;
    } else if (appScreen === "profile") {
      body = <Profile me={me} gates={gates} onBack={() => setAppScreen("main")} />;
    } else if (appScreen === "notifs") {
      body = <Notifications onBack={() => setAppScreen("main")} />;
    } else {
      body = (
        <MainScreen
          firstName={firstName}
          gates={gates}
          onOpenExposure={() => setAppScreen("exposure")}
          onOpenNotifs={() => setAppScreen("notifs")}
          onOpenProfile={() => setAppScreen("profile")}
          onRefreshGates={refresh}
        />
      );
    }
  }

  const showDevRig = import.meta.env.DEV && !!me?.hasProfile;

  return <PhoneShell footer={showDevRig ? <DevRig onChanged={refresh} /> : undefined}>{body}</PhoneShell>;
}

function Loading() {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: 3, color: color.gold }}>LOADING…</div>
    </div>
  );
}
