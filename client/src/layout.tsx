import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};

export default Layout;
