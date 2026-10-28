# Git, issues e verificação

## Issues

- Repositório: `Leopbrito/resistance-frontend`. Issues em português, com label `bug`, `enhancement` ou `tech-debt`.
- Use `gh issue list/view -R Leopbrito/resistance-frontend` para consultar. Uma tarefa = uma issue; se o trabalho revelar algo fora do escopo, abra outra issue em vez de ampliar a mudança.

## Commits

- Conventional Commits em **inglês**: `feat:`, `fix:`, `refactor:`, `perf:`, `style:`, `chore:`; escopo opcional (`feat(i18n): …`).
- Assunto no imperativo, até ~70 caracteres; corpo em lista curta explicando o quê e por quê.
- Referencie a issue com `Closes #N` no corpo. Em branch que não é a padrão isso não fecha a issue; feche com `gh issue close`.
- Separe commits por assunto (ex.: configuração em um, correções e formatação em outro).
- **Não commite nem faça push sem o usuário pedir.** Quando pedir, mostre o diff e a mensagem proposta e espere o OK.

## Branches

- `release/**`: push dispara o build da imagem Docker. A versão sai do `package.json` (commit `chore: bump version to X.Y.Z`); o mesmo valor aparece no rodapé da tela inicial, então o bump já atualiza o que o usuário vê.
- Trabalho novo em `feature/*`. Confirme com o usuário antes de criar ou trocar de branch.

## Checklist antes de entregar

```bash
npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
```

- Sem erro de typecheck, sem erro de lint e sem aviso de lint novo.
- Mudou dependência? `package.json` e `package-lock.json` juntos, preferindo versão exata (sem `^`), como nas dependências antigas.
- Mudou CSS, tema ou rotas? Confira o `dist/` do build (tamanho dos chunks, sem aviso do Vite).
- Mudança visual não é verificada por typecheck nem testes: diga ao usuário o que precisa ser visto no navegador.
