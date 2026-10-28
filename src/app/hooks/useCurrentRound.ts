import { useContext } from "react";
import { AppContext } from "../app-context";
import { Round } from "../interfaces/interfaces";

export function useCurrentRound(): Round {
  const { gameState } = useContext(AppContext);
  return gameState.rounds[gameState.currentRoundIndex];
}
