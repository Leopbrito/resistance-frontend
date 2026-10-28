import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomeScreen } from "./screens/HomeScreen";
import { JoinRoomScreen } from "./screens/JoinRoomScreen";
import ErrorRedirect from "./components/ErrorRedirect";
import { withGameRoute } from "./components/GameRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomeScreen,
      },
      {
        path: "join",
        Component: JoinRoomScreen,
      },
      {
        path: "lobby",
        lazy: async () => {
          const { LobbyScreen } = await import("./screens/LobbyScreen");
          return { Component: withGameRoute(LobbyScreen) };
        },
        ErrorBoundary: ErrorRedirect,
      },
      {
        path: "role-reveal",
        lazy: async () => {
          const { RoleRevealScreen } = await import("./screens/RoleRevealScreen");
          return { Component: withGameRoute(RoleRevealScreen) };
        },
        ErrorBoundary: ErrorRedirect,
      },
      {
        path: "mission-voting",
        lazy: async () => {
          const { MissionVotingScreen } = await import("./screens/MissionVotingScreen");
          return { Component: withGameRoute(MissionVotingScreen) };
        },
        ErrorBoundary: ErrorRedirect,
      },
      {
        path: "mission-result",
        lazy: async () => {
          const { MissionResultScreen } = await import("./screens/MissionResultScreen");
          return { Component: withGameRoute(MissionResultScreen) };
        },
        ErrorBoundary: ErrorRedirect,
      },
      {
        path: "game-end",
        lazy: async () => {
          const { GameEndScreen } = await import("./screens/GameEndScreen");
          return { Component: withGameRoute(GameEndScreen) };
        },
        ErrorBoundary: ErrorRedirect,
      },
    ],
  },
]);
