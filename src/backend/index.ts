import { Server, Socket } from "socket.io";
import Room from "./game/room";
import { getSocketName } from "../utils/socket";

const io = new Server(3000, {
  cors: {
    origin: "*"
  }
});

function handlePlayerAction(socket: Socket, currentRoom: Room) {
  if (!currentRoom) return;
  io.to(currentRoom.name).emit(
    "update-players",
    currentRoom.toSimplifiedObject().players
  );

  if (currentRoom.currPlayer) {
    if (currentRoom.currPlayer.name !== getSocketName(socket)) {
      socket.emit("pick-action", []);
    }

    io.to(currentRoom.currPlayer.name).emit(
      "pick-action",
      currentRoom.getPossibleActions(currentRoom.currPlayer)
    );
  } else {
    socket.emit("pick-action", ["bet"]);
  }
}

const rooms = new Map<string, Room>();
io.on("connection", socket => {
  let currentRoom: Room | null = null;

  function handleError(err: unknown) {
    console.log("err");
    if (err instanceof Error) {
      console.info("err", err);
      socket.emit("err", err.message);
    } else {
      console.info(err);
      socket.emit("err", "An unexpected err occured");
    }
  }

  socket.on("room-exists", (name: string, cb) => {
    if (rooms.has(name)) cb(true);
    else cb(false);
  });

  socket.on("create-room", (name: string, cb) => {
    if (rooms.has(name)) {
      handleError(`Room ${name} already exists`);
      return;
    }

    currentRoom = new Room(name);
    rooms.set(currentRoom.name, currentRoom);

    currentRoom.addPlayer(socket);
    socket.join(currentRoom.name);
    socket.emit("pick-action", ["bet"]);

    cb(currentRoom.toSimplifiedObject().players);
  });

  socket.on("join-room", (name, cb) => {
    const room = rooms.get(name);
    if (!room) {
      handleError(`Could not find room ${name}`);
      return;
    }

    try {
      const player = room.addPlayer(socket);
      currentRoom = room;

      cb(currentRoom.toSimplifiedObject().players);
      socket.join(currentRoom.name);
      socket.broadcast
        .to(room.name)
        .emit("player-joined", player.toSimplifiedObject());

      if (!currentRoom.gameOn) socket.emit("pick-action", ["bet"]);
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("bet", value => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    value = Number(value);
    if (isNaN(value)) {
      socket.emit("err", `Please enter a valid value`);
      handleError("Please enter a valid value");
      return;
    }

    try {
      currentRoom.placeBet(value, socket);

      socket.emit("pick-action", []);
      if (currentRoom.gameOn) {
        io.to(currentRoom.name).emit(
          "receive-dealer",
          currentRoom.toSimplifiedObject().dealer
        );
        io.to(currentRoom.currPlayer!.name).emit(
          "pick-action",
          currentRoom.getPossibleActions(socket)
        );
      }
      io.to(currentRoom.name).emit(
        "update-players",
        currentRoom.toSimplifiedObject().players
      );
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("hit", () => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    try {
      currentRoom.hitPlayer(socket);
      handlePlayerAction(socket, currentRoom);
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("stand", () => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    try {
      currentRoom.standPlayer(socket);
      handlePlayerAction(socket, currentRoom);
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("double-down", () => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    try {
      currentRoom.doubleDown(socket);
      handlePlayerAction(socket, currentRoom);
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("insurance", () => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    try {
      currentRoom.placeInsurance(socket);
      handlePlayerAction(socket, currentRoom);
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("surrender", () => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    try {
      currentRoom.surrender(socket);
      handlePlayerAction(socket, currentRoom);
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("split-pairs", () => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    try {
      currentRoom.splitPairs(socket);
      handlePlayerAction(socket, currentRoom);
    } catch (err) {
      handleError(err);
    }
  });

  socket.onAny(() => {
    console.log("All Rooms", rooms);
    console.log("Current Room", currentRoom);
  });
});
