import { Server } from "socket.io";
import redis from "./redis.js";

function generateDeck(containsJockers = false) {
  const DECK_LENGTH = 52;
  const CARDS_PER_SUIT = 13;
  const types = ["clubs", "spades", "diamonds", "hearts"];

  const out = new Array(DECK_LENGTH).fill().map((_, index) => ({
    value: (index % CARDS_PER_SUIT) + 1, // make the value wrap between 1 and 13 based on the index
    type: types[index % types.length], // set the type based on the current index
  }));
  if (containsJockers)
    out.push({ value: 5, type: "jocker" }, { value: 10, type: "jocker" });

  // shuffle the deck
  out.sort((_a, _b) => Math.random() - 0.5);

  return out;
}

async function updateGame(gameId, callback) {
  let game = await redis.get(gameId);
  if (game === null) return;

  game = JSON.parse(game);
  callback(game);
  await redis.set(gameId, JSON.stringify(game));
}

async function updatePlayer(gameId, playerId, callback) {
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
      console.error(`Room ${name} already exists`);
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
  });

  socket.on("join-room", async (gameId) => {
    let game = await redis.get(gameId);
    if (game === null) {
      console.error(`Room ${gameId} doesen't exists`);
      return;
    }

    let dealerCards = [];
    await updateGame(gameId, (game) => {
      dealerCards = game.dealerCards;
      game.players.push({ wallet: 1000, bet: 0, cards: [], id: socket.id });
    });

    socket.join(gameId);
    socket.emit("receive-dealer-card", dealerCards);
  });

  socket.on("bet", async (value) => {
    let gameId = null;
    socket.rooms.forEach((i) => {
      if (i !== socket.id) gameId = i;
    });
    if (gameId === null) return;

    const betValue = Number(value);
    if (isNaN(betValue)) return;

    let playerCards = [];
    await updatePlayer(gameId, socket.id, (player, game) => {
      if (betValue <= player.wallet) {
        playerCards = game.deck.splice(-2, 2);
        player.wallet -= betValue;
        player.bet = betValue;
        player.cards = playerCards;
      }
    });
    socket.emit("receive-card", playerCards);
  });

  socket.on("hit", async () => {
    let gameId = null;
    socket.rooms.forEach((i) => {
      if (i !== socket.id) gameId = i;
    });

    let score = 0;
    let card = null;
    await updatePlayer(gameId, socket.id, (player, game) => {
      card = game.deck.pop();
      player.cards.push(card);

      score = player.cards.reduce((acc, card) => acc + card.value, 0);
    });

    io.to(socket.id).emit("receive-card", card);
    if (score > 21) io.to(socket.id).emit("lost", score);
    else if (score === 21) io.to(socket.id).emit("won");
  });
});
