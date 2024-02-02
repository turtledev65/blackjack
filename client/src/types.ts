export type Card = {
  value: number;
  type: "clubs" | "diamonds" | "hearts" | "spades";
};

export type Player = {
  wallet: number;
  bet: number;
  cards: Card[];
  id: string;
};
