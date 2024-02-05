import { useEffect, useState } from "react";
import socket from "../utils/socket";
import CardContainer from "../components/card-container";
import { Card, Player as PlayerType } from "../types";
import Score from "../components/score";

const GamePage = () => {
  const [cards, setCards] = useState<Card[]>([]);

  const [otherPlayers, setOtherPlayers] = useState<PlayerType[]>([]);

  useEffect(() => {
    socket.emit("get-other-players", (players: PlayerType[]) => {
      setOtherPlayers(players);
    });

    socket.on("receive-cards", newCards =>
      setCards(prevCards => [...prevCards, ...newCards])
    );

    socket.on("receive-new-player", newPlayer =>
      setOtherPlayers(prevPlayers => [...prevPlayers, newPlayer])
    );

    return () => {
      socket.off("receive-cards");
      socket.off("receive-new-player");
    };
  }, []);

  return (
    <div className="absolute bottom-5 left-0 right-0 flex justify-center">
      <div className="flex items-center gap-5">
        {otherPlayers.map((player, i) => (
          <div
            className={`${i % 2 === 0 ? "order-first" : "order-last"}`}
            key={player.id}
          >
            <Player cards={player.cards} bet={player.bet} />
          </div>
        ))}
        <div className="order-l mx-10 flex flex-col items-center gap-4">
          <CardContainer cards={cards} />
          <BetForm minAmmount={10} maxAmmount={1000} />
        </div>
      </div>
    </div>
  );
};

type PlayerProps = {
  cards: Card[];
  bet: number;
};

const Player = ({ cards, bet }: PlayerProps) => {
  return (
    <div>
      {cards.length > 0 && (
        <div className="mb-2 flex justify-center">
          <Score cards={cards} />
        </div>
      )}
      <CardContainer cards={cards} />
      {bet > 0 && (
        <p className="mt-1 text-center text-3xl font-bold text-white">${bet}</p>
      )}
    </div>
  );
};

type BetFormProps = {
  minAmmount: number;
  maxAmmount: number;
};

const BetForm = ({ minAmmount, maxAmmount }: BetFormProps) => {
  const [ammount, setAmmount] = useState(minAmmount);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        socket.emit("bet", ammount);
      }}
    >
      <div className="inline-flex select-none flex-row items-center bg-white text-center  font-bold">
        <div className="px-2 text-center text-3xl tabular-nums">${ammount}</div>
        <div className="flex flex-col bg-green-600 px-2  text-white">
          <button
            type="button"
            onClick={() =>
              setAmmount(prevAmmount => Math.min(prevAmmount + 5, maxAmmount))
            }
            className="text-2xl"
          >
            +
          </button>
          <button
            type="button"
            onClick={() =>
              setAmmount(prevAmount => Math.max(prevAmount - 5, minAmmount))
            }
            className="text-4xl"
          >
            -
          </button>
        </div>
      </div>
      <button type="submit">OK</button>
    </form>
  );
};

export default GamePage;
