  import { io } from "socket.io-client";

  export const socket = io("wss://api-resistance.leopbrito.com/", {
    transports: ['websocket'] 
  });