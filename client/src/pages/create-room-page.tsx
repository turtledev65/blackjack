import React, { useEffect, useRef } from "react";
import socket from "../utils/socket";
import toast, { Toaster } from "react-hot-toast";

const CreateRoomPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket.on("room-exists", msg => {
      toast.error(msg, { duration: 3000 });
    });

    return () => {
      socket.off("room-exists");
    };
  }, []);

  const handleCreateRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gameName = nameRef.current?.value?.trim();
    if (gameName) socket.emit("create-room", gameName);
  };

  return (
    <form
      onSubmit={handleCreateRoom}
      className="flex min-h-screen flex-col items-center justify-center gap-6 text-xl text-white"
    >
      <div className="space-x-2">
        <label className="text-2xl" htmlFor="name">
          Name:
        </label>
        <input
          className="border-b-2 bg-transparent outline-none"
          id="name"
          type="text"
          ref={nameRef}
        />
      </div>
      <button
        type="submit"
        className="rounded bg-blue-500 px-2 py-3 font-bold hover:bg-blue-600"
      >
        Create Room
      </button>
      <Toaster />
    </form>
  );
};

export default CreateRoomPage;
