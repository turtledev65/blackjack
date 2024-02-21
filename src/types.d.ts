export type Suit = "clubs" | "spades" | "diamonds" | "hearts";
export type CardValue =
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | "J"
  | "Q"
  | "K"
  | "A";
export type Card = {
  value: CardValue;
  suit: Suit;
};

export type Strategy =
  | "double-down"
  | "insurance"
  | "split-pairs"
  | "surrender"
  | null;

export interface IHand {
  cards: Card[];
  score: number;
}

export interface IPlayer {
  name: string;
  ballance: number;
  hand: IHand;
}

export type PlayerAction = NonNullable<Strategy> | "stand" | "hit";

export interface IDealer {
  faceupCard: Card;
  hand: IHand;
}

export type BetValue = 1 | 5 | 25 | 50 | 100 | 500;
