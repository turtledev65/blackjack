import { Card, IDealer, IPlayer, PlayerAction } from "../types";
import CardContainer from "../components/card-container";
import usePlayers from "../hooks/usePlayers";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { socket } from "../utils/socket";
import { PiHandPalmLight } from "react-icons/pi";
import { getCardValue } from "../utils/card";

const GamePage = () => {
  const { players, setPlayers } = usePlayers();
  const [possibleActions, setPossibleActions] = useState<Set<PlayerAction>>(
    new Set()
  );

  useEffect(() => {
    socket.on("player-joined", (newPlayer: IPlayer) => {
      setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    });

    socket.on("update-players", (newPlayers: IPlayer[]) => {
      setPlayers(newPlayers);
    });

    socket.on("pick-action", (possibleActions: PlayerAction[]) => {
      console.log("pick action");
      console.log(possibleActions);
      setPossibleActions(new Set(possibleActions));
    });

    socket.on("round-ended", () => {
      console.log("turn ended");
      setPossibleActions(new Set());
    });

    return () => {
      socket.off("player-joined");
      socket.off("update-players");
      socket.off("pick-action");
    };
  }, []);

  return (
    <>
      <div className="absolute inset-6 flex flex-col items-center justify-between">
        <Dealer />
        <BetButton />
        {possibleActions.has("bet") ? (
          <BetButton />
        ) : (
          possibleActions.size >= 2 && (
            <div className="flex w-full items-center justify-center gap-20 *:flex-1">
              <div className="grid place-items-center">
                {possibleActions.has("insurance") && (
                  <Button
                    icon={<PiHandPalmLight />}
                    label="insurance"
                    onClick={() => socket.emit("insurance")}
                  />
                )}
                {possibleActions.has("hit") && (
                  <Button
                    icon={<PiHandPalmLight />}
                    label="Hit"
                    onClick={() => socket.emit("hit")}
                  />
                )}
              </div>
              {possibleActions.has("double-down") && (
                <div className="grid place-items-center self-center">
                  <DoubleDown />
                </div>
              )}
              <div className="flex flex-col justify-center gap-4">
                {possibleActions.has("surrender") && (
                  <Button
                    icon={<PiHandPalmLight />}
                    label="Surrender"
                    onClick={() => socket.emit("surrender")}
                  />
                )}
                {possibleActions.has("stand") && (
                  <Button
                    icon={<PiHandPalmLight />}
                    label="Stand"
                    onClick={() => socket.emit("stand")}
                  />
                )}
              </div>
            </div>
          )
        )}
        <div className="flex justify-center gap-4">
          {players.map(player => (
            <Player
              key={player.name}
              name={player.name}
              cards={player.hand.cards as Card[]}
              score={player.hand.score}
              ballance={player.ballance}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default GamePage;

type ButtonProps = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
};
const Button = ({ icon, label, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded bg-gradient-to-b from-green-400 to-green-700  px-4 py-2 text-4xl text-white hover:from-green-600 hover:to-green-700"
    >
      {icon}
      {label}
    </button>
  );
};

const DoubleDown = () => {
  return (
    <div
      onClick={() => {
        socket.emit("double-down");
      }}
      className="shadow-4xl group inline-block cursor-pointer select-none rounded-full border-8 border-dashed border-gray-300 bg-blue-900 p-2 text-white hover:border-gray-100 hover:bg-blue-800"
    >
      <div className="flex aspect-square w-20 items-center justify-center rounded-full bg-blue-800 p-2 text-4xl font-bold group-hover:bg-blue-700">
        x2
      </div>
    </div>
  );
};

const BetButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="flex gap-2"
      onSubmit={e => {
        e.preventDefault();
        const value = inputRef.current?.value;
        if (value) {
          socket.emitWithAck("bet", value);
        }
      }}
    >
      <input type="number" ref={inputRef} />
      <button type="submit">Bet</button>
    </form>
  );
};

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
  ballance?: number;
};
const Player = ({ name, cards, score, ballance }: PlayerProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {score > 0 && <Score value={score} />}
      <CardContainer cards={cards || []} />
      <p className="text-xl text-gray-100">{name}</p>
      <p className="mt-2 text-lg text-yellow-400">{ballance}</p>
    </div>
  );
};

const Dealer = () => {
  const [dealer, setDealer] = useState<IDealer>();
  const cards = dealer?.faceupCard ? [dealer.faceupCard] : [];

  useEffect(() => {
    socket.on("receive-dealer", newDealer => {
      setDealer(newDealer);
      console.log(newDealer);
    });

    return () => {
      socket.off("receive-dealer");
    };
  }, []);

  return (
    <Player
      cards={cards}
      score={dealer?.faceupCard ? getCardValue(dealer.faceupCard) : 0}
      name="Dealer"
    />
  );
};
