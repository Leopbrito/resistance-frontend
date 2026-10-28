# resistance-frontend

Frontend do jogo **The Resistance** (jogo social de dedução, estilo Avalon), pensado para celular. Fala em tempo real com o backend NestJS (`../resistance-backend`) por Socket.IO.

## Stack

React 18 · TypeScript (strict) · Vite 6 · Tailwind CSS v4 · React Router 7 (data router) · Socket.IO client · i18next (en, pt-BR) · motion · Vitest · ESLint + Prettier.

## Comandos

```bash
npm run dev           # servidor de desenvolvimento (espera o backend em http://localhost:3000)
npm run build         # build de produção em dist/
npm test              # vitest run
npm run typecheck     # tsc --noEmit
npm run lint          # eslint . (hoje: 0 erros e 0 avisos)
npm run format        # prettier --write .
npm run format:check  # prettier --check .
```

Antes de dar uma tarefa por concluída, rode `typecheck`, `lint`, `format:check`, `test` e `build`. O lint está zerado e deve continuar assim.

## Mapa do código

```
src/
  main.tsx              entrada; importa i18n e styles/index.css
  app/
    App.tsx             estado do jogo + listeners globais do socket; app-context.ts tem o AppContext
    routes.ts           rotas; telas do jogo são lazy
    web-socket.ts       instância do socket, sessão (playerId), erros
    screens/            uma tela por rota
    components/         componentes de jogo (GlowButton, StatusMessage, LogoutButton, TextField…); ui/ só tem dialog.tsx e utils.ts
    services/           game-route.ts (rota a partir do estado), round-view.ts (condições de votação), navigation-service.ts
    enums/ interfaces/  contrato com o backend (eventos, fases, tipos)
    hooks/              useWakeLock, useCurrentRound
    i18n/               index.ts + locales/en.json e pt-BR.json
  styles/               theme.css (tokens), tailwind.css, fonts.css
```

## Leia antes de mexer

- Arquitetura e fluxo de estado: `docs/ia/ARCHITECTURE.md`
- Convenções (código, estilo, i18n, git): `docs/ia/conventions/`
- Skill para criar uma tela nova: `.agents/skills/add-game-screen/SKILL.md`

## Regras que não podem ser esquecidas

1. **O servidor é a fonte da verdade.** O cliente recebe o `GameState` inteiro e renderiza; não duplique regra de jogo nem estado derivado no cliente.
2. **Todo texto visível passa pelo i18n.** Qualquer chave nova entra em `en.json` e `pt-BR.json` (o teste de locales falha se faltar uma).
3. **Cores e fontes vêm dos tokens do tema** (`text-resistance`, `bg-surface`, `font-display`), nunca de hex fixo.
4. **Telas do jogo ficam atrás de `withGameRoute`** e são carregadas com `lazy` em `routes.ts`.
5. **Use os enums** (`SocketEvent`, `GamePhase`, `Role`…) em vez de strings literais.
6. Não faça commit nem push sem o usuário pedir. Mostre o diff e a mensagem proposta antes.

## Fluxo de trabalho

- Trabalho vem de issues do GitHub (`Leopbrito/resistance-frontend`, em português). Commits seguem Conventional Commits em inglês (`feat:`, `fix:`, `refactor:`, `chore:`, `perf:`, `style:`) e referenciam `Closes #N`.
- Push em `release/**` dispara o build da imagem Docker (`.github/workflows/build-image.yml`), versionada pelo `version` do `package.json`. O workflow ainda não roda typecheck, lint nem testes.
- O `Closes #N` só fecha a issue quando o commit chega à branch padrão; em outras branches feche a issue manualmente.

## Skills do projeto

As skills ficam em `.agents/skills/<nome>/` (fonte única). Para o Claude Code enxergá-las, cada uma tem um symlink em `.claude/skills/<nome>` apontando para lá. Ao criar uma skill nova:

```bash
ln -s ../../.agents/skills/<nome> .claude/skills/<nome>
```
