# O que existe no mercado e o que compensa contratar

Pesquisa feita em 26/07/2026 para responder a uma pergunta prática: estamos
construindo algo que já se compra pronto, e mais barato?

**Resposta curta: não.** O que se compra pronto é a *captura* das publicações —
e o Escritório Morestoni já tem direito a ela **de graça**, por ser inscrito na
OAB/SC. O que ninguém vende é o resto: as regras do escritório, o motor de prazo
auditável e a futura ponte com o Law Net.

---

## 1. O que o escritório já tem direito e não está usando

Este é o achado mais relevante da pesquisa. Dois serviços gratuitos, dos quais
Ernesto e Carlos já são elegíveis hoje, cobrindo exatamente os foros do
escritório.

### Sistema Advise, pelo convênio da OAB/SC — R$ 0,00

- Advogados **regularmente inscritos e adimplentes** na OAB/SC recebem
  gratuitamente as publicações do **Diário de Justiça de SC**, do **Diário de
  Justiça da União** e do **Diário Eletrônico do TRF4**.
- Busca por nome e por número de OAB.
- Ativação em <https://www.liber.adv.br> (hoje "Sistema Advise").
- Convênio OAB/SC com a Advise Brasil, já replicado em outras 19 seccionais.

**Por que isso importa para nós:** a Advise **exporta** as publicações em
XLSX, XML, TXT, PDF, HTML e DOCX, e oferece integração por API e FTP. Ou seja,
esses dados podem alimentar o nosso robô — de graça e sem depender do DJEN estar
no ar. Foi por isso que implementei a leitura de planilha (`--importar`).

### CAASC Intimações — R$ 0,00

- Serviço gratuito da Caixa de Assistência dos Advogados de SC.
- Cadastro em <http://caascintimacoes.com.br> com o número de inscrição da OAB.
- Cobre os diários **estadual, federal, trabalhista e eleitoral de SC** e os
  **Tribunais Superiores**.
- **Diferencial:** lê também o **painel do e-Proc do TJSC** (perfil Advogado),
  de forma automatizada. Exige informar login e senha do e-Proc TJSC de 1º e 2º
  grau, e o QR Code se o segundo fator estiver ativado.
- **Ressalva importante, declarada por eles:** não inclui intimações de
  processos eletrônicos que não sejam publicadas nos diários listados.

**Atenção ao alcance:** o painel automatizado do CAASC é do **TJSC**, ou seja,
Justiça Estadual — serve para as ações de isenção de IPVA. Ele **não** cobre o
painel do e-Proc da Justiça Federal (JFSC/TRF4), que é onde está a maior parte
do nosso volume. Confirmar isso com a CAASC antes de contar com essa cobertura.

### MultiADV, pelo convênio da CAASC — R$ 0,00

Software de gestão de escritório sem custo para a advocacia catarinense. Não
resolve o nosso problema (não conhece nossas regras nem o Law Net), mas vale
saber que existe antes de assinar qualquer software pago.

---

## 2. Se um dia for preciso pagar, quanto custa

Valores públicos coletados em 26/07/2026. **Mudam sem aviso — confirmar na
contratação.** Servem como régua, não como cotação.

| Serviço | O que entrega | Preço divulgado |
|---|---|---|
| Recorte Digital das seccionais da OAB | Recorte simples por nome/OAB | Gratuito; as próprias OABs calculam o benefício em **R$ 25/mês por advogado** |
| Legalcloud | Recorte nacional + IA que sugere prazo | A partir de **R$ 29,99/mês por nome**, sobre o plano Premium |
| Astrea (Aurum) | Software completo | Plano Light **gratuito** (40 processos, 1 usuário); pagos a partir de **R$ 117/mês**, relatos de ~R$ 249/mês |
| ADVBOX | Software completo | Relatos de **R$ 89/mês** (2–3 usuários) a **R$ 360–450/mês** |
| NextCase | Software completo | A partir de **R$ 197/mês**; IA cobrada à parte, a partir de R$ 10/mês |
| Escavador (API) | Consulta e monitoramento por uso | ~**R$ 4,50** na consulta inicial por bloco de 200 itens, + R$ 0,05 por bloco adicional |
| Judit.io, Digesto | Infraestrutura de dados por API | Sob consulta, por volume |
| Publicações Online, Alerte, Bonnjur | Recorte amplo, entrega por e-mail ou API | Sob consulta |

Para comparação, o custo da leitura automática pela nossa própria IA fica em
torno de **R$ 0,03 por intimação** — algo como R$ 6/mês no volume do escritório.

---

## 3. Como o mercado resolve, tecnicamente

Vale registrar porque valida decisões que já tomamos:

1. **Ninguém raspa tribunal.** Todos leem os diários procurando nome e número de
   OAB. É o mesmo caminho do nosso robô.
2. **A IA sugere, o humano confirma.** Nenhum fornecedor deixa o modelo gravar
   data fatal sozinho. A regra 1 deste projeto é padrão de mercado, não excesso
   de zelo.
3. **A entrega é por e-mail, planilha ou API.** Por isso o `--importar` faz o
   robô conversar com qualquer um deles.

---

## 4. Uma boa notícia sobre o escopo

Eu havia listado "intimações pessoais" como um buraco do DJEN. A pesquisa
mostrou que o buraco é menor do que parecia:

Pela **Resolução CNJ 569/2024**, o Domicílio Judicial Eletrônico passou a ser
usado apenas para **citação e intimação pessoal das partes** (empresas e entes
públicos). **O advogado é intimado pelo DJEN**, e é dali que corre o prazo. A
mudança foi feita a pedido da OAB, justamente porque antes a empresa era
intimada pelo Domicílio e o prazo começava a correr sem o advogado saber.

Ou seja: para o prazo do advogado, o DJEN é mesmo a fonte certa. O Domicílio
importa quando o cliente é pessoa jurídica e recebe intimação pessoal — situação
rara na nossa carteira, que é de pessoas físicas.

---

## 5. Recomendação

**Não contratar nada agora.** Fazer, nesta ordem:

1. **Ativar os dois serviços gratuitos** (Advise pela OAB/SC e CAASC
   Intimações) para Ernesto e Carlos. Custo zero, e passam a existir duas
   fontes independentes.
2. **Rodar o robô e comparar os números** com o que esses serviços entregarem,
   por um mês. Se o robô trouxer menos, há falha de captura — e agora temos como
   descobrir isso sem depender da percepção de ninguém.
3. **Só considerar um serviço pago** se aparecer um buraco concreto que os
   gratuitos não cubram. Aí a régua é o Legalcloud a R$ 29,99/mês por nome.
4. **Não trocar o robô por software de prateleira.** Nenhum deles integra com o
   Law Net nem conhece as classificações do escritório, que é justamente o
   trabalho que a controladoria faz hoje à mão.

---

## Fontes

- [OAB/SC disponibiliza publicações jurídicas, gratuitamente, para advogados](https://oab-sc.org.br/noticias/oabsc-disponibiliza-publicacoes-juridicas-gratuitamente-para-advogadosnbsp/8671)
- [CAASC Intimações](https://caasc.org.br/servico/caasc-intimacoes/caasc-intimacoes) e [CAASC oferece serviço gratuito de leitura e envio de intimações](https://www.caasc.org.br/noticia/caasc-oferece-servico-gratuito-de-leitura-e-envio-de-intimacoes)
- [CAASC intimações — Subseção Blumenau](https://www.oab-bnu.org.br/noticias-e-artigos/noticias/17903-22-01-caasc-intimacoes-conheca-este-servico-gratuito.html)
- [Novo convênio CAASC: software MultiADV sem custo](https://www.caasc.org.br/index.php/noticia/novo-convenio-caasc-sem-custo-para-a-advocacia-catarinense-software-multiadv-faz-a-gestao-do-seu-escritorio)
- [Advise — Software Jurídico](https://advise.com.br/) e [Serviços Advise](https://advise.com.br/servicos)
- [Recorte Digital continuará sendo fornecido gratuitamente — OAB/BA](https://www.oab-ba.org.br/noticia/recorte-digital-continuara-sendo-fornecido-gratuitamente-1)
- [Ferramenta para monitorar publicações judiciais — Legalcloud](https://legalcloud.com.br/ferramenta-para-monitorar-publicacoes-judiciais/)
- [Planos e preços do Astrea — Aurum](https://www.aurum.com.br/astrea/planos-e-precos/)
- [Preços e planos do ADVBOX](https://advbox.com.br/planos)
- [Melhor software jurídico 2026 — NextCase](https://nextcasebr.com/blog/melhores-softwares-juridicos-2026)
- [Como funciona a cobrança na API — Escavador](https://suporte-api.escavador.com/hc/pt-br/articles/13615780917531-Como-funciona-a-cobran%C3%A7a-na-API)
- [CNJ altera regras do Domicílio Judicial e exclui intimação de advogado — Migalhas](https://www.migalhas.com.br/quentes/414786/cnj-altera-regras-do-domicilio-judicial-e-exclui-intimacao-de-advogado)
- [OAB/SC sobre a mesma alteração](https://www.oab-sc.org.br/noticias/grande-noticia-cnj-atende-pedido-oab-altera-regras-do-domicilio-judicial-eletronico-e-exclui-intimac/22800)
- [Comunicações Processuais — Portal CNJ](https://www.cnj.jus.br/programas-e-acoes/processo-judicial-eletronico/comunicacoes-processuais/)
