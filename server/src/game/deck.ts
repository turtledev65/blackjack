import { Card } from "../types.js";

const INITIAL_LENGTH = 52;
const SUITS = ["clubs", "spades", "diamonds", "hearts"] as const;
const CARD_VALUES = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"] as const;

export default class Deck {
  private cards: Card[];

  constructor() {
    this.cards = new Array(INITIAL_LENGTH).fill(null).map((_, index) => {
      return {
        value: CARD_VALUES[index % CARD_VALUES.length],
        suit: SUITS[index % SUITS.length],
      };
    }) as Card[];
    this.shuffle();
  }

  draw(cards: number) {
    return this.cards.splice(-cards, cards);
  }

  shuffle() {
    this.cards.sort(() => Math.random() - 0.5);
  }
}
