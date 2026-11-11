# analyst-sql — Agente Analista de Dados

Agente de IA (Text-to-SQL) que responde perguntas em português consultando um MySQL 8 com segurança.
Next.js 16 + React 19 + TypeScript + Tailwind 4. Projeto do programa Futures (Softplan).

> **AGENTS.md vale primeiro:** este Next.js tem mudanças incompatíveis com o que você conhece
> (ex.: `cacheComponents` ligado recusa `export const runtime`). Leia `node_modules/next/dist/docs/`
> antes de mexer em rotas, config ou cache.

## Fluxo

`pergunta → estrutura do banco → IA escreve o SQL → validador → MySQL (só leitura) →
(se errar, a mensagem volta para a IA, até 3 tentativas) → IA explica em português`

## Mapa do código

| Caminho | Função |
|---|---|
| `src/lib/agent/` | `agent.ts` (o ciclo; recebe `AgentDeps` para testar sem banco/IA), `prompts.ts`, `errors.ts` |
| `src/lib/sql/validator.ts` | Barreira de segurança: só SELECT, lista de tabelas, limite de linhas |
| `src/lib/db/` | `mysql.ts` (pool, `runQuery` em transação READ ONLY), `schema.ts`, `schema-cache.ts` |
| `src/lib/llm/client.ts` | Cliente da IA (Anthropic ou OpenAI-compatível/Gemini) |
| `src/lib/http/` | Rate limit, conferência da requisição, erro → status HTTP |
| `src/lib/ui/`, `src/hooks/` | Lógica da tela que não é desenho (friendly, chart, sql-highlight, ask-client) |
| `src/app/api/` | `POST /api/ask` e `GET /api/schema` |
| `src/components/` | A tela (`Greeting`, `Turn`, `Composer`, `ResultPanel` `QuickActions` (Perguntas prontas e Ajuda, sob o campo de pergunta) e `Header` (Dados e Sobre); os quatro painéis usam `HeaderPanel`) |
| `src/scripts/`, `eval/` | `evaluate.ts` + `questions.json` (taxa de acerto), `check-llm.ts` |
| `db/setup.sql`, `compose.yaml` | Banco de exemplo e usuário `agent_readonly` |

## Comandos

```bash
npm run db:up        # sobe o MySQL (Docker Desktop aberto)
npm run dev          # http://localhost:3000
npm test             # testes (sem banco, IA ou rede)
npm run typecheck && npm run lint && npm run build
npm run check:llm    # confere a chave/modelo da IA
npm run evaluate     # taxa de acerto real (gasta chamadas da IA)
```

## Regras

- **Mantenha simples.** O projeto é "arroz com feijão bem feito": código direto, fácil de ler e de aprender. Prefira uma
  função clara a várias camadas. Só separe quando houver repetição de verdade. Cada arquivo abre com um comentário curto.
- **Segurança é em camadas; nunca remova uma por existir outra** (instruções, validador, usuário read-only, transação
  READ ONLY + limites). Veja `docs/SECURITY.md`.
- Todo SQL executado vem de `validateSql(...).safeSql`. Nunca execute o texto da IA diretamente.
- Mudou o validador? Adicione o caso (permitido ou bloqueado) em `validator.test.ts`.
- Mudou o prompt? Rode `npm run evaluate` antes e depois e compare.
- Textos da interface e prompts em **português**; código e nomes técnicos em inglês.
- **Linguagem para quem não entende de SQL nem de IA.** Na interface, use "busca" (e "SQL" só entre parênteses), "assuntos",
  "informações", "registros", em vez de jargão. Toda palavra técnica nova precisa de uma frase explicando. As traduções
  ficam em `lib/ui/friendly.ts`.
- Segredos só em `.env.local` (nunca `NEXT_PUBLIC_`). Nunca logue chaves.
- Não faça commit sem o usuário pedir.
- Interface: chat enxuto, tema escuro, gradiente `#0A0A0A → #0D081F → #2B0F6B`. Cores da marca: `#6A2CFF`, `#B36BFF` (só
  preenchimentos) e `#E0B3FF` (texto em destaque). Tudo em `globals.css`. Mexeu numa cor? Confira o contraste (AA, 4,5:1).
  A página não rola; só a área de mensagens rola.

## Grafo de conhecimento (graphify)

Há um grafo em `graphify-out/` (regenerável, ignorado pelo Git). Consulte-o antes de procurar no código:
`graphify query "..."`, `graphify explain "..."`. Mudou código? Rode `graphify update .`.
