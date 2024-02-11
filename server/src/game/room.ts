import Deck from "./deck.js";
import Player from "./player.js";

export default class Room {
  name: string;
  deck: Deck;

  private players: Player[] = [];

  constructor(name: string) {
    this.name = name;
    this.deck = new Deck();
  }

  addPlayer(newPlayer: Player) {
    this.players.push(newPlayer);
  }
}
