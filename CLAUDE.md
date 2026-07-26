# Robô de prazos do DJEN — Escritório Morestoni

Este arquivo existe para que uma sessão futura continue o trabalho sem precisar
que o Marcelo explique tudo de novo. Leia até o fim antes de mexer em qualquer
coisa.

## 1. Contexto do escritório

- Marcelo, advogado no Escritório Morestoni, Blumenau/SC.
- Áreas: direito previdenciário federal (aposentadoria especial, aposentadoria
  da pessoa com deficiência pela LC 142/2013, tempo rural) e isenção de imposto
  de renda por doença grave e moléstia profissional.
- Foros: TRF4, Varas Federais de Blumenau e JEF, todos no e-Proc, mais algumas
  ações de isenção de IPVA na Justiça Estadual de SC.
- **Marcelo não é técnico.** Nada de código, trechos de programação ou jargão
  nas respostas para ele. Trabalhe sozinho e conte o resultado em português
  comum. Quando precisar de decisão, faça uma pergunta simples e direta.

## 2. O problema

Hoje uma única pessoa da controladoria lê todas as intimações e cadastra à mão
cada prazo no sistema interno (Law Net), distribuindo as pendências entre os
advogados. É caro, repetitivo e concentra risco: se ela faltar, o escritório
fica cego.

Objetivo final: um robô que capture as intimações, identifique o prazo e crie a
pendência no Law Net para o advogado certo.

**Esta pasta é a PRIMEIRA ETAPA**: prova de conceito rodando fora do Law Net.
Não existe integração com o Law Net e **não se deve tentar criar nenhuma**.

## 3. Decisão técnica já tomada — não rediscutir

A fonte é o **DJEN** (Diário de Justiça Eletrônico Nacional), não raspagem do
e-Proc. Motivo jurídico: desde 16/05/2025, no e-Proc, o prazo das intimações não
pessoais é contado da publicação no DJEN, e a intimação do painel do advogado
passou a ter valor meramente informativo. O DJEN tem API pública, gratuita e sem
cadastro, mantida pelo CNJ.

Fora do escopo, aceito e sabido — se aparecer, marcar como exceção:
1. intimações pessoais ou com vista;
2. pautas de audiência e de perícia;
3. o teor do documento quando a publicação só diz "fica intimado do evento 42".

## 4. As três regras invioláveis

1. **A IA nunca calcula data.** Ela devolve apenas quantidade de dias e forma de
   contagem. O prazo fatal é calculado em código, em função pura e testável
   (`calcular_prazo_fatal`). Modelo de linguagem erra dia útil e feriado, e
   prazo perdido não tem conserto. O saneamento descarta qualquer campo de data
   que a IA devolver.
2. **Antialucinação.** O trecho literal do prazo é comparado com o teor em texto
   normalizado (sem acento, sem pontuação, minúsculas). Se o trecho não estiver
   realmente lá, o prazo é DESCARTADO e a linha vai para REVISAR, mesmo com
   confiança alta.
3. **Sentença e acórdão sempre saem como REVISAO OBRIGATORIA**, sem exceção.
   Confiança abaixo de 0,85 também vai para revisão.

> O erro fatal deste sistema não é errar, é falhar em silêncio. Uma intimação
> com prazo classificada como sem prazo desaparece e ninguém percebe. Sempre
> prefira marcar para revisão humana a arriscar um resultado bonito e errado.

Por isso o script também manda para revisão: linhas classificadas como "sem
prazo", linhas sem data de disponibilização legível, e prazos já vencidos na
data em que o relatório foi gerado.

## 5. Arquivos desta pasta

| Arquivo | O que é |
|---|---|
| `djen_prazos.py` | O programa. Python 3, só biblioteca padrão, nada de instalar. |
| `test_prazos.py` | 23 testes do motor de prazo, do filtro antialucinação e das regras de revisão. Rode `python3 test_prazos.py`. |
| `exemplos_djen.json` | **Dados SIMULADOS.** Amostra usada para exercitar o ciclo sem acesso ao DJEN. Apagar quando a captura real funcionar. |
| `teores_capturados.json` | Gerado automaticamente. Teores capturados, para conferência e para classificação manual. |
| `classificacoes.json` | Classificação usada quando não há `ANTHROPIC_API_KEY`. |
| `prazos.csv` | Saída final para a controladoria. Ponto e vírgula, com BOM, abre no Excel em português. |
| `1_TESTAR_CONEXAO.bat` | Atalho de dois cliques para Windows. Roda o diagnóstico e grava `diagnostico.txt`. |
| `2_GERAR_PRAZOS.bat` | Atalho de dois cliques. Gera a planilha e abre no Excel. Trata o caso "sem chave de IA". |
| `3_CONFIGURAR_CHAVE_IA.bat` | Guarda a `ANTHROPIC_API_KEY` na máquina (`setx`) e testa na hora com `--testar-chave`. |
| `COMO_RODAR.md` | Passo a passo em linguagem comum, para quem vai executar no escritório. |

Comandos:

```
python3 djen_prazos.py --diagnostico          # descobre os parâmetros da API
python3 djen_prazos.py --testar-chave         # confere a ANTHROPIC_API_KEY
python3 djen_prazos.py --sem-classificacao    # só captura, para conferir
python3 djen_prazos.py                        # ciclo completo -> prazos.csv
python3 djen_prazos.py --offline exemplos_djen.json   # roda sem rede, com amostra
```

## 6. Situação da API (ETAPA 1 — PENDENTE, LEIA COM ATENÇÃO)

**Os parâmetros da API NÃO foram confirmados empiricamente.** O ambiente onde a
prova de conceito foi construída bloqueia todo o domínio `jus.br` por política
de rede da organização. Toda tentativa devolve:

```
<urlopen error Tunnel connection failed: 403 Forbidden>
```

Isso é bloqueio de rede do ambiente, **não** é erro de parâmetro nem da API.

Endpoint: `https://comunicaapi.pje.jus.br/api/v1/comunicacao`

Conjunto de parâmetros usado como padrão (nomes documentados pelo CNJ, ainda a
confirmar na prática):

| Finalidade | Nome do parâmetro |
|---|---|
| Número da OAB | `numeroOab` |
| UF da OAB | `ufOab` |
| Data inicial de disponibilização | `dataDisponibilizacaoInicio` (formato `AAAA-MM-DD`) |
| Data final de disponibilização | `dataDisponibilizacaoFim` |
| Página | `pagina` |
| Itens por página | `itensPorPagina` |

**O robô descobre o formato sozinho, a cada execução.** `perfis_possiveis()`
combina 4 conjuntos de nomes (`CONJUNTOS_DE_PARAMETROS`) × 2 formatos de data
(`AAAA-MM-DD` e `DD/MM/AAAA`) × 2 formatos de OAB (como cadastrado e com zeros
à esquerda) = 16 tentativas. `descobrir_perfil()` roda antes da captura e para
na primeira que trouxer resultado; se todas responderem vazio, usa a primeira
que ao menos respondeu sem erro, porque zero intimações também é uma resposta
legítima. O perfil usado fica registrado em `teores_capturados.json`, no campo
`parametros_da_api`.

O modo `--diagnostico` faz o mesmo, mas explicando: primeiro testa se a máquina
**alcança** o servidor (separando bloqueio de rede de erro de parâmetro), depois
percorre as combinações, e por fim imprime os nomes reais dos campos da resposta
e duas amostras completas do JSON.

**Primeira coisa a fazer numa máquina com internet liberada:**
`python3 djen_prazos.py --diagnostico`. Anote aqui neste arquivo o conjunto que
funcionou e os campos reais que vieram. Se nenhum funcionar, abrir
`https://comunica.pje.jus.br/consulta`, fazer uma busca e copiar a URL real da
aba Rede do navegador.

### Campos de resposta

Também não confirmados na prática. O script é tolerante: procura cada
informação por vários nomes possíveis, aceita a lista tanto solta quanto dentro
de `items` / `itens` / `content` / `data`, e limpa HTML do teor.

| Informação | Nomes aceitos |
|---|---|
| Teor do ato | `texto`, `teor`, `conteudo`, `textoComunicacao`, `texto_comunicacao`, `descricao`, `teorComunicacao` |
| Data de disponibilização | `data_disponibilizacao`, `dataDisponibilizacao`, `datadisponibilizacao`, `dataPublicacao`, `data_publicacao` |
| Número do processo | `numero_processo`, `numeroProcesso`, `numeroprocesso`, `numeroprocessocommascara`, `processo` |
| Tribunal | `siglaTribunal`, `sigla_tribunal`, `tribunal`, `nomeTribunal` |
| Órgão julgador | `nomeOrgao`, `nome_orgao`, `orgaoJulgador`, `orgao_julgador`, `orgao` |
| Identificador | `hash`, `id`, `idComunicacao`, `numeroComunicacao` |
| Paginação | `pagina` + `itensPorPagina`; total em `count`, `total`, `totalElements` |

Deduplicação: chave = identificador da comunicação + número do processo só com
dígitos. A mesma intimação captada pelas duas OABs vira uma linha só, com os
dois nomes na coluna ADVOGADO(S).

**Cuidado já tratado:** se a API não devolver identificador nenhum, a chave
*não* pode ser só o número do processo — duas intimações diferentes do mesmo
processo virariam uma linha e a segunda sumiria em silêncio. Nesse caso entra
uma impressão digital (SHA-1) do teor normalizado + a data. Coberto por quatro
testes em `test_prazos.py` (`TestDeduplicacao`).

## 7. Motor de prazo

- Publicação no DJEN = primeiro dia útil seguinte à disponibilização
  (art. 224, §2º do CPC).
- O prazo começa no dia útil seguinte à publicação; esse dia é o dia 1. Exclui o
  dia do começo e inclui o do vencimento (art. 224).
- Dias úteis no rito comum (art. 219).
- Vencimento em dia não útil prorroga para o próximo dia útil.
- Suspensão de 20/12 a 20/01 (art. 220): aplicada **só no rito comum**, não no
  JEF. Constantes `APLICAR_SUSPENSAO_RECESSO_NO_JEF` e
  `APLICAR_SUSPENSAO_RECESSO_NO_RITO_COMUM` no topo do arquivo.
  **PONTO DE INTERPRETAÇÃO A CONFIRMAR PELO TITULAR DO ESCRITÓRIO.**
- Rito detectado pelo nome do órgão julgador: se contiver "JEF" ou "juizado
  especial federal", é JEF.
- Feriados cadastrados: 2026 e 2027 (nacionais + 11/08 dia do advogado e 02/09
  aniversário de Blumenau). **Se o cálculo alcançar ano sem feriados
  cadastrados, o motor levanta erro e a linha vai para REVISAR. Nunca devolve
  data possivelmente errada.**

27 casos travados em `test_prazos.py` (rode `python3 test_prazos.py`):
- 15 dias úteis publicados em 07/08/2026 → 31/08/2026 (pula 11/08);
- 15 dias úteis publicados em 20/07/2026 → 10/08/2026;
- prazo que alcança 2028 → erro, não data;
- recesso: 5 dias úteis de 15/12/2026 → 22/01/2027 no comum e 22/12/2026 no JEF;
- trecho de prazo inexistente no teor → prazo descartado, linha em REVISAR;
- deduplicação sem identificador não engole intimação distinta;
- IA não consegue injetar data nem valor fora dos conjuntos fechados.

## 8. Classificação

Conjuntos fechados, nada fora da lista:

- `tipo_ato`: sentenca, acordao, despacho, ato_ordinatorio, intimacao_laudo,
  intimacao_pericia, audiencia, cumprimento_sentenca, arquivamento, outro
- `materia`: especial, pcd, rural, isencao_ir, ipva, outro
- mais `ha_prazo`, `prazo_dias`, `contagem` (dias_uteis/dias_corridos),
  `acao_esperada`, `prazo_extraido_do_texto`, `confianca`

Dois caminhos:
1. **Com `ANTHROPIC_API_KEY`**: chama `https://api.anthropic.com/v1/messages`
   com o modelo `claude-sonnet-5`, exigindo resposta só em JSON, sem markdown.
2. **Sem a chave**: os teores são gravados em `teores_capturados.json`, a
   classificação é feita pela leitura dos textos e gravada em
   `classificacoes.json`, e o script lê desse arquivo.

Tudo que vem da classificação passa por `sanear_classificacao`, que força os
conjuntos fechados e joga fora qualquer data.

## 9. Estado atual (26/07/2026)

Funcionando e testado: motor de prazo, filtro antialucinação, regras de revisão,
deduplicação, leitura tolerante de campos, descoberta automática do formato da
API, geração do CSV ordenado do prazo mais próximo para o mais distante, e o
caminho sem chave de API. **27 testes passando.**

Nunca executado de verdade: a captura no DJEN, por causa do bloqueio de rede
descrito no item 6. O ciclo completo foi exercitado com a amostra simulada de
`exemplos_djen.json` (13 capturas, 11 depois da deduplicação, 7 com prazo
calculado, 6 marcadas para revisão).

### O que uma sessão futura deve saber sobre a primeira execução real

Marcelo vai rodar isto numa máquina do escritório. Nessa primeira execução:

1. Quatro riscos de ambiente já foram tratados preventivamente: acentuação no
   terminal do Windows (`reconfigure` para UTF-8 no topo do arquivo), chave de
   deduplicação sem identificador, formato de data e de OAB desconhecidos, e
   ausência de pausa entre chamadas (`PAUSA_ENTRE_CHAMADAS`).
2. **Se ele voltar com `teores_capturados.json`**, o trabalho é ler os teores e
   gravar `classificacoes.json` no formato do item 8, usando as chaves exatas do
   campo `chave` de cada item. Os trechos em `prazo_extraido_do_texto` precisam
   ser cópia literal, senão o filtro antialucinação descarta o prazo — o que é o
   comportamento correto, mas gera revisão desnecessária.
3. **Se ele voltar com `diagnostico.txt`**, ler primeiro o bloco `[1]`: ele
   separa "a rede não alcança o DJEN" (problema de infraestrutura, não adianta
   mexer no código) de "os parâmetros mudaram" (aí sim, ajustar
   `CONJUNTOS_DE_PARAMETROS`).
4. Conferir o volume capturado contra o que a controladoria vê hoje. Se vier
   menos, suspeitar de captura incompleta antes de suspeitar de qualquer
   outra coisa.

## 10. Como o mercado resolve isso (pesquisa de 26/07/2026)

Levantamento feito para conferir se estamos construindo o que já se compra pronto.

**Como as empresas fazem, na prática.** Nenhuma raspa tribunal. Todas fazem
"recorte digital": leem os diários (DJEN + DJEs estaduais + murais + pautas)
buscando o nome e o número da OAB, e entregam o resultado por e-mail ou por API.
A IA sugere o prazo; **a confirmação é sempre humana** — nenhuma delas deixa o
modelo gravar data fatal sozinho. Isso confirma a regra 1 deste projeto.

**Fornecedores identificados.** Legalcloud (recorte por nome+OAB em todos os
diários nacionais, IA que sugere prazo, a partir de R$ 29,99/mês por nome
monitorado, sobre o plano Premium); Publicações Online e Alerte (recorte amplo,
entrega por e-mail ou API); Bonnjur e Projurídico Publicações (mesmo modelo);
Escavador (API paga por uso, ~R$ 4,50 na consulta inicial por bloco de 200 itens,
SDK Python oficial); Judit.io e Digesto (infraestrutura de dados por API, consulta
por OAB, webhooks); Advise, ADVBOX, Astrea, Projuris e LegalSuite (software
completo, com captura e controle de prazo embutidos).

**Conclusões que importam para o projeto.**
1. A captura em si é commodity barata — dois nomes monitorados custam cerca de
   R$ 60/mês. O que o mercado NÃO vende é a integração com o Law Net e as regras
   próprias do escritório. É aí que está o valor do que construímos.
2. Vale contratar um recorte pago como **rede de segurança redundante** e como
   régua de conferência: se o robô trouxer menos intimações que o serviço pago,
   sabemos que há falha de captura.
3. O DJEN já teve indisponibilidade nacional noticiada (TRT2). Fonte única é
   risco; qualquer desenho definitivo precisa de redundância.
4. Custo da classificação por IA (estimativa, preços de 07/2026): com
   `claude-sonnet-5` a US$ 3 por milhão de tokens de entrada e US$ 15 de saída,
   uma intimação curta sai por cerca de R$ 0,03. Duzentas intimações por mês dão
   algo em torno de R$ 6/mês. Com `claude-haiku-4-5` (US$ 1 / US$ 5) cai para
   cerca de R$ 2/mês. Ou seja: a chave de API é irrelevante no orçamento e
   resolve a dependência de classificação manual.

## 11. Pendências, na ordem

1. Rodar `1_TESTAR_CONEXAO.bat` numa máquina do escritório com internet
   liberada, confirmar os nomes dos parâmetros e dos campos de resposta, e
   anotar no item 6 deste arquivo.
2. Rodar a captura real dos últimos 30 dias para as duas OABs e conferir se o
   volume bate com o que a controladoria vê hoje.
3. Apagar `exemplos_djen.json` e a `classificacoes.json` da amostra —
   **os dois contêm dados simulados e não podem sobreviver à primeira captura
   real**, sob pena de alguém confundir amostra com intimação verdadeira.
4. Marcelo decidir sobre a suspensão de 20/12 a 20/01 no JEF (item 7).
5. Conferir se o DJEN separa as intimações por polo/destinatário — pode haver
   publicação captada pela OAB em que o escritório é da parte contrária ou em
   que o prazo é de outro advogado.
6. Definir prazos-padrão por tipo de ato como rede de segurança para quando o
   texto não disser os dias.
7. Só depois de tudo isso: pensar na integração com o Law Net (fora do escopo
   atual).
