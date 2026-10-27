import React from "react";
import { RouterProvider } from "react-router";
import { SocketEvent } from "./enums/enums";
import { GameState } from "./interfaces/interfaces";
import { router } from "./routes";
import { canResumeFrom, getRouteForState } from "./services/game-route";
import { navigate } from "./services/navigation-service";
import { socket } from "./web-socket";

export interface GameStateContext {
  gameState: GameState;
  isHydrated: boolean;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const AppContext: React.Context<GameStateContext> = React.createContext(
  {} as GameStateContext,
);

export default function App() {
  const [gameState, setGameState] = React.useState<GameState>({} as GameState);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    const onGameStateUpdate = (updatedGameState: GameState) => {
      console.log("updatedGameState: ", updatedGameState);
      setGameState(updatedGameState);
      setIsHydrated(true);
    };

    const onRevealRoles = () => navigate("/role-reveal");

    const onOpenMissionResultScreen = () => navigate("/mission-result");

    const onReconnect = (updatedGameState: GameState) => {
      console.log("Reconnecting...");
      setGameState(updatedGameState);
      setIsHydrated(true);

      if (canResumeFrom(router.state.location.pathname)) {
        navigate(getRouteForState(updatedGameState));
      }
    };

    socket.on(SocketEvent.GAME_STATE_UPDATE, onGameStateUpdate);
    socket.on(SocketEvent.REVEAL_ROLES, onRevealRoles);
    socket.on(SocketEvent.OPEN_MISSION_RESULT_SCREEN, onOpenMissionResultScreen);
    socket.on(SocketEvent.RECONNECT, onReconnect);

    return () => {
      socket.off(SocketEvent.GAME_STATE_UPDATE, onGameStateUpdate);
      socket.off(SocketEvent.REVEAL_ROLES, onRevealRoles);
      socket.off(SocketEvent.OPEN_MISSION_RESULT_SCREEN, onOpenMissionResultScreen);
      socket.off(SocketEvent.RECONNECT, onReconnect);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        gameState,
        isHydrated,
        setGameState,
      }}
    >
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}
