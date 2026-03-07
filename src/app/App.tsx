import React from "react";
import { RouterProvider } from "react-router";
import { GameState } from "./interfaces/interfaces";
import { router } from "./routes";
import { navigate } from "./services/navigation-service";
import { socket } from "./web-socket";

export interface GameStateContext {
  roomCode: string;
  setRoomCode: React.Dispatch<React.SetStateAction<string>>;
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const AppContext: React.Context<GameStateContext> = React.createContext(
  {} as GameStateContext,
);

export default function App() {
  const [roomCode, setRoomCode] = React.useState<string>("");
  const [gameState, setGameState] = React.useState<GameState>({} as GameState);

  socket.on("gameStateUpdate", (updatedGameState: GameState) => {
    console.log("updatedGameState: ", updatedGameState);
    
    if(updatedGameState.revealRolesStep) {
      navigate("/role-reveal")
    }

    if(updatedGameState.revealMissionResultStep) {
      navigate("/mission-result")
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
      }}
    >
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}
