import { useEffect } from "react";

// Mantém a tela acesa enquanto `enabled`. O navegador libera o lock sempre que a aba
// fica oculta, então ele é pedido de novo ao voltar a ficar visível.
export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      if (sentinel || document.visibilityState !== "visible") return;

      try {
        const lock = await navigator.wakeLock.request("screen");

        // Desmontou enquanto o pedido estava pendente
        if (cancelled) {
          lock.release().catch(() => {});
          return;
        }

        sentinel = lock;
        lock.addEventListener("release", () => {
          if (sentinel === lock) sentinel = null;
        });
      } catch (error) {
        // Negado (economia de bateria, política do navegador): o jogo segue normalmente
        console.warn("Wake lock unavailable:", error);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") acquire();
    };

    acquire();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      sentinel?.release().catch(() => {});
      sentinel = null;
    };
  }, [enabled]);
}
