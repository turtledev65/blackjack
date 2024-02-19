import { useCallback } from "react";

type ScoreProps = {
  value: number;
};

const Score = ({ value }: ScoreProps) => {
  const getBgColor = useCallback(() => {
    if (value === 21) return "bg-blue-500";
    else if (value > 21) return "bg-red-700";
    else return "bg-black";
  }, [value]);

  return (
    <p
      className={`${getBgColor()} inline-block rounded bg-opacity-65 px-4 text-center text-xl font-bold text-white`}
    >
      {value}
    </p>
  );
};

export default Score;
