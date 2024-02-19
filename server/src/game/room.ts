import { Socket } from "socket.io";
import Deck from "./deck.js";
import getSocketName from "../utils/socket.js";
import Dealer from "./dealer.js";
import Player from "./player.js";

type RoomOptions = Readonly<{
  maxPlayers: number;
  initialBalance: number;
  minBet: number;
  maxBet: number;
  decks: number;
}>;

export default class Room {
  name: string;
  decks: Deck[];
  players: Map<string, Player> = new Map();
  gameOn: boolean = false;
  currDeck: Deck;
  dealer: Dealer;

  currPlayer: Player | null = null;

  private howManyPlayersBet: number = 0;

  readonly options: RoomOptions = {
    maxPlayers: 5,
    initialBalance: 1000,
    minBet: 10,
    maxBet: 500,
    decks: 3,
  };

  constructor(name: string, options?: RoomOptions) {
    if (options) this.options = options;

    this.name = name;
    this.decks = this.generateDecks();
    this.currDeck = this.decks[0];
    this.dealer = new Dealer();
  }

  startGame() {
    if (this.gameOn) return;

    this.gameOn = true;
    for (const player of this.players.values())
      player.hand.addCards(...this.drawCards(2));
    this.dealer.hand.addCards(...this.drawCards(2));
    [this.currPlayer] = this.players.values();
  }

  endGame() {
    if (!this.gameOn) return;

    while (this.dealer.hand.score < 17)
      this.dealer.hand.addCards(...this.drawCards(1));

    const dealerScore = this.dealer.hand.score;
    console.log(dealerScore);

    for (const player of this.players.values()) {
      const canReceiveMoney = player.hands.some(({ score }) => score <= 21);
      let multiplier = 1.5;

      if (canReceiveMoney && player.strategy !== "surrender") {
        switch (player.strategy) {
          case "insurance":
            if (dealerScore === 21) {
              player.ballance += player.insuranceBet * 2;
              player.bet -= player.insuranceBet;
            }
            break;
          case "double-down":
            multiplier = 3;
            break;
          case "split-pairs":
            player.bet /= 2;
            break;
        }

        player.hands.forEach((hand) => {
          if (hand.score > 21) return;
          if (hand.score === dealerScore) player.ballance += player.bet;
          else if (hand.score > dealerScore || dealerScore > 21)
            player.ballance += player.bet * multiplier;
        });
      }

      player.reset();
    }

    this.gameOn = false;
    this.currPlayer = null;
    this.howManyPlayersBet = 0;
    this.currDeck.shuffle();
    this.dealer.hand.clearCards();

    console.log("Round Ended");
  }

  addPlayer(socket: Socket) {
    const name = getSocketName(socket);

    if (this.players.size === this.options.maxPlayers)
      throw new RangeError(`Room ${name} is full`);
    if (this.players.has(name))
      throw new Error(
        `Room ${this.name} already has a player with the name ${name}`,
      );

    const player = new Player(name, this.options.initialBalance);
    this.players.set(player.name, player);

    return player;
  }

  nextPlayer() {
    if (!this.currPlayer) return;

    if (this.currPlayer.strategy === "split-pairs") {
      const nextHand = this.currPlayer.nextHand();
      if (nextHand !== null) return;
    }

    let shouldChange = false;
    for (const [key, player] of this.players.entries()) {
      if (player.bet === 0 || player.hand.hasNatural()) continue;
      if (key === this.currPlayer.name) {
        shouldChange = true;
        continue;
      }
      if (shouldChange) {
        this.currPlayer = player;
        return;
      }
    }

    this.endGame();
  }

  placeBet(value: number, socket: Socket) {
    const name = getSocketName(socket);
    const player = this.players.get(name);

    if (!player)
      throw new Error(`Could not find player ${name} in room ${this.name}`);
    if (this.gameOn) throw new Error("Game has already started");
    if (player.ballance < value)
      throw new RangeError(
        `Insufficent funds to place a bet of: ${value}. (Balance: ${player.ballance})`,
      );
    if (player.bet !== 0) throw new Error(`You have already placed a bet`);

    player.bet = value;
    player.ballance -= value;
    this.howManyPlayersBet++;

    if (this.howManyPlayersBet === this.players.size) {
      this.startGame();
    }
  }

  hitPlayer(socket: Socket) {
    this.validateCurrentPlayer(socket);

    this.currPlayer.hand.addCards(...this.drawCards(1));
    if (this.currPlayer.hand.score >= 21) this.nextPlayer();
  }

  standPlayer(socket: Socket) {
    this.validateCurrentPlayer(socket);

    this.nextPlayer();
  }

  doubleDown(socket: Socket) {
    this.validateCurrentPlayer(socket);

    this.currPlayer.playStrategy("double-down");
    this.currPlayer.hand.addCards(...this.drawCards(1));

    this.nextPlayer();
  }

  placeInsurance(socket: Socket) {
    this.validateCurrentPlayer(socket);
    if (this.dealer.faceupCard().value !== "A")
      throw new Error(
        "You can't place inssurance. Dealer doesen't have an Ace",
      );

    this.currPlayer.playStrategy("insurance");
    this.nextPlayer();
  }

  surrender(socket: Socket) {
    this.validateCurrentPlayer(socket);

    this.currPlayer.playStrategy("surrender");
    this.nextPlayer();
  }

  splitPairs(socket: Socket) {
    this.validateCurrentPlayer(socket);
    this.currPlayer.playStrategy("split-pairs");

    this.currPlayer.hands.forEach((hand) =>
      hand.addCards(...this.drawCards(1)),
    );
  }

  drawCards(ammount: number) {
    const cards = this.currDeck.draw(ammount);
    if (cards.length < ammount) {
      this.decks.shift();
      if (this.decks.length === 0) this.decks = this.generateDecks();
      this.currDeck = this.decks[0];
      cards.push(...this.currDeck.draw(ammount - cards.length));
    }
    return cards;
  }

  private generateDecks() {
    return new Array(this.options.decks).fill(null).map(() => new Deck());
  }

  private validateCurrentPlayer(
    socket: Socket,
  ): asserts this is { currPlayer: Player } {
    const name = getSocketName(socket);
    if (!this.gameOn) throw new Error("Game has not started");
    if (!this.currPlayer) throw new Error("Game has not started");
    if (!this.players.has(name))
      throw new Error(`Player ${name} was not found in this room`);
    if (this.currPlayer.name !== name)
      throw new Error(`It's not ${name}'s turn yet`);
  }
}
