import { Card } from "../types.js";

export default class Player {
  cards: Card[];

  private _ballance: number = 0;
  private _bet: number = 0;

  constructor(cards: Card[], wallet: number) {
    this.cards = [...cards];
    this._ballance = Math.abs(wallet);
  }

  get ballance() {
    return this._ballance;
  }
  set ballance(value) {
    this._ballance = Math.max(this._ballance - value, 0);
  }

  get bet() {
    return this._bet;
  }
  set bet(value) {
    this._bet = Math.min(this._bet, this._ballance);
  }
}
