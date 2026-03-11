import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { SocketEvent } from "./enums/enums";
import { ClientToServerEvents, ServerToClientEvents } from "./interfaces/interfaces";

const API_URL = import.meta.env.PROD ? "wss://api-resistance.leopbrito.com/" : "http://localhost:3000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(API_URL, {
  transports: ['websocket'],
  query: {
    playerId: sessionStorage.getItem("playerId") || "",
  }
});

socket.on(SocketEvent.ERROR, (error: { message: string; } | string) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  toast.error(errorMessage || "Unknown error occurred", {
    duration: 4000,
  });
});
