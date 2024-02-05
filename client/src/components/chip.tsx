import { useCallback } from "react";

type ChipProps = {
  value: 1 | 5 | 25 | 50 | 100 | 500;
};

const Chip = ({ value }: ChipProps) => {
  const getPrimaryColor = useCallback(() => {
    switch (value) {
      case 1:
        return "bg-white text-blue-800";
      case 5:
        return "bg-red-700";
      case 25:
        return "bg-green-900";
      case 50:
        return "bg-blue-800";
      case 100:
        return "bg-zinc-800";
      case 500:
        return "bg-purple-800";
    }
  }, [value]);

  const getBgColor = useCallback(() => {
    switch (value) {
      case 1:
        return "bg-blue-800";
      case 5:
        return "bg-red-800";
      case 25:
        return "bg-green-950";
      case 50:
        return "bg-blue-900";
      case 100:
        return "bg-zinc-900";
      case 500:
        return "bg-purple-900";
    }
  }, [value]);

  return (
    <div
      className={`rounded-full border-8 border-dashed border-gray-100 p-2 text-white shadow-2xl ${getBgColor()}`}
    >
      <div
        className={`flex aspect-square w-20 items-center justify-center rounded-full p-4 text-4xl font-bold ${getPrimaryColor()}`}
      >
        {value}
      </div>
    </div>
  );
};

export default Chip;
