import { randomRange } from "../utils/random";
import CardComponent from "./card";

type CardType = "clubs" | "diamonds" | "hearts" | "spades";

type Card = {
  value: number;
  type: CardType;
};

type CardContainerProps = {
  cards: Card[];
};

const CardContainer = ({ cards }: CardContainerProps) => {
  return (
    <div className="relative rounded border-8 border-white border-opacity-65 p-2">
      <div className="invisible aspect-2/3 w-44"></div>
      {cards.map((card, index) => (
        <div
          className="absolute"
          style={{
            top: `${index * 2}rem`,
            rotate: `${randomRange(-10, 10)}deg`
          }}
          key={index}
        >
          <CardComponent value={card.value} type={card.type} />
        </div>
      ))}
    </div>
  );
};

export default CardContainer;
