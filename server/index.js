import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id, "connected");
  socket.on("draw", () => {
    socket.emit("receive-cards", { value: 10, type: "clubs" });
  });
});
