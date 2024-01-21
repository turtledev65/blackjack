import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import TestPage from "./pages/test-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "test", element: <TestPage /> }]
  }
]);

export default router;
