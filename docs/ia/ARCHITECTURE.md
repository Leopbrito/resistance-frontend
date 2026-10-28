# Arquitetura

SPA em React que renderiza o estado de uma partida de The Resistance recebido do servidor por WebSocket. Não há API REST nem estado persistido no cliente além do `playerId` e do idioma.

## Visão geral

```
Browser (este repo)                         Backend (../resistance-backend)
┌──────────────────────────┐   Socket.IO    ┌──────────────────────────┐
│ App ─ AppContext         │◄──────────────►│ gateway ─ game/room/...  │
│  ├─ listeners globais    │  gameState...  │ regras do jogo + Redis   │
│  └─ RouterProvider       │                └──────────────────────────┘
│      └─ telas (lazy)     │
└──────────────────────────┘
```

- Em produção o socket conecta em `wss://api-resistance.leopbrito.com/`; em desenvolvimento, em `http://localhost:3000` (constante `API_URL` em `src/app/web-socket.ts`).
- O contrato de eventos vive em `src/app/enums/enums.ts` (`SocketEvent`) e `src/app/interfaces/interfaces.ts` (`ServerToClientEvents`, `ClientToServerEvents`, `GameState`). O backend tem os mesmos eventos; mudou um lado, mude o outro.

## Fluxo do estado

1. `web-socket.ts` cria o `socket` uma vez, com `auth` reavaliado a cada conexão: `{ playerId }` lido do `localStorage`.
2. `App.tsx` guarda `gameState` e `isHydrated` no `AppContext` (definido em `app-context.ts`) e escuta os eventos globais:
   - `gameStateUpdate`: substitui o `gameState` inteiro e marca `isHydrated`.
   - `reconnectGame`: igual ao anterior, e se a rota atual permite (`canResumeFrom`), navega para `getRouteForState(gameState)`.
   - `revealRoles` → `/role-reveal`; `openMissionResultScreen` → `/mission-result`.
3. As telas leem `gameState` do contexto e emitem eventos do cliente (`socket.emit(SocketEvent.X, …)`). Elas não mudam o estado localmente: esperam o próximo `gameStateUpdate`.

## Navegação

- `routes.ts` usa `createBrowserRouter`. `/` e `/join` são estáticas; `lobby`, `role-reveal`, `mission-voting`, `mission-result` e `game-end` usam `lazy` e `withGameRoute`.
- **`GameRoute`** segura a tela até `isHydrated`. Com `playerId` salvo, espera até 8 s o servidor responder; sem sessão, volta para `/` na hora. Também mantém a tela acesa durante o jogo (`useWakeLock`).
- **`getRouteForState`** (`services/game-route.ts`) deriva a rota certa do estado do servidor (fase da partida e flags do jogador `rolesSeen`, `pendingMissionResult`, `gameEndSeen`). É isso que faz um refresh voltar ao ponto certo.
- **`navigation-service.ts`** permite navegar de fora do React (listeners de socket). Se o evento chegar antes do router montar, guarda o destino e navega quando o `RootLayout` registra o `navigate`.
- Erros de render nas telas do jogo caem em `ErrorRedirect`, que volta para `/`.

## Sessão e reconexão

- `playerId` fica em `localStorage` (`getPlayerId`/`setPlayerId`/`clearPlayerId`, todos tolerantes a storage bloqueado).
- `startNewSession()` é chamado ao criar ou entrar numa sala; reabre o socket se a sessão foi cedida a outra aba.
- `sessionInvalid`: limpa o `playerId`, avisa e volta para `/`. `sessionReplaced`: outra aba assumiu; esta desconecta e não reconecta sozinha (`sessionDetached`).
- Telas que o jogador precisa "ver uma vez" (`RoleReveal`, `MissionResult`, `GameEnd`) chamam `ackScreen(AckScreen.X)` para o servidor registrar, e um refresh não repete a tela.

## Erros do servidor

O servidor manda `ServerError { code, params? }`. `web-socket.ts` traduz para `errors.<code>` (i18n) e mostra um toast. Código desconhecido ou texto livre cai em `errors.UNKNOWN`. Erro novo no backend exige a chave nos dois idiomas.

## Fases do jogo

`GamePhase`: `WAITING` (lobby) → `TEAM_SELECTION` → `VOTING` → `MISSION` → de volta a `TEAM_SELECTION` na próxima rodada, até `FINISHED`. São até 5 rodadas; 5 equipes recusadas seguidas dão vitória aos espiões. Telas por fase: Lobby, MissionVoting (seleção, votação e missão), MissionResult, GameEnd.

## Interface

- **Tema**: tokens em `src/styles/theme.css` (`@theme inline`) sobre as variáveis `--game-*`. Fontes `font-display` (Orbitron) e `font-body` (Inter). Visual escuro, neon, com `ParticleBackground` e `ScanlineOverlay`.
- **Componentes**: `components/` tem os componentes do jogo (`GlowButton`, `PlayerList`, `MissionTracker`…). `components/ui/` guarda só o `dialog.tsx` (Radix) e `utils.ts` (`cn`).
- **i18n**: `i18next` com detecção `localStorage` → `navigator`; `pt` cai em `pt-BR` e qualquer outro idioma em `en`. O `LanguageSwitcher` troca o idioma e `document.lang`/`title` acompanham.
- **Animação**: `motion/react` para transições e brilhos.

## Build e deploy

`npm run build` gera `dist/` (Vite com chunks separados `react`, `motion` e `socket`). O `Dockerfile` faz build com Node 20 e serve com Nginx (`nginx.conf`). Push em `release/**` publica `ghcr.io/<usuário>/resistance-frontend:<version>`.

## Pendências conhecidas (issues abertas)

URL da API fixa no código (#15), logout fora do router (#14), `console.log` em produção (#11), CI sem checks (#6), contratos compartilhados com o backend (#16). Consulte as issues antes de assumir que algo é intencional.
