import { ComponentType, ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../App";

const HYDRATION_TIMEOUT_MS = 8000;

// Segura a tela do jogo até o estado chegar do servidor (ex.: após um refresh)
export function GameRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isHydrated } = useContext(AppContext);

  useEffect(() => {
    if (isHydrated) return;

    // Sem sessão não há estado a restaurar; com sessão, espera o servidor até o timeout
    const hasSession = !!sessionStorage.getItem("playerId");
    const timer = setTimeout(
      () => navigate("/", { replace: true }),
      hasSession ? HYDRATION_TIMEOUT_MS : 0,
    );
    return () => clearTimeout(timer);
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <p className="font-['Orbitron'] text-[#00D9FF] tracking-widest animate-pulse">
          CONNECTING...
        </p>
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
