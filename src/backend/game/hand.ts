import { Card } from "../../types";

export default class Hand {
  private _cards: Card[] = [];
  private _score = 0;
  private aceValue = 0;

  constructor(...initialCards: Card[]) {
    this.addCards(...initialCards);
  }

  addCards(...cards: Card[]) {
    this._cards.push(...cards);
    this.updateScore(cards);
  }

  updateScore(newCards: Card[]) {
    for (const card of newCards) {
      if (typeof card.value === "number") this._score += card.value;
      else if (card.value === "A") this.aceValue = 11;
      else this._score += 10;

      if (this.aceValue !== 0) {
        if (this.aceValue + this.score > 21) this.aceValue = 1;
        this._score += this.aceValue;
        this.aceValue = 0;
      }
    }
  }

  clearCards() {
    this._cards = [];
    this._score = 0;
  }

  split() {
    if (this._cards.length !== 2)
      throw new Error("You can't split if you don't have 2 cards");
    if (this._cards[0].value !== this._cards[1].value)
      throw new Error(
        "You can't split if you don't have cards with different values"
      );

    return [new Hand(this._cards[0]), new Hand(this._cards[1])];
  }

  hasNatural() {
    return this.cards.length === 2 && this.score === 21;
  }

  get score() {
    return this._score;
  }

  get cards(): readonly Card[] {
    return this._cards;
  }
}
