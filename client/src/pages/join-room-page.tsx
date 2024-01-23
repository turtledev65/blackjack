import { useEffect, useRef } from "react";
import socket from "../utils/socket";
import { useNavigate } from "react-router-dom";

const JoinRoomPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("room-joined", name => {
      navigate(`/room/${name}`);
    });

    return () => {
      socket.off("room-joined");
    };
  }, []);

  const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gameName = nameRef.current?.value?.trim();
    console.log(gameName);
    if (gameName) socket.emit("join-room", gameName);
  };

  return (
    <form
      onSubmit={handleJoinRoom}
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
        Join Room
      </button>
    </form>
  );
};

export default JoinRoomPage;
