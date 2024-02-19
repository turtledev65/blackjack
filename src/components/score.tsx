import { useCallback } from "react";

type ScoreProps = {
  score: number;
};

const Score = ({ score }: ScoreProps) => {
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
