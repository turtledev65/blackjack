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

    cb(Array.from(currentRoom.players.values()));
  });

  socket.on("join-room", (name, cb) => {
    const room = rooms.get(name);
    if (!room) {
      handleError(`Could not find room ${name}`);
      return;
    }

    try {
      room.addPlayer(socket);
      currentRoom = room;
      cb(Array.from(currentRoom.players.values()));
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
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("hit", cb => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    try {
      currentRoom.hitPlayer(socket);
      cb("test");
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("stand", cb => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    try {
      currentRoom.standPlayer(socket);
      cb("test");
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("double-down", cb => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    try {
      currentRoom.doubleDown(socket);
      cb("test");
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("insurance", cb => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    try {
      currentRoom.placeInsurance(socket);
      cb("test");
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("surrender", cb => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      cb();
      return;
    }

    try {
      currentRoom.surrender(socket);
      cb("test");
    } catch (err) {
      handleError(err);
    }
  });

  socket.on("split-pairs", cb => {
    if (!currentRoom) {
      handleError("You have not joined a room yet");
      return;
    }

    try {
      currentRoom.splitPairs(socket);
      cb("test");
    } catch (err) {
      handleError(err);
    }
  });

  socket.onAny(() => {
    console.log("All Rooms", rooms);
    console.log("Current Room", currentRoom);
  });
});
