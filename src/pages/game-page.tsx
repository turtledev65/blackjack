import { Card, IPlayer } from "../types";
import CardContainer from "../components/card-container";
import usePlayers from "../hooks/usePlayers";
import { useEffect } from "react";
import { socket } from "../utils/socket";

const GamePage = () => {
  const { players, setPlayers } = usePlayers();

  useEffect(() => {
    console.log(players);
  }, [players]);

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
        <div>
          <Dealer />
        </div>
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

type PlayerProps = {
  name: string;
  cards?: Card[];
  score: number;
};

const Player = ({ name, cards, score }: PlayerProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="rounded bg-black bg-opacity-60 px-4 text-center text-lg font-bold text-white">
        {score}
      </p>
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
