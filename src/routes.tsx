import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import TestPage from "./pages/test-page";
import HomePage from "./pages/home-page";
import CreateRoomPage from "./pages/create-room-page";
import JoinRoomPage from "./pages/join-room-page";
import GamePage from "./pages/game-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "create-room", element: <CreateRoomPage /> },
      { path: "join-room", element: <JoinRoomPage /> },
      {
        path: "room",
        children: [{ path: ":name", element: <GamePage /> }]
      },
      { path: "test", element: <TestPage /> }
    ]
  }
]);

export default router;
