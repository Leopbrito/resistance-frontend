# Estilo e tema

## Tokens

As cores e fontes do jogo são tokens em `src/styles/theme.css`: variáveis `--game-*` no `:root`, expostas ao Tailwind em `@theme inline`.

| Uso                 | Classe                                                                       |
| ------------------- | ---------------------------------------------------------------------------- |
| Fundo da página     | `bg-canvas`                                                                  |
| Cartões e painéis   | `bg-surface` (`hover:bg-surface-hover`)                                      |
| Resistência (ciano) | `text-resistance`, `border-resistance`, `bg-resistance` (+ `-dark`, `-deep`) |
| Espião (vermelho)   | `text-spy`, `border-spy`, `bg-spy` (+ `-dark`, `-deep`, `-light`)            |
| Texto/borda neutros | `text-neutral`, `text-neutral-light`, `border-neutral`                       |
| Líder/anfitrião     | `text-gold`                                                                  |
| Título e rótulos    | `font-display` (Orbitron)                                                    |
| Texto corrido       | `font-body` (Inter)                                                          |

Regras:

- **Nada de hex em classes nem em `style`**: `text-[#00D9FF]` está proibido; use `text-resistance`.
- Em `style={{}}`, gradientes e objetos JS use `var(--color-resistance)`. Para transparência use `color-mix(in srgb, var(--color-spy) 12.5%, transparent)` ou o modificador de opacidade (`bg-spy/10`).
- Cor nova do jogo: adicione `--game-<nome>` no `:root` e `--color-<nome>: var(--game-<nome>)` em `@theme inline`; depois use `text-<nome>`.
- Tailwind só gera a classe se o nome estiver escrito por inteiro no código. Nada de `` `text-${cor}` ``; mapeie para classes completas.

Dívida conhecida: sombras e brilhos ainda repetem `rgba(0,217,255,…)` e `rgba(220,20,60,…)` em valores arbitrários (`shadow-[0_0_15px_rgba(…)]`). Em código novo, prefira um token.

## Layout

- Mobile-first: as telas são `min-h-screen`, em coluna, com `px-6`. Teste em largura de celular.
- Fundo de tela: `bg-canvas` com `ParticleBackground` e `ScanlineOverlay` (este já vem do `RootLayout`).
- Botões do jogo usam `GlowButton` com `variant` `resistance`, `spy` ou `neutral`.

## Animação

- `motion` (`import { motion } from "motion/react"`) para entrada de elementos (`initial`/`animate`) e brilhos.
- Em props animadas (`animate`, `whileHover`), prefira valores numéricos ou cores literais; interpolar `var()` não é garantido.
- `Math.random()` no render gera aviso de lint (`react-hooks/purity`); em código novo, calcule em `useMemo`/`useState` inicializador.
