import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import TestPage from "./pages/test-page";
import HomePage from "./pages/home-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "test", element: <TestPage /> }
    ]
  }
]);

export default router;
