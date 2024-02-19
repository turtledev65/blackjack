import { Card } from "../types";
import Hand from "./hand";

export default class Dealer {
  hand = new Hand();

  faceupCard(): Readonly<Card> {
    return this.hand.cards[0];
  }
}
