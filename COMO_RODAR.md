# Como rodar o robô de prazos — passo a passo

Este arquivo é para quem vai executar, não para programador. São dois cliques.

## O que é preciso ter no computador

Só uma coisa: o **Python**. É gratuito e leva três minutos para instalar.

1. Abra <https://www.python.org/downloads/>
2. Clique no botão grande de download.
3. **Na primeira tela da instalação, marque a caixinha "Add Python to PATH".**
   Isso é o único detalhe que importa. Se esquecer, o robô não encontra o Python.
4. Clique em "Install Now" e espere terminar.

Não é preciso instalar mais nada. O robô foi escrito de propósito para funcionar
em computador "cru", sem preparo nenhum.

## Passo 1 — testar a conexão (só na primeira vez)

Dê dois cliques em **`1_TESTAR_CONEXAO.bat`**.

Ele vai testar o acesso ao DJEN e gravar o resultado num arquivo chamado
`diagnostico.txt`, que abre sozinho no bloco de notas ao final.

**Mande esse arquivo `diagnostico.txt` para o Marcelo.** É com ele que se
confirma se o robô conseguiu falar com o Diário de Justiça.

Se aparecer a mensagem de que o Python não está instalado, volte para a seção
anterior.

O robô descobre sozinho o formato que o DJEN exige — testa as combinações
possíveis de nome de parâmetro, de formato de data e de número de OAB até uma
funcionar. Não é preciso alterar nada no programa.

## Passo 2 — gerar a planilha de prazos

Dê dois cliques em **`2_GERAR_PRAZOS.bat`**.

Ele busca as intimações dos últimos 30 dias das duas OABs do escritório, monta a
planilha e abre no Excel. A planilha se chama `prazos.csv` e vem ordenada do
prazo mais próximo para o mais distante.

Pode acontecer de aparecer uma mensagem dizendo que falta a leitura das
intimações. Isso é normal enquanto o escritório não tiver a chave de
classificação automática. Nesse caso:

1. A pasta abre sozinha.
2. Mande o arquivo **`teores_capturados.json`** para o Marcelo.
3. Ele devolve um arquivo chamado **`classificacoes.json`**.
4. Coloque esse arquivo nesta mesma pasta e dê dois cliques no
   `2_GERAR_PRAZOS.bat` de novo. Agora a planilha sai completa.

## Passo 3 (opcional) — deixar o robô ler as intimações sozinho

Enquanto o passo acima depender de mandar arquivo para o Marcelo, o robô não
está andando sozinho. Para resolver isso de vez, dê dois cliques em
**`3_CONFIGURAR_CHAVE_IA.bat`** e cole a chave.

A chave se obtém em <https://console.anthropic.com>. O custo é de cerca de três
centavos por intimação — algo em torno de seis reais por mês no volume do
escritório.

O programa testa a chave na hora e diz se funcionou. **Depois de configurar,
feche todas as janelas pretas de prompt** — só assim o passo 2 enxerga a chave.

Isso é opcional: sem a chave o robô continua funcionando, só que com a leitura
manual descrita no passo 2.

## Como ler a planilha

As colunas mais importantes são as primeiras:

- **PRAZO FATAL** — a data limite, calculada em código, nunca "chutada".
- **DIAS RESTANTES** — quanto falta. Número negativo quer dizer que já venceu.
- **STATUS** — três valores possíveis:
  - `OK`: pode cadastrar no Law Net.
  - `REVISAR`: precisa de conferência humana. O motivo está na coluna
    MOTIVO DA REVISÃO.
  - `REVISAO OBRIGATORIA`: é sentença ou acórdão. Sempre passa por advogado,
    sem exceção, mesmo que esteja tudo certo.
- **AÇÃO ESPERADA** — o que precisa ser feito naquele processo.

## Se algo der errado

Tire uma foto da tela e mande para o Marcelo. Não tente adivinhar: o robô foi
feito para avisar quando não tem certeza, e é assim que ele deve se comportar.
