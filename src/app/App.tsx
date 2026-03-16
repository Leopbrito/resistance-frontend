import React from "react";
import { RouterProvider } from "react-router";
import { GamePhase, SocketEvent } from "./enums/enums";
import { GameState } from "./interfaces/interfaces";
import { router } from "./routes";
import { navigate } from "./services/navigation-service";
import { socket } from "./web-socket";

export interface GameStateContext {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const AppContext: React.Context<GameStateContext> = React.createContext(
  {} as GameStateContext,
);

export default function App() {
  const [gameState, setGameState] = React.useState<GameState>({} as GameState);

  socket.on(SocketEvent.GAME_STATE_UPDATE, (updatedGameState: GameState) => {
    console.log("updatedGameState: ", updatedGameState);
    setGameState(updatedGameState);
  });

  socket.on(SocketEvent.REVEAL_ROLES, () => {
    navigate("/role-reveal");
  });

  socket.on(SocketEvent.OPEN_MISSION_RESULT_SCREEN, () => {
    navigate("/mission-result");
  });

  socket.on(SocketEvent.RECONNECT, (updatedGameState: GameState) => {
    console.log("Reconnecting...");
    setGameState(updatedGameState);

    if (
      updatedGameState.phase === GamePhase.WAITING ||
      updatedGameState.phase === GamePhase.FINISHED
    ) {
      navigate("/lobby");
    }

    if (
      updatedGameState.phase === GamePhase.TEAM_SELECTION ||
      updatedGameState.phase === GamePhase.VOTING ||
      updatedGameState.phase === GamePhase.MISSION
    ) {
      navigate("/mission-voting");
    }
  });

  return (
    <AppContext.Provider
      value={{
        gameState,
        setGameState,
      }}
    >
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}
