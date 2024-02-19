import {
  ImClubs as Clubs,
  ImHeart as Hearts,
  ImDiamonds as Diamonds,
  ImSpades as Spades
} from "react-icons/im";
import { Card } from "../types";

type NormalCard = {
  flipped?: false;
} & Card;

type FlippedCard = {
  flipped: true;
} & {
  [key in keyof Card]?: never;
};

type CardProps = NormalCard | FlippedCard;

const Card = ({ value, suit, flipped }: CardProps) => {
  if (flipped)
    return (
      <div className="flex aspect-2/3 w-44 select-none items-center justify-center rounded border-8 border-red-400 bg-white p-2 text-xl shadow-2xl">
        <Hearts className="text-9xl text-red-600" />
      </div>
    );

  const Icon = (() => {
    if (suit === "clubs") return Clubs;
    else if (suit === "diamonds") return Diamonds;
    else if (suit === "spades") return Spades;
    else return Hearts;
  })();

  return (
    <div className="aspect-2/3 w-44 select-none rounded bg-white p-2 text-xl shadow-2xl">
      <div className="relative flex h-full w-full items-center justify-center">
        <div
          className={`absolute left-0 top-0 flex flex-col items-center justify-center font-bold ${
            suit === "hearts" || suit === "diamonds"
              ? "text-red-500"
              : "text-black"
          }`}
        >
          {value}
          <Icon />
        </div>
        <div>
          <Icon
            className={`text-9xl ${
              suit === "hearts" || suit === "diamonds"
                ? "text-red-500"
                : "text-black"
            }`}
          />
        </div>
        <div
          className={`absolute bottom-0 right-0 flex rotate-180 flex-col items-center justify-center font-bold ${
            suit === "hearts" || suit === "diamonds"
              ? "text-red-500"
              : "text-black"
          }`}
        >
          {value}
          <Icon />
        </div>
      </div>
    </div>
  );
};

export default Card;
