type CardType = "clubs" | "diamonds" | "hearts" | "spades";

type CardProps = {
  value: number;
  type: CardType;
  rotation?: number;
};

import {
  ImClubs as Clubs,
  ImHeart as Hearts,
  ImDiamonds as Diamonds,
  ImSpades as Spades
} from "react-icons/im";

const Card = ({ value, type, rotation }: CardProps) => {
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

  return (
    <div
      className="aspect-2/3 w-44 rounded bg-white p-2 text-xl"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative h-full w-full">
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
