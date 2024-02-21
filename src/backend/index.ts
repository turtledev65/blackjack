import { Server } from "socket.io";
import Room from "./game/room";

const io = new Server(3000, {
  cors: {
    origin: "*"
  }
});

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

      if (currentRoom.gameOn) {
        io.to(currentRoom.name).emit(
          "receive-dealer",
          currentRoom.toSimplifiedObject().dealer
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
      io.to(currentRoom.name).emit(
        "update-players",
        currentRoom.toSimplifiedObject().players
      );
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
      io.to(currentRoom.name).emit(
        "update-players",
        currentRoom.toSimplifiedObject().players
      );
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
      io.to(currentRoom.name).emit(
        "update-players",
        currentRoom.toSimplifiedObject().players
      );
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
      io.to(currentRoom.name).emit(
        "update-players",
        currentRoom.toSimplifiedObject().players
      );
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
      io.to(currentRoom.name).emit(
        "update-players",
        currentRoom.toSimplifiedObject().players
      );
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
      io.to(currentRoom.name).emit(
        "update-players",
        currentRoom.toSimplifiedObject().players
      );
    } catch (err) {
      handleError(err);
    }
  });

  socket.onAny(() => {
    console.log("All Rooms", rooms);
    console.log("Current Room", currentRoom);
  });
});
