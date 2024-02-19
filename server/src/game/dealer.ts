import { Card } from "../types.js";
import Hand from "./hand.js";

export default class Dealer {
  hand = new Hand();

  faceupCard(): Readonly<Card> {
    return this.hand.cards[0];
  }
}
