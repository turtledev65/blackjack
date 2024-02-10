import Deck from "./deck.js";
import Player from "./player.js";

export default class Game {
  deck: Deck;
  private players: Player[] = [];

  constructor() {
    this.deck = new Deck();
  }

  addPlayer(newPlayer: Player) {
    this.players.push(newPlayer);
  }
}
