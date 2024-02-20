import { IDealer } from "../../types";
import Hand from "./hand";

export default class Dealer implements IDealer {
  hand = new Hand();

  toSimplifiedObject(): IDealer {
    return {
      hand: this.hand.toSimplifiedObject(),
      faceupCard: this.faceupCard
    };
  }

  get faceupCard() {
    return this.hand.cards[0];
  }
}
