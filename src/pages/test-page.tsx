import BetPannel from "../components/bet-pannel";
import Card from "../components/card";
import CardContainer from "../components/card-container";
import Chip from "../components/chip";
import Score from "../components/score";
import { Card as CardType } from "../types";

const TestPage = () => {
  const cards = [
    { value: 1, suit: "hearts" },
    { value: 10, suit: "hearts" },
    { value: 10, suit: "hearts" }
  ] as CardType[];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <Score value={21} />
      <CardContainer cards={cards} />
      <Card value="J" suit="hearts" />
      <Chip value={500} />
      <BetPannel
        balance={100}
        onAddChip={chip => console.log("increase bet by", chip)}
      />
    </div>
  );
};

export default TestPage;
