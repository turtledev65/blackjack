import { Card } from "../types";
import { randomRange } from "../utils/random";
import CardComponent from "./card";

type CardContainerProps = {
  cards: Card[];
};

const CardContainer = ({ cards }: CardContainerProps) => {
  if (!cards.length) {
    return (
      <div className="aspect-2/3 w-44 rounded border-8 border-dashed"></div>
    );
  }

  return (
    <div className="relative inline-block">
      <div className="invisible aspect-2/3 w-44"></div>
      {cards.map((card, index) => (
        <div
          className="absolute top-0"
          style={{
            left: `${index * 2.5}rem`,
            rotate: `${randomRange(-3, 3)}deg`
          }}
          key={index}
        >
          <CardComponent card={card} />
        </div>
      ))}
    </div>
  );
};

export default CardContainer;
