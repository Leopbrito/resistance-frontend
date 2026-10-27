import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import i18n from "./i18n";
import { AckScreen, SocketEvent } from "./enums/enums";
import { navigate } from "./services/navigation-service";
import { ClientToServerEvents, ServerError, ServerToClientEvents } from "./interfaces/interfaces";

const API_URL = import.meta.env.PROD ? "wss://api-resistance.leopbrito.com/" : "http://localhost:3000";

const PLAYER_ID_KEY = "playerId";

// localStorage: sobrevive a fechar a aba. Pode lançar (modo privado, storage bloqueado)
export const getPlayerId = (): string | null => {
  try {
    return localStorage.getItem(PLAYER_ID_KEY);
  } catch {
    return null;
  }
};

export const setPlayerId = (playerId: string) => {
  try {
    localStorage.setItem(PLAYER_ID_KEY, playerId);
  } catch {
    // sem storage: a sessão só vale até o próximo refresh
  }
};

export const clearPlayerId = () => {
  try {
    localStorage.removeItem(PLAYER_ID_KEY);
  } catch {
    // nada a limpar
  }
};

// Aba que perdeu a sessão para outra não pode reconectar com o mesmo playerId e roubá-la de volta
let sessionDetached = false;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(API_URL, {
  transports: ['websocket'],
  // Função: reavaliada a cada (re)conexão, para reconexões automáticas usarem o playerId atual
  auth: (cb) => cb({ playerId: sessionDetached ? "" : getPlayerId() || "" }),
});

// Texto livre (servidor antigo) ou código desconhecido caem em errors.UNKNOWN
const translateServerError = (error: ServerError | string): string => {
  const code = typeof error === "string" ? undefined : error?.code;
  const key = `errors.${code}`;
  return code && i18n.exists(key)
    ? i18n.t(key, error && typeof error !== "string" ? error.params : undefined)
    : i18n.t("errors.UNKNOWN");
};

socket.on(SocketEvent.ERROR, (error: ServerError | string) => {
  toast.error(translateServerError(error), {
    duration: 4000,
  });
});

// Registra no servidor que o jogador viu a tela, para o refresh voltar ao ponto certo
export const ackScreen = (screen: AckScreen) => {
  socket.emit(SocketEvent.ACK_SCREEN, { screen });
};

// Chamado ao criar/entrar numa sala: reabre o socket se a sessão foi cedida a outra aba
export const startNewSession = () => {
  sessionDetached = false;
  if (!socket.connected) socket.connect();
};

socket.on(SocketEvent.SESSION_INVALID, () => {
  clearPlayerId();
  toast.error(i18n.t("session.expired"), { duration: 4000 });
  navigate("/");
});

socket.on(SocketEvent.SESSION_REPLACED, () => {
  sessionDetached = true;
  socket.disconnect();
  toast.error(i18n.t("session.replaced"), { duration: 4000 });
  navigate("/");
});
