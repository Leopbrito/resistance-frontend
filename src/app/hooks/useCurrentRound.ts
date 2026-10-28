import { useContext } from "react";
import { AppContext } from "../App";
import { Round } from "../interfaces/interfaces";

export function useCurrentRound(): Round {
  const { gameState } = useContext(AppContext);
  return gameState.rounds[gameState.currentRoundIndex];
}
