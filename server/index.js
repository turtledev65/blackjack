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

    const stringifiedDeck = generateDeck().map((card) => JSON.stringify(card));
    const res = await redis.rPush(name, stringifiedDeck);
    console.log(res);
  });

  socket.on("join-room", async (name) => {
    const exists = await redis.exists(name);
    if (!exists) {
      console.error(`Room ${name} doesen't exists`);
      return;
    }

    socket.join(name);
  });

  socket.on("hit", async () => {
    let deckId = null;
    socket.rooms.forEach((i) => {
      if (i !== socket.id) deckId = i;
    });
    if (!deckId) return;

    const card = await redis.rPop(deckId);
    if (card !== null) io.to(socket.id).emit("receive-card", card);
    else io.emit("empty-deck");
  });

  socket.on("draw", () => {
    socket.emit("receive-cards", { value: 10, type: "clubs" });
  });
});
