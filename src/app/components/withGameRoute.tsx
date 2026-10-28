import { ComponentType } from "react";
import { GameRoute } from "./GameRoute";

export const withGameRoute = (Screen: ComponentType) => () => (
  <GameRoute>
    <Screen />
  </GameRoute>
);
