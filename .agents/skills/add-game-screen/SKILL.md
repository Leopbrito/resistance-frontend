---
name: add-game-screen
description: Cria uma tela nova do jogo no resistance-frontend (componente em screens/, rota lazy atrás de withGameRoute, textos nos dois idiomas, tema e retomada após refresh). Use quando a tarefa pedir uma nova tela, rota ou etapa do fluxo da partida.
---

# Adicionar uma tela do jogo

Siga a ordem. Cada passo cita o arquivo a mexer. Contexto em `docs/ia/ARCHITECTURE.md` e `docs/ia/conventions/`.

## 1. Entenda o que a tela precisa

- Que fase do jogo (`GamePhase`) ou evento do servidor a abre?
- Que dados de `gameState` ela lê? Que eventos (`SocketEvent`) ela emite?
- O jogador precisa "ver uma vez" (como RoleReveal, MissionResult, GameEnd)? Se sim, o servidor precisa de uma flag nova (`rolesSeen`-like) e de um `AckScreen`; isso é mudança **no backend também**. Confirme com o usuário antes de seguir.

Se faltar evento ou campo no contrato, pare e diga o que o backend precisa expor.

## 2. Crie o componente

`src/app/screens/<Nome>Screen.tsx`, com **export nomeado** (o `lazy` depende disso). Modelo mínimo:

```tsx
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../App";

export function ExampleScreen() {
  const { t } = useTranslation();
  const { gameState } = useContext(AppContext);

  return (
    <div className="relative min-h-screen bg-canvas overflow-hidden px-6 py-8">
      <h1 className="font-display text-2xl text-white tracking-wider">{t("example.title")}</h1>
    </div>
  );
}
```

- Estado do jogo vem do contexto; não copie para `useState`.
- Emissões: `socket.emit(SocketEvent.X, …)` com o enum, importando `socket` de `../web-socket`.
- Listener de socket no `useEffect` devolve o `socket.off`.
- Sem hex, sem `font-['…']`: use os tokens (`bg-surface`, `text-resistance`, `font-body`…). Veja `docs/ia/conventions/styling.md`.
- Reaproveite `GlowButton`, `GlitchText`, `PlayerList`, `MissionTracker`, `ParticleBackground` antes de criar algo novo.

## 3. Registre a rota

Em `src/app/routes.ts`, dentro dos `children` de `/`, acrescente no mesmo formato das outras telas do jogo:

```ts
{
  path: "example",
  lazy: async () => {
    const { ExampleScreen } = await import("./screens/ExampleScreen");
    return { Component: withGameRoute(ExampleScreen) };
  },
  ErrorBoundary: ErrorRedirect,
},
```

Telas fora do jogo (sem estado hidratado, como `/join`) ficam como `Component:` estático, sem `withGameRoute`.

## 4. Retomada após refresh

Em `src/app/services/game-route.ts`:

- Acrescente o path em `RESUMABLE_ROUTES` se o jogador puder estar nela quando a reconexão chegar.
- Se a tela corresponder a um estado do jogo, ensine `getRouteForState` a devolvê-la (mantendo a ordem de prioridade dos `if`s existentes).
- Se um evento do servidor abre a tela (como `revealRoles`), registre o listener em `App.tsx` chamando `navigate("/example")` do `navigation-service`.

Se a tela entra no `DevNavigation` (só aparece em desenvolvimento), acrescente-a em `routes` desse arquivo.

## 5. Textos

Adicione as chaves em `src/app/i18n/locales/en.json` **e** `pt-BR.json`, agrupadas sob o nome da tela (`"example": { … }`). O teste `i18n.test.ts` valida chaves e placeholders. Nenhum texto fixo no JSX.

## 6. Teste o que for lógica

Função pura nova (em `services/`) ganha teste Vitest ao lado. Tela em si não tem teste hoje; descreva ao usuário o que olhar no navegador.

## 7. Verifique

```bash
npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
```

Todos devem passar, sem aviso de lint novo. Confira no build que a tela virou um chunk próprio (`dist/assets/<Nome>Screen-*.js`) e que não voltou o aviso de chunk grande.

## 8. Entrega

Resuma o que mudou e o que precisa ser visto no navegador. Não faça commit sem o usuário pedir; ao pedir, mostre o diff e a mensagem (Conventional Commits em inglês, `Closes #N`) antes.
