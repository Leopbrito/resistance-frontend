# Código

## TypeScript

- `strict`, `noUnusedLocals` e `noUnusedParameters` ligados. Parâmetro que precisa existir mas não é usado leva `_` (ex.: `forEach((_, index) => …)`).
- Evite `any` e `!` depois de `?.`. O lint avisa; não aumente o número de avisos.
- Use os enums de `src/app/enums/enums.ts` (`SocketEvent`, `GamePhase`, `Role`, `TeamVoteAction`, `MissionVoteAction`, `AckScreen`) em comparações e emissões. Não escreva `"SPY"` ou `"VOTING"` no código.
- Tipos compartilhados com o backend ficam em `src/app/interfaces/interfaces.ts`. Evento novo entra em `SocketEvent` **e** em `ServerToClientEvents`/`ClientToServerEvents`.
- Import sem extensão (`./app/App`, não `./app/App.tsx`). O alias `@` aponta para `src`, mas o código existente usa caminhos relativos; siga o arquivo em que estiver.

## React

- Componentes de função, **export nomeado** (`export function LobbyScreen`). O `lazy` das rotas depende disso; `ErrorRedirect` é a exceção histórica (default).
- Um componente por arquivo, em PascalCase, em `components/` (reutilizável) ou `screens/` (uma por rota).
- O estado do jogo vem de `useContext(AppContext)`. Estado local de tela (`useState`) é só de interface, como "mostrar papel" ou "modal aberto". Não copie `gameState` para `useState`.
- Listeners de socket dentro de `useEffect` sempre devolvem o `socket.off` correspondente.
- Efeitos com `setTimeout`/`setInterval` limpam o timer no retorno.
- Não deixe `console.log` no código (issue #11).

## Socket

- Toda instância de socket e toda função de sessão estão em `src/app/web-socket.ts`. Telas importam `socket`, `ackScreen`, `setPlayerId`, `startNewSession` daí.
- Para emitir: `socket.emit(SocketEvent.X, payload)`. Eventos com resposta usam callback tipado em `ClientToServerEvents`.
- Não navegue direto de dentro de um listener de socket global; use `navigate` de `services/navigation-service.ts`.
- Acesso a `localStorage`/`sessionStorage` sempre dentro de `try/catch` (modo privado e storage bloqueado lançam erro).

## Arquivos e pastas

- Não crie componentes genéricos "por via das dúvidas". `components/ui/` só tem o que é usado; se precisar de um componente shadcn novo, adicione-o e instale só as dependências dele.
- Lógica pura (sem React) vai em `services/` e deve ter teste em Vitest ao lado (`*.test.ts`).
- Comentários em **português**, curtos, explicando o porquê (não o quê).
- Prettier manda no formato (aspas duplas, largura 100). Rode `npm run format` em vez de ajustar à mão.
