import { Socket } from "socket.io";

export default function getSocketName(socket: Socket) {
  return socket.data.username ?? socket.id;
}
