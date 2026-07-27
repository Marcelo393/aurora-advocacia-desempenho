# Comando para colar no Cowork

O Cowork roda **na máquina do Marcelo**, então tem a internet do escritório —
é por isso que ele consegue fazer o que a sessão do servidor não consegue.

Copiar tudo o que está entre as linhas e colar como uma mensagem só.

---

Você vai executar, no MEU computador, a primeira captura real de um robô de
prazos jurídicos que já está pronto e testado. Sou advogado, não sou técnico:
me explique tudo em português comum, sem mostrar código e sem jargão.

O projeto está no GitHub, no repositório `Marcelo393/aurora-advocacia-desempenho`,
na branch `claude/djen-prazo-bot-poc-r995vp`.

Faça nesta ordem, e pare no primeiro problema:

1. Deixe o Python 3 funcionando nesta máquina. **Instale você mesmo — não me
   explique como fazer, faça.**
   - Se já estiver instalado, só confirme a versão e siga adiante.
   - No Windows, use o winget:
     `winget install --id Python.Python.3.12 --scope user --accept-source-agreements --accept-package-agreements`
     Se o winget não existir nesta máquina, baixe o instalador oficial do
     python.org e rode em modo silencioso, com `PrependPath=1` e instalação
     apenas para o meu usuário, para não precisar de senha de administrador.
   - No Mac, use o Homebrew (`brew install python`). Se não houver Homebrew,
     use o instalador oficial do python.org.
   - Ao final, confirme que deu certo mostrando a versão instalada.
   - Só pare neste passo se a máquina exigir uma senha de administrador que você
     não tem. Nesse caso, me diga exatamente o que travou.

2. Baixe o repositório e use a branch `claude/djen-prazo-bot-poc-r995vp`.
   Pode clonar com git ou baixar o ZIP da branch, o que for mais simples.

3. Rode `python3 test_prazos.py` (no Windows pode ser `py -3 test_prazos.py`).
   Devem passar 33 testes. Se algum falhar, pare e me mostre qual falhou.
   Se o comando não for encontrado logo depois da instalação, abra um terminal
   novo — o Windows só enxerga o Python nas janelas abertas depois dele.

4. Rode `python3 djen_prazos.py --diagnostico`.
   - Leia o bloco marcado `[1]`. Ele responde se esta máquina alcança o DJEN.
   - Se **NÃO** alcançar: pare. Me diga que é bloqueio de rede e cole a
     mensagem de erro exata. Não tente contornar o bloqueio.
   - Se **alcançar**: me diga qual combinação de parâmetros funcionou e quais
     nomes de campos o DJEN devolveu em cada intimação.

5. Se alcançou, rode `python3 djen_prazos.py --sem-classificacao`.
   Me diga quantas comunicações vieram no total, quantas sobraram depois de
   remover duplicatas, e quantas ficaram com o texto vazio ou muito curto.

6. Depois rode `python3 djen_prazos.py`.
   - Se ele parar dizendo que falta a leitura das intimações, **não tente
     contornar**. É o comportamento correto quando não há chave de IA
     configurada. Me avise, e me diga onde está o arquivo
     `teores_capturados.json`.
   - Se gerar o `prazos.csv`, me diga: quantas linhas saíram, qual é o prazo
     fatal mais próximo, e quantas foram marcadas para revisão humana e por quê.

REGRAS QUE NÃO PODEM SER QUEBRADAS:

- **Não invente nenhum dado.** Se algo falhar, mostre a mensagem de erro exata.
  Prazo perdido não tem conserto, então prefiro erro visível a resultado bonito.
- **Não altere as regras de cálculo de prazo** nem as regras de revisão do
  programa. Elas foram revisadas e testadas.
- **Não envie para o GitHub** os arquivos `teores_capturados.json`, `prazos.csv`
  e `diagnostico.txt`. Eles passam a conter intimações reais de clientes.
  (O projeto já está configurado para ignorá-los, mas confirme.)
- **Não apague nenhum arquivo.**

No final, me dê um resumo em português comum: deu certo ou não, o que veio, e
qual é o próximo passo.

---

## Depois que ele responder

Traga a resposta de volta para esta conversa. O que eu preciso ver é:

- o bloco `[1]` do diagnóstico (alcançou ou não o DJEN);
- os nomes dos campos que o DJEN devolveu;
- quantas intimações vieram para cada advogado;
- e, se aparecer, o arquivo `teores_capturados.json`.

Com isso eu fecho a etapa 1 e anoto os parâmetros confirmados no `CLAUDE.md`.
