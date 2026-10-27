import type { NavigateFunction } from "react-router";

let navigator: NavigateFunction | undefined;
// Evento de socket pode chegar antes do router montar: guarda o último destino e navega ao registrar
let pendingPath: string | undefined;

export const setNavigator = (nav: NavigateFunction | undefined) => {
  navigator = nav;

  if (navigator && pendingPath) {
    const path = pendingPath;
    pendingPath = undefined;
    navigator(path);
  }
};

export const navigate = (path: string) => {
  if (navigator) {
    navigator(path);
  } else {
    pendingPath = path;
  }
};
