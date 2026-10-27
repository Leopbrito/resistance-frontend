import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { AckScreen, SocketEvent } from "./enums/enums";
import { ClientToServerEvents, ServerToClientEvents } from "./interfaces/interfaces";

const API_URL = import.meta.env.PROD ? "wss://api-resistance.leopbrito.com/" : "http://localhost:3000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(API_URL, {
  transports: ['websocket'],
  // Função: reavaliada a cada (re)conexão, para reconexões automáticas usarem o playerId atual
  auth: (cb) => cb({ playerId: sessionStorage.getItem("playerId") || "" }),
});

socket.on(SocketEvent.ERROR, (error: { message: string; } | string) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  toast.error(errorMessage || "Unknown error occurred", {
    duration: 4000,
  });
});

// Registra no servidor que o jogador viu a tela, para o refresh voltar ao ponto certo
export const ackScreen = (screen: AckScreen) => {
  socket.emit(SocketEvent.ACK_SCREEN, { screen });
};
