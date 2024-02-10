import { Card } from "../types.js";

export default class Deck {
  static readonly SUITS = ["clubs", "spades", "diamonds", "hearts"];
  static readonly DECK_LENGTH = 52;
  static readonly CARDS_PER_SUIT = 13;

  private cards: Card[];

  constructor() {
    this.cards = new Array(Deck.DECK_LENGTH)
      .fill(undefined)
      .map((_, index) => ({
        value: (index % Deck.CARDS_PER_SUIT) + 1,
        suit: Deck.SUITS[index % Deck.SUITS.length],
      })) as Card[];
  }

  draw(cards: number) {
    const out = this.cards.splice(-cards, cards);
    if (out.length === 0) return undefined;
    return out;
  }
}
