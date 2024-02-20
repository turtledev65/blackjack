import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { socket } from "./utils/socket";
import { PlayersProvider } from "./providers/players";

const Layout = () => {
  useEffect(() => {
    socket.on("err", msg => {
      console.log(msg);
      toast.error(msg, {
        duration: 3000,
        className: "bg-red-500 text-white text-xl font-bold",
        iconTheme: {
          primary: "white",
          secondary: "rgb(239 68 68)"
        }
      });
    });

    socket.on("disconnect", () =>
      toast.error("Disconnected from the server!", {
        duration: 3000,
        className: "bg-red-500 text-white text-xl font-bold",
        iconTheme: {
          primary: "white",
          secondary: "rgb(239 68 68)"
        }
      })
    );

    return () => {
      socket.off("err");
      socket.off("disconnect");
    };
  });

  return (
    <>
      <PlayersProvider>
        <Outlet />
      </PlayersProvider>
      <Toaster />
    </>
  );
};

export default Layout;
