import {
  ImClubs as Clubs,
  ImHeart as Hearts,
  ImDiamonds as Diamonds,
  ImSpades as Spades
} from "react-icons/im";
import { Card as CardType } from "../types";

type CardProps = {
  card: CardType;
  rotation?: number;
};

const Card = ({ card, rotation }: CardProps) => {
  const Icon = (() => {
    if (card.type === "clubs") return Clubs;
    else if (card.type === "diamonds") return Diamonds;
    else if (card.type === "spades") return Spades;
    else return Hearts;
  })();
  const label = (() => {
    if (card.value <= 10) return card.value;
    if (card.value === 11) return "J";
    else if (card.value === 12) return "Q";
    else if (card.value === 13) return "K";
    else return "A";
  })();

  return (
    <div
      className="aspect-2/3 w-44 rounded border-2 border-black bg-white p-2 text-xl"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative h-full w-full">
        <div
          className={`absolute left-0 top-0 flex flex-col items-center justify-center font-bold ${
            card.type === "hearts" || card.type === "diamonds"
              ? "text-red-500"
              : "text-black"
          }`}
        >
          {label}
          <Icon />
        </div>
        <div
          className={`absolute bottom-0 right-0 flex rotate-180 flex-col items-center justify-center font-bold ${
            card.type === "hearts" || card.type === "diamonds"
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
