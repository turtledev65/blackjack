import { Server } from "socket.io";
import Room from "./game/room.js";

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

const rooms = new Map<string, Room>();
io.on("connection", (socket) => {
  let currentRoom: Room | null;

  socket.on("create-room", (name) => {
    if (rooms.has(name)) {
      socket.emit("err", `Room ${name} already exists`);
      return;
    }

    currentRoom = new Room(name);
    rooms.set(currentRoom.name, currentRoom);

    currentRoom.addPlayer(socket);
  });

  socket.on("join-room", (name) => {
    const room = rooms.get(name);
    if (!room) {
      socket.emit("err", `Room ${name} doesen't exist`);
      return;
    }

    try {
      room.addPlayer(socket);
      currentRoom = room;
    } catch (err) {
      if (err instanceof Error) socket.emit("err", err.message);
    }
  });

  socket.on("bet", (value) => {
    if (!currentRoom) {
      socket.emit("err", "You have not joined a room yet");
      return;
    }

    value = Number(value);
    if (isNaN(value)) {
      socket.emit("err", `Please enter a valid value`);
      return;
    }

    try {
      currentRoom.placeBet(value, socket);
    } catch (err) {
      if (err instanceof Error) socket.emit("err", err.message);
    }
  });

  socket.on("hit", () => {
    if (!currentRoom) {
      socket.emit("err", "You have not joined a room yet");
      return;
    }

    try {
      currentRoom.hitPlayer(socket);
    } catch (err) {
      if (err instanceof Error) socket.emit("err", err.message);
    }
  });

  socket.on("stand", () => {
    if (!currentRoom) {
      socket.emit("err", "You have not joined a room yet");
      return;
    }

    try {
      currentRoom.standPlayer(socket);
    } catch (err) {
      if (err instanceof Error) socket.emit("err", err.message);
    }
  });

  socket.on("double-down", () => {
    if (!currentRoom) {
      socket.emit("err", "You have not joined a room yet");
      return;
    }

    try {
      currentRoom.doubleDown(socket);
    } catch (err) {
      if (err instanceof Error) socket.emit("err", err.message);
    }
  });

  socket.on("insurance", () => {
    if (!currentRoom) {
      socket.emit("err", "You have not joined a room yet");
      return;
    }

    try {
      currentRoom.placeInsurance(socket);
    } catch (err) {
      if (err instanceof Error) socket.emit("err", err.message);
    }
  });

  socket.on("surrender", () => {
    if (!currentRoom) {
      socket.emit("err", "You have not joined a room yet");
      return;
    }

    try {
      currentRoom.surrender(socket);
    } catch (err) {
      if (err instanceof Error) socket.emit("err", err.message);
    }
  });

  socket.on("split-pairs", () => {
    if (!currentRoom) {
      socket.emit("err", "You have not joined a room yet");
      return;
    }

    try {
      currentRoom.splitPairs(socket);
    } catch (err) {
      if (err instanceof Error) socket.emit("err", err.message);
    }
  });

  socket.onAny(() => {
    console.log("Current Room", currentRoom);
  });
});
