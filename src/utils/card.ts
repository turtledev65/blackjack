import { Card } from "../types";

export function getCardValue(card: Card) {
  return typeof card.value === "string" ? 10 : card.value;
}
