import { Server } from "socket.io";
import redis from "./redis.js";

const SUITS = ["clubs", "spades", "diamonds", "hearts"] as const;
type Suit = typeof SUITS;
type Card = {
  value: number;
  suit: Suit;
};

type Player = {
  wallet: number;
  bet: number;
  cards: Card[];
  id: string;
};

type Game = {
  deck: Card[];
  dealerCards: Card[];
  players: Player[];
};

function generateDeck() {
  const DECK_LENGTH = 52;
  const CARDS_PER_SUIT = 13;

  const out = new Array(DECK_LENGTH).fill(undefined).map((_, index) => ({
    value: (index % CARDS_PER_SUIT) + 1, // make the value wrap between 1 and 13 based on the index
    type: SUITS[index % SUITS.length], // set the type based on the current index
  }));

  // shuffle the deck
  out.sort((_a, _b) => Math.random() - 0.5);

  return out;
}

async function updateGame(gameId: string, callback: (gameName: Game) => void) {
  let gameString = await redis.get(gameId);
  if (gameString === null) return;

  let game = JSON.parse(gameString) as Game;
  callback(game);
  await redis.set(gameId, JSON.stringify(game));
}

async function updatePlayer(
  gameId: string,
  playerId: string,
  callback: (player: Player, game: Game) => void,
) {
  await updateGame(gameId, async (game) => {
    const player = game.players.find((player) => player.id === playerId);
    if (!player) return;

    callback(player, game);
  });
}

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  socket.on("create-room", async (name) => {
    const exists = await redis.exists(name);
    if (exists) {
      socket.emit("error", `Room: ${name} already exists`);
      return;
    }

    const deck = generateDeck();
    const dealerCards = deck.splice(-2, 2);
    const game = {
      deck,
      dealerCards,
      players: [{ wallet: 1000, bet: 0, cards: [], id: socket.id }],
    };
    await redis.set(name, JSON.stringify(game));

    socket.join(name);
    socket.emit("receive-dealer-card", dealerCards);
    socket.emit("room-joined", name);
  });

  socket.on("join-room", async (gameId) => {
    let game = await redis.get(gameId);
    if (game === null) {
      socket.emit("error", `Was not able to find room ${gameId}`);
      return;
    }

    let dealerCards: Card[] = [];
    await updateGame(gameId, (game) => {
      dealerCards = game.dealerCards;
      game.players.push({ wallet: 1000, bet: 0, cards: [], id: socket.id });
    });

    socket.join(gameId);
    socket.emit("receive-dealer-card", dealerCards);
    socket.emit("room-joined", gameId);
  });

  socket.on("bet", async (value) => {
    let gameId = null;
    socket.rooms.forEach((i) => {
      if (i !== socket.id) gameId = i;
    });
    if (gameId === null) return;

    const betValue = Number(value);
    if (isNaN(betValue)) {
      socket.emit("error", "Please enter a valid bet!");
      return;
    }

    let playerCards: Card[] = [];
    await updatePlayer(gameId, socket.id, (player, game) => {
      if (betValue >= player.wallet) {
        socket.emit("error", `You don't have enough money to bet $${betValue}`);
        return;
      }

      playerCards = game.deck.splice(-2, 2);
      player.wallet -= betValue;
      player.bet = betValue;
      player.cards = playerCards;
    });
    socket.emit("receive-cards", [...playerCards]);
  });

  socket.on("hit", async () => {
    let gameId = null;
    socket.rooms.forEach((i) => {
      if (i !== socket.id) gameId = i;
    });
    if (gameId === null) return;

    let score = 0;
    let card = null;
    await updatePlayer(gameId, socket.id, (player, game) => {
      card = game.deck.pop();
      if (!card) return;
      player.cards.push(card);

      score = player.cards.reduce((acc, card) => acc + card.value, 0);
    });

    io.to(socket.id).emit("receive-cards", [card]);
    if (score > 21) io.to(socket.id).emit("lost", score);
    else if (score === 21) io.to(socket.id).emit("won");
  });
});
