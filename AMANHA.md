# O que fazer amanhã — lista curta

Ordem sugerida. Nada aqui depende de conhecimento técnico.

## Antes de tudo (3 minutos)

- [ ] Instalar o Python: <https://www.python.org/downloads/>
      **Marcar a caixinha "Add Python to PATH" na primeira tela.**

## Caminho principal — o robô buscando direto no DJEN

- [ ] Dois cliques em **`1_TESTAR_CONEXAO.bat`**.
      Abre um bloco de notas sozinho. Ler a primeira resposta:
      *"A internet deste computador chega ao DJEN?"*
      - Se **SIM**: seguir para o passo seguinte.
      - Se **NÃO**: parar. É bloqueio da rede do escritório, não do robô.
        Mandar o `diagnostico.txt` para quem cuida da informática.
- [ ] Dois cliques em **`2_GERAR_PRAZOS.bat`**. A planilha abre no Excel.
- [ ] Conferir: o número de intimações bate com o que a controladoria vê hoje?
      Se vier bem menos, avisar — é sinal de captura incompleta.

## Caminho alternativo — se o DJEN não abrir

Funciona mesmo com o DJEN fora do ar ou bloqueado.

- [ ] Ativar o serviço **gratuito** da OAB/SC em <https://www.liber.adv.br>
      (Ernesto e Carlos, cada um com sua OAB).
- [ ] Baixar de lá a planilha das publicações dos últimos 30 dias.
- [ ] Arrastar a planilha para cima do **`4_IMPORTAR_PLANILHA.bat`**.
      A planilha de prazos sai igualzinha.

## Para o robô andar sozinho (opcional, ~R$ 6/mês)

- [ ] Pegar a chave em <https://console.anthropic.com>.
- [ ] Dois cliques em **`3_CONFIGURAR_CHAVE_IA.bat`** e colar a chave.
      Ele testa na hora e diz se funcionou.
- [ ] Fechar todas as janelas pretas de prompt depois de configurar.

Sem a chave o robô funciona igual, só que a leitura das intimações precisa
passar por mim: mandar o arquivo `teores_capturados.json` e eu devolvo o
`classificacoes.json`.

## Cadastros gratuitos que valem a pena fazer de qualquer jeito

Detalhes e fontes em `MERCADO.md`.

- [ ] **Sistema Advise** pela OAB/SC — <https://www.liber.adv.br>
      Grátis para inscritos adimplentes. Cobre Diário de SC, Diário da União e
      Diário Eletrônico do TRF4. Exporta planilha, que o robô já sabe ler.
- [ ] **CAASC Intimações** — <http://caascintimacoes.com.br>
      Grátis. Diários de SC e Tribunais Superiores. Lê também o painel do
      e-Proc do **TJSC** (serve para o IPVA na Justiça Estadual).
      *Perguntar a eles se cobrem o painel do e-Proc da Justiça Federal —
      é ali que está a maior parte do nosso volume.*

## Duas decisões que são suas

- [ ] A suspensão de 20/12 a 20/01 vale no JEF? Hoje está configurado que
      **não** vale no JEF e vale no rito comum. Trocar é uma palavra.
- [ ] Depois de rodar por um mês: vale contratar um recorte pago como rede de
      segurança (a partir de R$ 29,99/mês por nome), ou os dois gratuitos
      bastam?

## Quando a captura real funcionar, me avise

Preciso apagar os arquivos de amostra `exemplos_djen.json` e o
`classificacoes.json` de teste. Eles têm intimações **inventadas por mim**, e
não podem conviver com dados de verdade.
