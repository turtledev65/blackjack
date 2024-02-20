import { useContext } from "react";
import { PlayersContext, PlayersContextType } from "../providers/players";
import { Card } from "../types";
import CardContainer from "../components/card-container";

const GamePage = () => {
  const { players } = useContext(PlayersContext) as PlayersContextType;

  console.log(players);
  players.forEach(player => {
    console.log(player);
    console.log(player.hand.cards);
  });

  return (
    <>
      <div className="flex gap-4">
        {players.map(player => (
          <Player
            key={player.name}
            name={player.name}
            cards={player.hand.cards as Card[]}
            score={player.hand.score}
          />
        ))}
      </div>
    </>
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
      <p className="rounded bg-black bg-opacity-60 px-4 text-center text-lg font-bold text-white">
        {score}
      </p>
      <CardContainer cards={cards || []} />
      <p className="text-xl text-gray-100">{name}</p>
    </div>
  );
};

export default GamePage;
