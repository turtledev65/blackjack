import { Card } from "../types";

export function getCardValue(card: Card) {
  if (card.value === "A") return 11;
  return typeof card.value === "string" ? 10 : card.value;
}
