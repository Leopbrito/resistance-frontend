import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomeScreen } from "./screens/HomeScreen";
import { JoinRoomScreen } from "./screens/JoinRoomScreen";
import { LobbyScreen } from "./screens/LobbyScreen";
import { RoleRevealScreen } from "./screens/RoleRevealScreen";
import { MissionVotingScreen } from "./screens/MissionVotingScreen";
import { MissionResultScreen } from "./screens/MissionResultScreen";

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
        Component: LobbyScreen,
      },
      {
        path: "role-reveal",
        Component: RoleRevealScreen,
      },
      {
        path: "mission-voting",
        Component: MissionVotingScreen,
      },
      {
        path: "mission-result",
        Component: MissionResultScreen,
      },
    ],
  },
]);