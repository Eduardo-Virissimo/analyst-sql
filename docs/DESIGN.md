# Design do analyst-sql

Regras visuais da tela. Leia antes de mexer em qualquer componente. Os valores moram em
`src/app/globals.css`. Os componentes usam só os nomes de lá ou a escala do Tailwind abaixo.

A ideia: menos coisas, aplicadas sempre do mesmo jeito. Uma tela parece feita "no automático" quando cada
peça tem um espaço diferente (10, 14, 18 px), cantos muito arredondados em tudo e nenhum ritmo. Aqui é o
contrário: poucos valores, repetidos.

## 1. Espaço: a regra de 8

Todo espaço (padding, margin, gap) e todo tamanho de peça é **múltiplo de 8**.

| px | Tailwind | Onde usar |
|---:|---|---|
| 4 | `1` | Só meio passo, dentro de peças pequenas: ícone ao lado do texto, selo, abas coladas |
| 8 | `2` | Itens de uma lista, padding de chip, espaço entre botões vizinhos |
| 16 | `4` | Padding padrão de cartão, campo e cabeçalho; espaço entre blocos de um painel |
| 24 | `6` | Padding de painel e janela; espaço entre seções; entre pergunta e resposta |
| 32 | `8` | Respiro grande dentro da tela inicial |
| 48 / 64 | `12` / `16` | Entre áreas inteiras da página |

**Proibido:** 2, 6, 10, 12, 14, 18, 20, 28 px (`0.5`, `1.5`, `2.5`, `3`, `3.5`, `5`, `7`) e valores soltos
como `p-[13px]`. Se ficou apertado, suba um passo; se ficou largo, desça um. Não invente o meio.

**Por que 12 também saiu:** 12 fica entre 8 e 16 e acaba virando o "quase" que desfaz o ritmo. Com só
4 / 8 / 16 / 24 a diferença entre um nível e outro sempre se vê.

### Tamanhos de peça

- **Botões e campos:** altura 32 (`h-8`, só dentro de um grupo, como as abas), 40 (`h-10`, padrão) ou 48.
  40 px é o mínimo para tocar com o dedo.
- **Ícones:** 16 (`size-4`) no meio do texto, 20 (`size-5`) dentro de botões. O 20 é a única exceção da
  regra, porque é o tamanho em que os ícones são desenhados.
- **Logo:** 32 (`size={32}`).
- **Cabeçalho:** 72 px (botão de 40 + 16 em cima e embaixo). Por isso o painel do cabeçalho abre em `top-18`.

### Como alinhar

- O padding de dentro é igual nos quatro lados, ou o de cima/baixo é **menor** que o dos lados
  (`px-4 py-2`, `px-6 py-4`). Nunca o contrário.
- Cabeçalho, corpo e rodapé de um mesmo painel usam o **mesmo** padding lateral, para o texto alinhar
  numa coluna só (os painéis usam `px-6`; o campo de pergunta, `px-4`).
- Quanto mais relacionadas as coisas, mais perto: dentro de um grupo 8, entre grupos 16 ou 24.

## 2. Raio: só três

| Nome | Valor | Onde |
|---|---:|---|
| `rounded-control` | 8 px | Botões quadrados, abas, blocos de código, chips |
| `rounded-card` | 16 px | Cartões, tabela, painéis, janela, campo de pergunta, bolha da pergunta |
| `rounded-pill` | redondo | Botões redondos (enviar, fechar), selos |

**Peça dentro de peça:** o raio de dentro é o raio de fora **menos** o espaço entre as duas. Exemplo: as
abas do resultado ficam num trilho `rounded-control` (8) com `p-1` (4), então cada aba usa
`rounded-[calc(var(--r-control)-var(--space-1))]` (4). Se os dois raios forem iguais, a curva de dentro
parece "gorda" e o desenho fica torto.

Não crie um quarto raio. Não use `rounded-lg`, `rounded-xl`, `rounded-2xl` nem valor solto
(o logo, `rounded-[28%]`, é a única exceção: é desenho, não interface).

## 3. Texto

Só os tamanhos da escala do Tailwind. Nada de `text-[15px]`.

| Classe | px | Onde |
|---|---:|---|
| `text-xs` | 12 | Selos, legendas, rodapés, marquinhas de tipo |
| `text-sm` | 14 | Painéis, tabela, botões, SQL, etapas do andamento |
| `text-base` | 16 | Campo de pergunta, bolha da pergunta, subtítulo |
| `text-lg` | 18 | A resposta do assistente (o texto principal da tela) |
| `text-4xl` / `text-5xl` | 36 / 48 | Título da tela inicial (celular / computador) |

Títulos em serifa (`font-serif`), texto em sans, marca e dados em mono.
Altura de linha em múltiplo de 4: `leading-6` (24) no texto corrido, `leading-7` (28) na resposta.

## 4. O que a resposta mostra

- **Enquanto espera:** as quatro etapas do agente, ao vivo (escrever a busca, conferir, consultar, responder).
  Os nomes ficam em `stepLabel` (`lib/ui/friendly.ts`).
- **Um número só** (uma linha, uma coluna numérica): número grande em serifa, aba "Número".
- **Rótulo + valor** (2 a 30 linhas): barras. O rótulo nunca é cortado se houver espaço.
- **O resto:** tabela. A busca (SQL) é sempre a última aba.
- **Rodapé do cartão:** quanto tempo levou e, se houve correção, em qual tentativa.

## 5. Janelas

As quatro janelas (Perguntas prontas, Ajuda, Dados, Sobre) usam a mesma moldura, `Modal`: título em serifa,
uma frase de introdução, botão de fechar, corpo que rola e rodapé opcional. Três larguras: `sm` (texto),
`md` (listas e cartões), `lg` (o diagrama do banco).

**Janela não rola no computador.** O conteúdo precisa caber inteiro numa tela de 1366×768. Não coube? Ponha os
cartões lado a lado, encurte o texto ou tire o que já existe em outro lugar. (No celular, com os cartões
empilhados, a rolagem é aceita.)

Dentro delas, o conteúdo se separa em **cartões com forma**, não em texto corrido:

- **Cartão** (`.card`): uma faixa de título (ícone no quadradinho + título em serifa, fundo `bg-white/[0.04]`,
  fio embaixo) e linhas separadas por fios (`divide-y divide-line/60`). No máximo **dois níveis**: cartão e o
  que está dentro dele. Nunca cartão dentro de cartão.
- **Ícone no quadradinho** (`IconTile`): 32 px, raio 8. A cor diz o papel: roxo = assunto ou ligação,
  amarelo = código (chave), verde = pode / seguro, vermelho = não faz, cinza = informação comum.
  A cor de destaque não vai em tudo: só onde sinaliza alguma coisa.
- **Pergunta clicável**: sempre `QuestionRow` (ícone opcional, texto, selo opcional e seta), igual em toda parte.
- **Um botão por janela**, no máximo, e no rodapé.

### O diagrama do banco (Dados)

- Cada tabela é um cartão; cada coluna é uma linha de 40 px com ícone do tipo, nome e explicação.
- Ordem das linhas: o **código** (chave) primeiro, depois as **ligações**, depois as informações.
- A linha entre dois cartões sai do código de um e chega na ligação do outro, com "1" e "vários".
  As alturas do cabeçalho (80) e das linhas (40) são fixas justamente para a linha acertar o lugar:
  mudou uma, mude as constantes `HEADER` e `ROW` em `DatabasePanel.tsx`.
- Em cima, a legenda "Como ler o desenho" é uma faixa só, com as mesmas formas e cores do diagrama.
- Todo termo técnico vem com a palavra simples: "caixa" (tabela), "código" (chave), "ligação".

**Não use** dentro de janelas: degradê em cartão, brilho (`shadow` colorida), grade de blocos de tamanhos
diferentes, desenhos sem informação (gráficos de mentira, fundo de pontinhos), animação que não para.
Toda forma precisa dizer alguma coisa.

## 6. Cor, fundo e movimento

Continuam valendo as regras do `CLAUDE.md` (gradiente, cores da marca, contraste AA 4,5:1).
Movimento: 150 ms (`--duration`) para estados, entradas sobem 8 px. O fundo se mexe de leve (manchas que
derivam, uma luz que atravessa a tela e o desenho que flutua), em voltas de 18 a 30 s e só com `transform`.
Nada pisca. Com "reduzir movimento" ligado, nada anda.

## Checklist antes de terminar uma mudança na tela

- [ ] Nenhum `0.5`, `1.5`, `2.5`, `3`, `3.5`, `5`, `7` nem `[NNpx]` em espaço ou tamanho:
      `grep -rnE '\b(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|gap|space-[xy])-(0\.5|1\.5|2\.5|3|3\.5|5|7)\b' src/components`
- [ ] Só `rounded-control`, `rounded-card` ou `rounded-pill`.
- [ ] Peça dentro de peça com raio menor.
- [ ] Botão clicável com pelo menos 40 px.
- [ ] Mexeu numa cor? Conferiu o contraste.
