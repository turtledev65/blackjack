import { io } from "socket.io-client";
import { Socket } from "socket.io";

export const socket = io("http://localhost:3000");

export function getSocketName(socket: Socket) {
  return socket.data.username ?? socket.id;
}
