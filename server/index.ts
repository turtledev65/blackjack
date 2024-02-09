import { Server, Socket } from "socket.io";
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
  currPlayerIndex: number;
};

function getGameId(socket: Socket) {
  for (const room of socket.rooms) {
    if (socket.id !== room) return room;
  }

  return null;
}

async function getGame(gameId: string) {
  let game = await redis.get(gameId);
  if (!game) return null;

  try {
    const out = JSON.parse(game) as Game;
    return out;
  } catch {
    return null;
  }
}

async function updateGame(
  gameId: string,
  callback: (gameName: Game) => void,
  onError?: (msg: string) => void,
) {
  const game = await getGame(gameId);
  if (!game) {
    onError?.call(null, `Could not find game ${gameId}`);
    return;
  }

  callback(game);
  await redis.set(gameId, JSON.stringify(game));
}

async function updatePlayer(
  gameId: string,
  playerId: string,
  callback: (player: Player, game: Game) => void,
  onError?: (msg: string) => void,
) {
  await updateGame(
    gameId,
    async (game) => {
      const player = game.players.find((player) => player.id === playerId);
      if (!player) {
        onError?.call(null, `Could not find player ${playerId}`);
        return;
      }

      callback(player, game);
    },
    onError,
  );
}

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
    const game = {
      deck,
      dealerCards: [],
      players: [{ wallet: 1000, bet: 0, cards: [], id: socket.id }],
    };
    await redis.set(name, JSON.stringify(game));

    socket.join(name);
    socket.emit("room-joined", name);
  });

  socket.on("join-room", async (gameId) => {
    const gameExists = await redis.exists(gameId);
    if (!gameExists) {
      socket.emit("error", `Was not able to find room ${gameId}`);
      return;
    }

    const newPlayer = {
      wallet: 1000,
      bet: 0,
      cards: [],
      id: socket.id,
    };
    await updateGame(gameId, (game) => {
      game.players.push(newPlayer);
    });

    socket.join(gameId);
    socket.emit("room-joined", gameId);
    socket.broadcast.emit("receive-new-player", newPlayer);
  });

  socket.on(
    "get-other-players",
    async (callback: (otherPlayers: Player[]) => void) => {
      const gameId = getGameId(socket);
      if (!gameId) return;

      const game = await getGame(gameId);
      if (!game) return;

      const otherPlayers = game.players.filter(
        (player) => player.id !== socket.id,
      );
      callback(otherPlayers);
    },
  );

  socket.on("bet", async (value) => {
    const gameId = getGameId(socket);
    if (!gameId) return;

    const betValue = Number(value);
    if (isNaN(betValue)) {
      socket.emit("error", "Please enter a valid bet!");
      return;
    }

    await updatePlayer(gameId, socket.id, (player, game) => {
      if (betValue >= player.wallet) {
        socket.emit("error", `You don't have enough money to bet $${betValue}`);
        return;
      }

      player.wallet -= betValue;
      player.bet = betValue;

      if (game.players.every((player) => player.bet !== 0)) {
        game.players.forEach((player) => {
          player.cards = game.deck.splice(-2, 2);
          io.to(player.id).emit("receive-cards", player.cards);
          io.except(player.id).emit("receive-updated-player", player);
        });
        io.emit("receive-dealer-card", game.deck.pop());

        game.currPlayerIndex = 0;

        const currPlayer = game.players[game.currPlayerIndex];
        io.to(currPlayer.id).emit("pick-action");
      }
    });
  });

  socket.on("hit", async () => {
    const gameId = getGameId(socket);
    if (!gameId) return;

    let score = 0;
    let card = null;
    await updatePlayer(gameId, socket.id, (player, game) => {
      const currPlayer = game.players[game.currPlayerIndex];
      if (currPlayer.id !== player.id) {
        socket.emit("error", "It's not your turn");
        return;
      }

      card = game.deck.pop();
      if (!card) return;
      player.cards.push(card);

      score = player.cards.reduce(
        (acc, card) => acc + Math.min(card.value, 10),
        0,
      );

      socket.broadcast.emit("receive-updated-player", player);

      if (score < 21) {
        socket.emit("pick-action");
        return;
      }

      game.currPlayerIndex++;
      if (game.currPlayerIndex >= game.players.length) {
        game.currPlayerIndex = 0;

        io.emit("pick-bet");
        return;
      }
      socket.emit("end-turn");
      const newPlayer = game.players[game.currPlayerIndex];
      io.to(newPlayer.id).emit("pick-action");
    });

    if (card) io.to(socket.id).emit("receive-cards", [card]);
    if (score > 21) io.to(socket.id).emit("lost", score);
    else if (score === 21) io.to(socket.id).emit("won");
  });

  socket.on("stand", async () => {
    const gameId = getGameId(socket);
    if (!gameId) return;

    await updatePlayer(gameId, socket.id, (player, game) => {
      const currPlayer = game.players[game.currPlayerIndex];
      if (currPlayer.id !== player.id) {
        socket.emit("error", "It's not your turn");
        return;
      }

      game.currPlayerIndex++;
      if (game.currPlayerIndex >= game.players.length) {
        game.currPlayerIndex = 0;
        io.emit("pick-bet");
        return;
      }
      const newPlayer = game.players[game.currPlayerIndex];
      io.to(newPlayer.id).emit("pick-action");

      socket.emit("end-turn");
    });
  });

  socket.on("disconnecting", async () => {
    console.log(socket.id, "disconnected");
    const gameId = getGameId(socket);
    if (!gameId) return;

    await updateGame(gameId, (game) => {
      game.players = game.players.filter((player) => player.id !== socket.id);
    });
  });
});
