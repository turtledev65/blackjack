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
    <div className="relative inline-block rounded border-8 border-white border-opacity-65 p-2">
      <div className="invisible aspect-2/3 w-44"></div>
      {cards.map((card, index) => (
        <div
          className="absolute top-0"
          style={{
            left: `${index * 2}rem`,
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
