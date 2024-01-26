import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import socket from "./utils/socket";

const Layout = () => {
  useEffect(() => {
    socket.on("error", msg => {
      toast.error(msg, {
        duration: 3000,
        className: "bg-red-500 text-white text-xl font-bold",
        iconTheme: {
          primary: "white",
          secondary: "rgb(239 68 68)"
        }
      });
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
