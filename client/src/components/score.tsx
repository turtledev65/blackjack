import { Card } from "../types";

type ScoreProps = {
  cards: Card[];
};

const Score = ({ cards }: ScoreProps) => {
  const score = cards.reduce((acc, card) => acc + Math.min(card.value, 10), 0);
  const bgColor = score > 21 ? "red-800" : score < 21 ? "black" : "blue-500";

  return (
    <p
      className={`bg-${bgColor} rounded bg-opacity-75 px-4 text-lg text-white`}
    >
      {score}
    </p>
  );
};

export default Score;
