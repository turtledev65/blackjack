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
    const game = {
      deck,
      players: {
        [socket.id]: { wallet: 1000, cards: deck.splice(-2, 2) },
      },
    };
    const res = await redis.set(name, JSON.stringify(game));
    console.log(res);
  });

  socket.on("join-room", async (name) => {
    let game = await redis.get(name);
    if (game === null) {
      console.error(`Room ${name} doesen't exists`);
      return;
    }

    game = JSON.parse(game);
    game.players[socket.id] = { wallet: 1000, cards: game.deck.splice(-2, 2) };

    await redis.set(name, JSON.stringify(game));

    socket.join(name);
  });

  socket.on("hit", async () => {
    let gameId = null;
    socket.rooms.forEach((i) => {
      if (i !== socket.id) gameId = i;
    });
    if (!gameId) return;

    let game = await redis.get(gameId);
    game = JSON.parse(game);

    const player = game.players[socket.id];
    const card = game.deck.pop();
    if (!card) {
      io.emit("empty-deck");
      return;
    }
    player.cards.push(card);
    await redis.set(gameId, JSON.stringify(game));

    if (card) io.to(socket.id).emit("receive-card", card);

    const sum = player.cards.reduce((acc, card) => acc + card.value, 0);
    console.log(sum);
    if (sum > 21) io.to(socket.id).emit("bust", sum);
    else if (sum === 21) io.to(socket.id).emit("win");
  });
});
