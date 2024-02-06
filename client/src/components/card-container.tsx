import { Card } from "../types";
import { randomRange } from "../utils/random";
import CardComponent from "./card";

type CardContainerProps = {
  cards: Card[];
  flippedCards?: number;
};

const CardContainer = ({ cards, flippedCards = 0 }: CardContainerProps) => {
  if (!cards.length) {
    return (
      <div className="aspect-2/3 w-44 rounded border-8 border-dashed"></div>
    );
  }

  const allCards = new Array(flippedCards + cards.length)
    .fill(null)
    .map((_, index) => (
      <div
        className="absolute top-0"
        style={{
          left: `${index * 2.5}rem`,
          rotate: `${randomRange(-3, 3)}deg`
        }}
        key={index}
      >
        {index < flippedCards ? (
          <CardComponent flipped />
        ) : (
          <CardComponent
            value={cards[index - flippedCards].value}
            type={cards[index - flippedCards].type}
          />
        )}
      </div>
    ));

  return (
    <div className="relative inline-block">
      <div className="invisible aspect-2/3 w-44"></div>
      {...allCards}
    </div>
  );
};

export default CardContainer;
