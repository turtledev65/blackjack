import { useCallback } from "react";
import { Card } from "../types";

type ScoreProps = {
  cards: Card[];
};

const Score = ({ cards }: ScoreProps) => {
  const score = cards.reduce((acc, card) => acc + Math.min(card.value, 10), 0);
  const getBgColor = useCallback(() => {
    if (score === 21) return "bg-blue-500";
    else if (score > 21) return "bg-red-700";
    else return "bg-black";
  }, [score]);

  return (
    <p
      className={`${getBgColor()} inline-block rounded bg-opacity-65 px-4 text-center text-xl font-bold text-white`}
    >
      {score}
    </p>
  );
};

export default Score;
