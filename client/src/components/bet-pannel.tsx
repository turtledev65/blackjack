import BaseChip from "./chip";
import { BetValue } from "../types";

type BetPannelProps = {
  balance: number;
  onAddChip: (value: BetValue) => void;
};

const BetPannel = ({ balance, onAddChip }: BetPannelProps) => {
  return (
    <div className="absolute bottom-0 left-5 animate-slide-up">
      <span className="rounded-xl rounded-b-none bg-gray-800 px-10 py-2 text-xl font-bold text-white">
        Bank: ${balance}
      </span>
      <div className="flex max-w-2xl flex-wrap justify-center gap-x-20 gap-y-10 rounded-tr-xl bg-gray-800 py-6">
        <Chip value={1} onClick={() => onAddChip(1)} />
        <Chip value={5} onClick={() => onAddChip(5)} />
        <Chip value={25} onClick={() => onAddChip(25)} />
        <Chip value={50} onClick={() => onAddChip(50)} />
        <Chip value={100} onClick={() => onAddChip(100)} />
        <Chip value={500} onClick={() => onAddChip(500)} />
      </div>
    </div>
  );
};

type ChipProps = {
  value: BetValue;
  onClick: (value: BetValue) => void;
};

const Chip = ({ value, onClick }: ChipProps) => {
  return (
    <div
      onClick={() => onClick(value)}
      className="rounded-full border-4 border-transparent transition hover:border-yellow-400"
    >
      <BaseChip value={value} />
    </div>
  );
};

export default BetPannel;
