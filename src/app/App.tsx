import React from "react";
import { RouterProvider } from "react-router";
import { GamePhase } from "./enums/enums";
import { GameState } from "./interfaces/interfaces";
import { router } from "./routes";
import { navigate } from "./services/navigation-service";
import { socket } from "./web-socket";

export interface GameStateContext {
  roomCode: string;
  setRoomCode: React.Dispatch<React.SetStateAction<string>>;
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  isRoleRevealed: boolean,
  setIsRoleRevealed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext: React.Context<GameStateContext> = React.createContext(
  {} as GameStateContext,
);

export default function App() {
  const [roomCode, setRoomCode] = React.useState<string>("");
  const [gameState, setGameState] = React.useState<GameState>({} as GameState);
  const [isRoleRevealed, setIsRoleRevealed] = React.useState<boolean>(false);

  socket.on("gameStateUpdate", (updatedGameState: GameState) => {
    console.log("updatedGameState: ", updatedGameState);
    
    if(updatedGameState.phase === GamePhase.TEAM_SELECTION && !isRoleRevealed) {
      navigate("/role-reveal")
    }

    setGameState(updatedGameState)
  });

  return (
    <AppContext.Provider
      value={{
        roomCode,
        setRoomCode,
        gameState,
        setGameState,
        isRoleRevealed,
        setIsRoleRevealed
      }}
    >
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}
