import { Card, IPlayer } from "../types";
import CardContainer from "../components/card-container";
import usePlayers from "../hooks/usePlayers";
import { useEffect, useMemo } from "react";
import { socket } from "../utils/socket";

const GamePage = () => {
  const { players, setPlayers } = usePlayers();

  useEffect(() => {
    socket.on("player-joined", (newPlayer: IPlayer) => {
      setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    });

    return () => {
      socket.off("player-joined");
    };
  }, []);

  return (
    <>
      <div className="absolute inset-6 flex flex-col justify-between">
        <Dealer />
        <div className="flex justify-center gap-4">
          {players.map(player => (
            <Player
              key={player.name}
              name={player.name}
              cards={player.hand.cards as Card[]}
              score={player.hand.score}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default GamePage;

type ScoreProps = {
  value: number;
};
const Score = ({ value }: ScoreProps) => {
  const bgColor = useMemo(() => {
    if (value === 21) return "bg-blue-500";
    else if (value > 21) return "bg-red-700";
    else return "bg-black";
  }, [value]);

  return (
    <p
      className={`rounded ${bgColor} bg-opacity-60 px-4 text-center text-lg font-bold text-white`}
    >
      {value}
    </p>
  );
};

type PlayerProps = {
  name: string;
  cards?: Card[];
  score: number;
};
const Player = ({ name, cards, score }: PlayerProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {score > 0 && <Score value={score} />}
      <CardContainer cards={cards || []} />
      <p className="text-xl text-gray-100">{name}</p>
    </div>
  );
};

type DealerProps = {
  cards?: Card[];
};
const Dealer = ({ cards }: DealerProps) => {
  return <Player cards={cards || []} score={10} name="Dealer" />;
};
