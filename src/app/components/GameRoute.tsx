import { ComponentType, ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../App";
import { useWakeLock } from "../hooks/useWakeLock";
import { getPlayerId } from "../web-socket";

const HYDRATION_TIMEOUT_MS = 8000;

// Segura a tela do jogo até o estado chegar do servidor (ex.: após um refresh)
export function GameRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isHydrated } = useContext(AppContext);

  // Tela bloqueada suspende a aba e derruba o socket: mantém acesa durante o jogo
  useWakeLock(isHydrated);

  useEffect(() => {
    if (isHydrated) return;

    // Sem sessão não há estado a restaurar; com sessão, espera o servidor até o timeout
    const hasSession = !!getPlayerId();
    const timer = setTimeout(
      () => navigate("/", { replace: true }),
      hasSession ? HYDRATION_TIMEOUT_MS : 0,
    );
    return () => clearTimeout(timer);
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="font-display text-resistance tracking-widest animate-pulse">CONNECTING...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export const withGameRoute = (Screen: ComponentType) => () => (
  <GameRoute>
    <Screen />
  </GameRoute>
);
