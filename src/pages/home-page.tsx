import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-20 px-5 text-center font-bold text-white">
      <h1 className="text-6xl">Blackjack</h1>
      <div className="flex w-full max-w-xl flex-col justify-center gap-6">
        <Link
          to="/create-room"
          className="rounded bg-blue-500 py-2 text-xl hover:bg-blue-600"
        >
          Create Room
        </Link>
        <Link
          to="/join-room"
          className="rounded bg-green-500 py-2 text-xl hover:bg-green-600"
        >
          Join Room
        </Link>
        <Link
          to="/"
          className="rounded bg-gray-400 py-2 text-xl hover:bg-gray-500"
        >
          About
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
