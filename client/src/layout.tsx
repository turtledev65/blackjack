import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import socket from "./utils/socket";

const Layout = () => {
  useEffect(() => {
    socket.on("error", msg => {
      toast.error(msg, { duration: 3000 });
    });

    return () => {
      socket.off("error");
    };
  });

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};

export default Layout;
