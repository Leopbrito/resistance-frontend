import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { SocketEvent } from "./enums/enums";
import { ClientToServerEvents, ServerToClientEvents } from "./interfaces/interfaces";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("wss://api-resistance.leopbrito.com/", {
  transports: ['websocket']
});

socket.on(SocketEvent.ERROR, (error: { message: string; } | string) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  toast.error(errorMessage || "Unknown error occurred", {
    duration: 4000,
  });
});
