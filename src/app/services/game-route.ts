import { GamePhase } from "../enums/enums";
import { GameState } from "../interfaces/interfaces";

const RESUMABLE_ROUTES = [
  "/",
  "/lobby",
  "/role-reveal",
  "/mission-voting",
  "/mission-result",
  "/game-end",
];

// Rota em que o jogador deve estar, derivada do estado persistido no servidor
export function getRouteForState(gameState: GameState): string {
  const me = gameState.me;

  if (gameState.phase === GamePhase.WAITING) return "/lobby";
  if (me?.rolesSeen === false) return "/role-reveal";
  if (me?.pendingMissionResult != null) return "/mission-result";

  if (gameState.phase === GamePhase.FINISHED) {
    return me?.gameEndSeen === false ? "/game-end" : "/lobby";
  }

  return "/mission-voting";
}

// Não puxa quem está fora do fluxo do jogo (ex.: digitando o código em /join)
export function canResumeFrom(pathname: string): boolean {
  return RESUMABLE_ROUTES.includes(pathname);
}
