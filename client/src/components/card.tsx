import {
  ImClubs as Clubs,
  ImHeart as Hearts,
  ImDiamonds as Diamonds,
  ImSpades as Spades
} from "react-icons/im";
import { Card as CardType } from "../types";

type CardProps = CardType & { flipped?: boolean };

const Card = ({ value, type, flipped }: CardProps) => {
  const Icon = (() => {
    if (type === "clubs") return Clubs;
    else if (type === "diamonds") return Diamonds;
    else if (type === "spades") return Spades;
    else return Hearts;
  })();
  const label = (() => {
    if (value <= 10) return value;
    if (value === 11) return "J";
    else if (value === 12) return "Q";
    else if (value === 13) return "K";
    else return "A";
  })();

  if (flipped)
    return (
      <div className="flex aspect-2/3 w-44 select-none items-center justify-center rounded border-8 border-red-400 bg-white p-2 text-xl shadow-2xl">
        <Hearts className="text-9xl text-red-600" />
      </div>
    );

  return (
    <div className="aspect-2/3 w-44 select-none rounded bg-white p-2 text-xl shadow-2xl">
      <div className="relative flex h-full w-full items-center justify-center">
        <div
          className={`absolute left-0 top-0 flex flex-col items-center justify-center font-bold ${
            type === "hearts" || type === "diamonds"
              ? "text-red-500"
              : "text-black"
          }`}
        >
          {label}
          <Icon />
        </div>
        <div>
          <Icon
            className={`text-9xl ${
              type === "hearts" || type === "diamonds"
                ? "text-red-500"
                : "text-black"
            }`}
          />
        </div>
        <div
          className={`absolute bottom-0 right-0 flex rotate-180 flex-col items-center justify-center font-bold ${
            type === "hearts" || type === "diamonds"
              ? "text-red-500"
              : "text-black"
          }`}
        >
          {label}
          <Icon />
        </div>
      </div>
    </div>
  );
};

export default Card;
