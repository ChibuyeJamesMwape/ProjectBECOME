import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useIsDesktop } from "./hooks/useIsDesktop";
import { PhoneShell } from "./components/PhoneShell";
import { DesktopCard } from "./components/DesktopCard";
import { DesktopShell } from "./components/DesktopShell";
import { Sidebar } from "./components/Sidebar";
import { DevRig } from "./components/DevRig";
import { AuthScreen } from "./screens/AuthScreen";
import { Welcome } from "./screens/Welcome";
import { Audit } from "./screens/Audit";
import { MainScreen } from "./screens/MainScreen";
import { Exposure } from "./screens/Exposure";
import { Profile } from "./screens/Profile";
import { Notifications } from "./screens/Notifications";
import type { Tab } from "./components/tabs";
import { color, font } from "./theme";

type OnboardScreen = "welcome" | "audit";
type AppScreen = "main" | "exposure" | "profile" | "notifs";

export function App() {
  const { me, loading, refresh, logout } = useAuth();
  const isDesktop = useIsDesktop();
  const [onboardScreen, setOnboardScreen] = useState<OnboardScreen>("welcome");
  const [appScreen, setAppScreen] = useState<AppScreen>("main");
  const [tab, setTab] = useState<Tab>("path");

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: 3, color: color.gold }}>LOADING…</div>
      </div>
    );
  }

  if (!me) {
    return isDesktop ? (
      <DesktopCard width={440}>
        <AuthScreen />
      </DesktopCard>
    ) : (
      <PhoneShell>
        <AuthScreen />
      </PhoneShell>
    );
  }

  if (!me.hasProfile) {
    const content =
      onboardScreen === "welcome" ? (
        <Welcome onBegin={() => setOnboardScreen("audit")} />
      ) : (
        <Audit onBack={() => setOnboardScreen("welcome")} onDone={refresh} />
      );
    return isDesktop ? <DesktopCard width={520}>{content}</DesktopCard> : <PhoneShell>{content}</PhoneShell>;
  }

  const gates = me.gates;
  const firstName = (me.profile?.name || "Friend").split(" ")[0];

  const content =
    appScreen === "exposure" ? (
      <Exposure gates={gates} onBack={() => setAppScreen("main")} onRegistered={refresh} />
    ) : appScreen === "profile" ? (
      <Profile me={me} gates={gates} onBack={() => setAppScreen("main")} />
    ) : appScreen === "notifs" ? (
      <Notifications onBack={() => setAppScreen("main")} />
    ) : (
      <MainScreen
        firstName={firstName}
        gates={gates}
        tab={tab}
        onTabChange={setTab}
        isDesktop={isDesktop}
        onOpenExposure={() => setAppScreen("exposure")}
        onOpenNotifs={() => setAppScreen("notifs")}
        onOpenProfile={() => setAppScreen("profile")}
        onRefreshGates={refresh}
      />
    );

  const showDevRig = import.meta.env.DEV;

  if (isDesktop) {
    return (
      <DesktopShell
        sidebar={
          <Sidebar
            tab={tab}
            onTabChange={(t) => {
              setAppScreen("main");
              setTab(t);
            }}
            gates={gates}
            onOpenProfile={() => setAppScreen("profile")}
            onOpenNotifs={() => setAppScreen("notifs")}
            onLogout={logout}
            devPanel={showDevRig ? <DevRig onChanged={refresh} onDark /> : undefined}
          />
        }
      >
        {content}
      </DesktopShell>
    );
  }

  return <PhoneShell footer={showDevRig ? <DevRig onChanged={refresh} /> : undefined}>{content}</PhoneShell>;
}
