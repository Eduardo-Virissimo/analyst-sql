# Segurança

O agente executa SQL escrito por uma IA a partir do texto de uma pessoa. As duas entradas não são confiáveis, então a defesa
é feita em **camadas independentes**: cada uma segura o básico sozinha e, juntas, cobrem as falhas umas das outras.

## As camadas

| # | Camada | Onde | O que cobre |
|---|---|---|---|
| 1 | Instruções à IA: só leitura, recusar com `NO_ANSWER`, pergunta tratada como dado (`<pergunta>`) | `agent/prompts.ts` | Pedidos óbvios de escrita, injeção de instruções simples |
| 2 | Validador | `sql/validator.ts` | Tudo que não for um único `SELECT` |
| 3 | Usuário `agent_readonly`, com `GRANT SELECT` só no banco `hr_agent` | `db/setup.sql` | Qualquer escrita ou acesso a outros bancos, mesmo se o validador falhar |
| 4 | Transação `READ ONLY`, tempo máximo de 5 s e limite de 200 linhas | `db/mysql.ts`, validador | Escrita, consultas que travam o servidor, respostas gigantes |
| 5 | Borda da API: origem, JSON, tamanho, 10 perguntas/min, erros genéricos, cabeçalhos/CSP | `api/ask/route.ts`, `next.config.ts` | Abuso de tokens, vazamento de erro interno, XSS e clickjacking |

## O que o validador garante

- Um único comando, começando por `SELECT` ou `WITH`.
- Um leitor próprio de caracteres: `--`, `#` e `/* */` só são comentário fora de aspas; `/*! ... */` (comentário que o MySQL
  **executa**) é recusado; texto com aspas sem fechar é recusado.
- O que roda é o SQL **limpo** (`safeSql`), nunca o texto original da IA.
- Bloqueia palavras de escrita e administração (`INSERT`, `DROP`, `SET`...), `INTO`, `FOR UPDATE` e variáveis `@`.
- Bloqueia funções perigosas (`SLEEP`, `BENCHMARK`, `LOAD_FILE`, `VERSION`, `USER`, `DATABASE`...).
- Bloqueia os bancos internos do MySQL (`information_schema`, `mysql`...), inclusive entre crases.
- `FROM`/`JOIN` só em tabelas que existem no banco de verdade.
- Limita o resultado a 200 linhas em qualquer forma de `LIMIT`.

## Limitações conhecidas

- O validador lê o texto da busca, mas não é um parser SQL completo. Por isso existem as camadas 3 e 4: nunca dependa só da 2.
- A lista de tabelas olha `FROM` e `JOIN`, não junções por vírgula (`FROM a, b`). A camada 3 cobre: o usuário só enxerga
  o banco `hr_agent`.
- O limite de perguntas por minuto fica na memória do servidor; com várias instâncias, troque por um banco compartilhado.

## Dados e segredos

- `LLM_API_KEY` e `DB_PASSWORD` só no servidor, em `.env.local` (o Git ignora esse arquivo).
- O MySQL do Docker só aceita conexões da sua máquina (`127.0.0.1`). O usuário `agent_readonly@'%'` só é seguro por causa
  disso; em produção, restrinja de onde ele pode conectar.
- Erros do MySQL são limpos (usuário, host e caminhos) antes de voltarem para a IA e para a tela, e o navegador só recebe
  mensagens genéricas. O erro completo fica no terminal.
- `GET /api/schema` mostra só **nomes e comentários** de tabelas e colunas, nunca os dados. Não escreva segredos nos comentários.
- `logs/agent.jsonl` guarda as perguntas e as buscas (o Git ignora). Trate como dado sensível.
- A IA recebe até 50 linhas do resultado para explicá-lo. Não aponte o agente para tabelas com dados pessoais reais sem
  avaliar isso.

## Antes de publicar

- [ ] `.env.local` nunca foi para o Git
- [ ] Senhas do usuário `agent_readonly` e do administrador do MySQL trocadas (não use as de exemplo)
- [ ] `npm test`, `npm run lint` e `npm run build` passando
- [ ] `npm run evaluate`: os pedidos perigosos continuam sendo recusados
- [ ] Banco sem exposição à internet
