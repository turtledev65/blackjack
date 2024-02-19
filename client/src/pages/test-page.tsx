import BetPannel from "../components/bet-pannel";
import Card from "../components/card";
import CardContainer from "../components/card-container";
import Chip from "../components/chip";
import Score from "../components/score";
import { Card as CardType } from "../types";

const TestPage = () => {
  const cards = [
    { value: 1, type: "hearts" },
    { value: 10, type: "hearts" },
    { value: 10, type: "hearts" }
  ] as CardType[];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <Score cards={cards} />
      <CardContainer cards={cards} />
      <Card flipped />
      <Chip value={500} />
      <BetPannel
        balance={100}
        onAddChip={chip => console.log("increase bet by", chip)}
      />
    </div>
  );
};

export default TestPage;
