import { Card } from "../types";
import CardComponent from "./card";

type CardContainerProps = {
  cards: Card[];
};

const CardContainer = ({ cards }: CardContainerProps) => {
  return (
    <div className="relative inline-block p-2">
      <div className="invisible aspect-2/3 w-44"></div>
      {cards.map((card, index) => (
        <div
          className="absolute top-0"
          style={{
            left: `${index * 2}rem`
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
