import LinkedList from "../../utils/linked-list";
import { Strategy } from "../types";
import Hand from "./hand";

export default class Player {
  name: string;
  ballance: number;
  bet: number = 0;

  private _strategy: Strategy = null;

  private _hands = new LinkedList(new Hand());
  private currHandNode = this._hands.first;
  private currHand = this.currHandNode!.value;

  constructor(name: string, ballance: number) {
    this.name = name;
    this.ballance = Math.abs(ballance);
  }

  playStrategy(strategy: Strategy) {
    switch (strategy) {
      case "double-down": {
        if (this.currHand.cards.length != 2)
          throw new Error(
            `You can't double down if you have more than 2 cards`
          );
        if (this.bet * 2 > this.ballance)
          throw new Error(
            `Insufficient funds to place a bet of $${this.bet * 2}.`
          );

        this.ballance -= this.bet;
        this.bet *= 2;
        break;
      }
      case "insurance": {
        if (this.bet * 1.5 > this.ballance)
          throw new Error(
            `Insufficient funds to place a bet of ${this.bet * 1.5}`
          );

        const insuraceBet = this.bet / 2;
        this.ballance -= insuraceBet;
        this.bet += insuraceBet;
        break;
      }
      case "surrender": {
        if (this.currHand.cards.length > 2)
          throw new Error("You can't surrender if you have more than 2 cards");

        this.bet /= 2;
        this.ballance += this.bet;

        break;
      }
      case "split-pairs": {
        if (this.bet * 2 > this.ballance)
          throw new Error(
            `Insufficient funds to place a bet of ${this.bet * 2}`
          );

        this.ballance -= this.bet;
        this.bet *= 2;
        this._hands = new LinkedList(...this.currHand.split());
        this.currHandNode = this._hands.first;
        this.currHand = this.currHandNode!.value;
        break;
      }
    }
    this._strategy = strategy;
  }

  nextHand() {
    if (!this.currHandNode || !this.currHandNode.next) return null;
    this.currHandNode = this.currHandNode.next;
    this.currHand = this.currHandNode.value;
    if (this.currHand.hasNatural()) this.nextHand();
  }

  reset() {
    // reset hands
    this.hands.clear();
    this.hands.addLast(new Hand());
    this.currHandNode = this.hands.first;
    this.currHand = this.currHandNode!.value;

    this._strategy = null;
    this.bet = 0;
  }

  get strategy() {
    return this._strategy;
  }

  get insuranceBet() {
    if (this.strategy !== "insurance") return 0;
    return this.bet / 3;
  }

  get hand() {
    return this.currHand;
  }

  get hands(): Readonly<LinkedList<Hand>> {
    return this._hands;
  }
}
