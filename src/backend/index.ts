import { Server } from "socket.io";
import Room from "./game/room";
import { ApiResponse } from "./types";

const io = new Server(3000, {
  cors: {
    origin: "*"
  }
});

console.log("backend started");

function callThrowableFunction<T>(
  callback: () => T,
  responseCallback: (res: ApiResponse<T | null>) => unknown
) {
  try {
    const res = callback();
    responseCallback({ value: res, err: null });
  } catch (err) {
    error(err, responseCallback);
  }
}

function error(err: unknown, cb: (res: ApiResponse<null>) => unknown) {
  if (err instanceof Error) cb({ value: null, err: err.message });
  else if (typeof err === "string") cb({ value: null, err });
}

const rooms = new Map<string, Room>();
io.on("connection", socket => {
  let currentRoom: Room | null;

  socket.on("create-room", (name: string, cb) => {
    if (rooms.has(name)) {
      error(`Room ${name} already exists`, cb);
      return;
    }

    currentRoom = new Room(name);
    rooms.set(currentRoom.name, currentRoom);

    currentRoom.addPlayer(socket);
    cb({ value: name });
  });

  socket.on("join-room", (name, cb) => {
    const room = rooms.get(name);
    if (!room) {
      error(`Could not find room ${name}`, cb);
      return;
    }

    callThrowableFunction(() => {
      room.addPlayer(socket);
      currentRoom = room;
      return room.name;
    }, cb);
  });

  socket.on("bet", (value, cb) => {
    if (!currentRoom) {
      error("You have not joined a room yet", cb);
      return;
    }

    value = Number(value);
    if (isNaN(value)) {
      socket.emit("err", `Please enter a valid value`);
      error("Please enter a valid value", cb);
      return;
    }

    callThrowableFunction(() => {
      currentRoom!.placeBet(value, socket);
    }, cb);
  });

  socket.on("hit", cb => {
    if (!currentRoom) {
      error("You have not joined a room yet", cb);
      return;
    }

    callThrowableFunction(() => {
      currentRoom!.hitPlayer(socket);
    }, cb);
  });

  socket.on("stand", cb => {
    if (!currentRoom) {
      error("You have not joined a room yet", cb);
      return;
    }

    callThrowableFunction(() => {
      currentRoom!.standPlayer(socket);
    }, cb);
  });

  socket.on("double-down", cb => {
    if (!currentRoom) {
      error("You have not joined a room yet", cb);
      return;
    }

    callThrowableFunction(() => {
      currentRoom!.doubleDown(socket);
    }, cb);
  });

  socket.on("insurance", cb => {
    if (!currentRoom) {
      error("You have not joined a room yet", cb);
      return;
    }

    callThrowableFunction(() => {
      currentRoom!.placeInsurance(socket);
    }, cb);
  });

  socket.on("surrender", cb => {
    if (!currentRoom) {
      error("You have not joined a room yet", cb);
      return;
    }

    callThrowableFunction(() => {
      currentRoom!.surrender(socket);
    }, cb);
  });

  socket.on("split-pairs", cb => {
    if (!currentRoom) {
      error("You have not joined a room yet", cb);
      return;
    }

    callThrowableFunction(() => {
      currentRoom!.splitPairs(socket);
    }, cb);
  });

  socket.onAny(() => {
    console.log("Current Room", currentRoom);
  });
});
