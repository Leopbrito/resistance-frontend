import React from "react";
import { GameState } from "./interfaces/interfaces";

export interface GameStateContext {
  gameState: GameState;
  isHydrated: boolean;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const AppContext: React.Context<GameStateContext> = React.createContext(
  {} as GameStateContext,
);
