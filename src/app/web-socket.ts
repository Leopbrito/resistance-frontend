  import { io } from "socket.io-client";

  export const socket = io("ws://api-resistance.leopbrito.com/", {
    transports: ['websocket'] 
  });