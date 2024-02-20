import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import Player from "../backend/game/player";

const GamePage = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <>
      {players.map(player => (
        <div>{player.name}</div>
      ))}
    </>
  );
};

export default GamePage;
