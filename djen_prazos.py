#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
djen_prazos.py - Captura de intimacoes no DJEN e calculo de prazos.
Escritorio Morestoni - Blumenau/SC. Prova de conceito (fora do Law Net).

Somente biblioteca padrao do Python 3. Nao precisa instalar nada.

Uso tipico:
    python3 djen_prazos.py --sem-classificacao      # so captura, para conferir
    python3 djen_prazos.py                          # ciclo completo -> prazos.csv
    python3 djen_prazos.py --diagnostico            # descobre nomes de parametros da API
    python3 djen_prazos.py --offline exemplos_djen.json   # roda sem rede, com amostra
"""

import argparse
import csv
import hashlib
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta

# O terminal do Windows nao usa acentuacao UTF-8 por padrao. Sem isto, imprimir
# "1º JEF de Blumenau" derruba o programa no meio da execucao.
for _saida in (sys.stdout, sys.stderr):
    if hasattr(_saida, "reconfigure"):
        try:
            _saida.reconfigure(encoding="utf-8", errors="replace")
        except (ValueError, OSError):
            pass

# =====================================================================
# 1. CONFIGURACAO - mexa aqui
# =====================================================================

# Para acrescentar um advogado, basta copiar uma linha e trocar os dados.
ADVOGADOS = [
    {"nome": "Ernesto Zulmir Morestoni", "oab": "11666", "uf": "SC"},
    {"nome": "Carlos Oscar Krueger", "oab": "27320", "uf": "SC"},
]

DIAS_JANELA_PADRAO = 30          # quantos dias para tras consultar
API_BASE = "https://comunicaapi.pje.jus.br/api/v1/comunicacao"
ITENS_POR_PAGINA = 100
TIMEOUT_SEGUNDOS = 60
MAX_PAGINAS = 50                 # trava de seguranca contra loop infinito

MODELO_IA = "claude-sonnet-5"
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
ARQUIVO_TEORES = "teores_capturados.json"
ARQUIVO_CLASSIFICACOES = "classificacoes.json"

# --------------------------------------------------------------------
# PONTO DE INTERPRETACAO A SER CONFIRMADO PELO TITULAR DO ESCRITORIO:
# A suspensao de prazos de 20/12 a 20/01 (art. 220 do CPC) esta aplicada
# APENAS no rito comum. No JEF ela NAO e aplicada, porque a Lei 10.259/01
# e a Lei 9.099/95 nao preveem essa suspensao e a jurisprudencia diverge.
# Se o escritorio decidir o contrario, troque para True e rode os testes.
# --------------------------------------------------------------------
APLICAR_SUSPENSAO_RECESSO_NO_JEF = False
APLICAR_SUSPENSAO_RECESSO_NO_RITO_COMUM = True

RECESSO_INICIO = (12, 20)   # 20/12
RECESSO_FIM = (1, 20)       # 20/01

# Feriados cadastrados. Se um prazo cair em ano que nao esteja aqui,
# o motor LEVANTA ERRO em vez de devolver data possivelmente errada.
FERIADOS = {
    2026: [
        "01-01",  # Confraternizacao Universal
        "16-02", "17-02",  # Carnaval
        "03-04",  # Sexta-feira Santa
        "21-04",  # Tiradentes
        "01-05",  # Dia do Trabalho
        "04-06",  # Corpus Christi
        "11-08",  # Dia do Advogado
        "02-09",  # Aniversario de Blumenau
        "07-09",  # Independencia
        "12-10",  # Padroeira
        "02-11",  # Finados
        "15-11",  # Proclamacao da Republica
        "20-11",  # Consciencia Negra
        "25-12",  # Natal
    ],
    2027: [
        "01-01",
        "08-02", "09-02",  # Carnaval
        "26-03",  # Sexta-feira Santa
        "21-04",
        "01-05",
        "27-05",  # Corpus Christi
        "11-08",
        "02-09",
        "07-09",
        "12-10",
        "02-11",
        "15-11",
        "20-11",
        "25-12",
    ],
}

# Conjuntos fechados de classificacao. Nada fora destas listas entra no CSV.
TIPOS_ATO = [
    "sentenca", "acordao", "despacho", "ato_ordinatorio", "intimacao_laudo",
    "intimacao_pericia", "audiencia", "cumprimento_sentenca", "arquivamento",
    "outro",
]
MATERIAS = ["especial", "pcd", "rural", "isencao_ir", "ipva", "outro"]
CONTAGENS = ["dias_uteis", "dias_corridos"]

CONFIANCA_MINIMA = 0.85
TIPOS_REVISAO_OBRIGATORIA = ("sentenca", "acordao")


class AnoSemFeriadosError(Exception):
    """Levantado quando o calculo toca um ano sem feriados cadastrados."""


# =====================================================================
# 2. TEXTO - normalizacao usada pelo filtro antialucinacao
# =====================================================================

def normalizar(texto):
    """Minusculas, sem acento, sem pontuacao, espacos colapsados."""
    if not texto:
        return ""
    t = unicodedata.normalize("NFKD", str(texto))
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = t.lower()
    t = re.sub(r"[^a-z0-9]+", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def trecho_confere(teor, trecho):
    """Regra inviolavel 2: o trecho literal precisa existir mesmo no teor."""
    n_teor = normalizar(teor)
    n_trecho = normalizar(trecho)
    if not n_trecho or len(n_trecho) < 8:
        return False
    return n_trecho in n_teor


# =====================================================================
# 3. MOTOR DE PRAZO - funcoes puras e testaveis. A IA nunca calcula data.
# =====================================================================

def _feriados_do_ano(ano):
    if ano not in FERIADOS:
        raise AnoSemFeriadosError(
            "Feriados do ano %d nao estao cadastrados no arquivo. "
            "Cadastre-os antes de calcular prazos que alcancem esse ano." % ano
        )
    return FERIADOS[ano]


def eh_feriado(d):
    return d.strftime("%d-%m") in _feriados_do_ano(d.year)


def eh_dia_util(d):
    """Dia util = nao e sabado/domingo e nao e feriado."""
    if d.weekday() >= 5:
        return False
    return not eh_feriado(d)


def esta_em_recesso(d):
    """20/12 a 20/01, inclusive (art. 220 do CPC)."""
    mes_dia = (d.month, d.day)
    return mes_dia >= RECESSO_INICIO or mes_dia <= RECESSO_FIM


def _aplica_recesso(rito):
    if rito == "jef":
        return APLICAR_SUSPENSAO_RECESSO_NO_JEF
    return APLICAR_SUSPENSAO_RECESSO_NO_RITO_COMUM


def _dia_disponivel(d, rito):
    """Dia em que o prazo pode correr e em que pode vencer."""
    if not eh_dia_util(d):
        return False
    if _aplica_recesso(rito) and esta_em_recesso(d):
        return False
    return True


def proximo_dia_util(d, rito="comum"):
    """Primeiro dia disponivel ESTRITAMENTE depois de d."""
    atual = d + timedelta(days=1)
    for _ in range(400):
        if _dia_disponivel(atual, rito):
            return atual
        atual += timedelta(days=1)
    raise AnoSemFeriadosError("Nao foi possivel achar dia util seguinte a %s" % d)


def data_publicacao_djen(data_disponibilizacao, rito="comum"):
    """Art. 224, par. 2o do CPC: publicacao = 1o dia util seguinte a
    disponibilizacao no DJEN."""
    return proximo_dia_util(data_disponibilizacao, rito)


def calcular_prazo_fatal(data_publicacao, prazo_dias, contagem="dias_uteis",
                         rito="comum"):
    """Devolve a data fatal.

    Regras: comeca no dia util seguinte a publicacao (esse dia e o dia 1),
    exclui o dia do comeco e inclui o do vencimento (art. 224 do CPC),
    dias uteis no rito comum (art. 219), vencimento em dia nao util prorroga.
    Levanta AnoSemFeriadosError se alcancar ano sem feriados cadastrados.
    """
    if not isinstance(data_publicacao, date):
        raise ValueError("data_publicacao precisa ser um objeto date")
    if not isinstance(prazo_dias, int) or prazo_dias < 1:
        raise ValueError("prazo_dias precisa ser inteiro maior que zero")
    if contagem not in CONTAGENS:
        raise ValueError("contagem precisa ser dias_uteis ou dias_corridos")

    atual = proximo_dia_util(data_publicacao, rito)  # dia 1
    contados = 1
    limite = prazo_dias * 6 + 400  # trava de seguranca
    passos = 0

    while contados < prazo_dias:
        passos += 1
        if passos > limite:
            raise AnoSemFeriadosError("Calculo de prazo nao convergiu")
        atual = atual + timedelta(days=1)
        if contagem == "dias_uteis":
            if _dia_disponivel(atual, rito):
                contados += 1
        else:
            # dias corridos: contam sabados, domingos e feriados,
            # mas o recesso suspende o curso quando aplicavel.
            if _aplica_recesso(rito) and esta_em_recesso(atual):
                continue
            contados += 1

    # vencimento em dia nao util (ou dentro do recesso) prorroga
    while not _dia_disponivel(atual, rito):
        atual = atual + timedelta(days=1)

    return atual


def detectar_rito(orgao_julgador, tribunal=""):
    """Se o nome do orgao contiver JEF, e JEF."""
    alvo = normalizar("%s %s" % (orgao_julgador or "", tribunal or ""))
    if "jef" in alvo.split() or "juizado especial federal" in alvo:
        return "jef"
    return "comum"


# =====================================================================
# 4. CLIENTE DJEN - tolerante a variacao de nomes de campos
# =====================================================================

# Nomes de parametro testados, em ordem de preferencia. O primeiro conjunto
# que devolver resultado e o usado. Ver --diagnostico.
CONJUNTOS_DE_PARAMETROS = [
    {"oab": "numeroOab", "uf": "ufOab",
     "ini": "dataDisponibilizacaoInicio", "fim": "dataDisponibilizacaoFim",
     "pag": "pagina", "tam": "itensPorPagina"},
    {"oab": "numeroOab", "uf": "ufOab",
     "ini": "dataInicio", "fim": "dataFim",
     "pag": "pagina", "tam": "itensPorPagina"},
    {"oab": "numero_oab", "uf": "uf_oab",
     "ini": "data_disponibilizacao_inicio", "fim": "data_disponibilizacao_fim",
     "pag": "pagina", "tam": "itensPorPagina"},
    {"oab": "oab", "uf": "uf",
     "ini": "dataDisponibilizacaoInicio", "fim": "dataDisponibilizacaoFim",
     "pag": "page", "tam": "size"},
]

# A data pode ser exigida em qualquer um destes formatos, e o numero da OAB
# pode precisar de zeros a esquerda. Todas as combinacoes sao testadas.
FORMATOS_DATA = [
    ("AAAA-MM-DD", lambda d: d.isoformat()),
    ("DD/MM/AAAA", lambda d: d.strftime("%d/%m/%Y")),
]
FORMATOS_OAB = [
    ("como cadastrado", lambda o: o),
    ("com zeros a esquerda", lambda o: o.zfill(6)),
]

PAUSA_ENTRE_CHAMADAS = 0.5  # segundos, para nao martelar o servidor do CNJ


def perfis_possiveis():
    """Todas as combinacoes de nomes de parametro, formato de data e de OAB."""
    for nomes in CONJUNTOS_DE_PARAMETROS:
        for rotulo_data, fmt_data in FORMATOS_DATA:
            for rotulo_oab, fmt_oab in FORMATOS_OAB:
                yield {"nomes": nomes,
                       "rotulo_data": rotulo_data, "fmt_data": fmt_data,
                       "rotulo_oab": rotulo_oab, "fmt_oab": fmt_oab}


def descrever_perfil(perfil):
    n = perfil["nomes"]
    return ("%s / %s / %s / %s | data em %s | OAB %s | %s + %s"
            % (n["oab"], n["uf"], n["ini"], n["fim"], perfil["rotulo_data"],
               perfil["rotulo_oab"], n["pag"], n["tam"]))


def montar_url(perfil, advogado, data_ini, data_fim, pagina, tamanho):
    n = perfil["nomes"]
    params = {
        n["oab"]: perfil["fmt_oab"](advogado["oab"]),
        n["uf"]: advogado["uf"],
        n["ini"]: perfil["fmt_data"](data_ini),
        n["fim"]: perfil["fmt_data"](data_fim),
        n["pag"]: str(pagina),
        n["tam"]: str(tamanho),
    }
    return API_BASE + "?" + urllib.parse.urlencode(params)

# Nomes possiveis de cada campo da RESPOSTA. Pega o primeiro que existir.
CAMPOS_TEOR = ["texto", "teor", "conteudo", "textoComunicacao", "texto_comunicacao",
               "descricao", "teorComunicacao"]
CAMPOS_DATA_DISP = ["data_disponibilizacao", "dataDisponibilizacao",
                    "datadisponibilizacao", "dataPublicacao", "data_publicacao"]
CAMPOS_PROCESSO = ["numero_processo", "numeroProcesso", "numeroprocesso",
                   "numeroprocessocommascara", "numeroProcessoComMascara",
                   "processo"]
CAMPOS_TRIBUNAL = ["siglaTribunal", "sigla_tribunal", "tribunal", "nomeTribunal"]
CAMPOS_ORGAO = ["nomeOrgao", "nome_orgao", "orgaoJulgador", "orgao_julgador",
                "orgao", "nomeOrgaoJulgador"]
CAMPOS_ID = ["hash", "id", "idComunicacao", "id_comunicacao", "numeroComunicacao",
             "numero_comunicacao"]
CAMPOS_TIPO = ["tipoComunicacao", "tipo_comunicacao", "tipoDocumento",
               "tipo_documento", "nomeClasse"]
CAMPOS_LINK = ["link", "url", "linkCertidao"]
CAMPOS_LISTA = ["items", "itens", "content", "data", "resultado", "comunicacoes"]
CAMPOS_TOTAL = ["count", "total", "totalElements", "totalRegistros", "quantidade"]


def pegar(dic, nomes, padrao=""):
    """Primeiro campo existente e nao vazio, entre varios nomes possiveis."""
    if not isinstance(dic, dict):
        return padrao
    minusculo = {str(k).lower(): v for k, v in dic.items()}
    for nome in nomes:
        for chave in (nome, nome.lower()):
            if chave in minusculo and minusculo[chave] not in (None, "", []):
                return minusculo[chave]
    return padrao


def extrair_lista(payload):
    """A resposta pode ser lista pura ou dicionario com a lista dentro."""
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        for nome in CAMPOS_LISTA:
            valor = pegar(payload, [nome], None)
            if isinstance(valor, list):
                return valor
    return []


def limpar_html(texto):
    if not texto:
        return ""
    t = re.sub(r"<br\s*/?>", "\n", str(texto), flags=re.I)
    t = re.sub(r"</p>", "\n", t, flags=re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    t = (t.replace("&nbsp;", " ").replace("&amp;", "&")
          .replace("&lt;", "<").replace("&gt;", ">")
          .replace("&quot;", '"').replace("&#39;", "'"))
    t = re.sub(r"[ \t]+", " ", t)
    return re.sub(r"\n{3,}", "\n\n", t).strip()


def _http_get(url):
    req = urllib.request.Request(url, headers={
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; MorestoniPrazos/1.0)",
    })
    with urllib.request.urlopen(req, timeout=TIMEOUT_SEGUNDOS) as resp:
        bruto = resp.read().decode("utf-8", errors="replace")
    return json.loads(bruto)


def consultar_djen(advogado, data_ini, data_fim, perfil, verbose=True):
    """Consulta o DJEN paginando ate acabar. Devolve lista de itens crus."""
    coletados = []
    pagina = 1
    while pagina <= MAX_PAGINAS:
        url = montar_url(perfil, advogado, data_ini, data_fim,
                         pagina, ITENS_POR_PAGINA)
        payload = _http_get(url)
        itens = extrair_lista(payload)
        if verbose:
            total = pegar(payload, CAMPOS_TOTAL, "?") if isinstance(payload, dict) else "?"
            print("   pagina %d: %d itens (total informado: %s)"
                  % (pagina, len(itens), total))
        coletados.extend(itens)
        if len(itens) < ITENS_POR_PAGINA:
            break
        pagina += 1
        time.sleep(PAUSA_ENTRE_CHAMADAS)
    return coletados


def descobrir_perfil(advogado, data_ini, data_fim, verbose=True):
    """Acha sozinho a combinacao de parametros que a API aceita.

    Devolve (perfil, motivo). Prefere um perfil que traga resultados; se todos
    responderem vazio, devolve o primeiro que ao menos respondeu sem erro,
    porque zero intimacoes tambem e uma resposta legitima.
    """
    primeiro_que_respondeu = None
    erros = []
    for perfil in perfis_possiveis():
        url = montar_url(perfil, advogado, data_ini, data_fim, 1, 5)
        try:
            payload = _http_get(url)
        except urllib.error.HTTPError as e:
            erros.append("HTTP %s (%s)" % (e.code, e.reason))
            time.sleep(PAUSA_ENTRE_CHAMADAS)
            continue
        except Exception as e:
            erros.append(str(e))
            time.sleep(PAUSA_ENTRE_CHAMADAS)
            continue
        itens = extrair_lista(payload)
        if itens:
            if verbose:
                print("   parametros aceitos: %s" % descrever_perfil(perfil))
            return perfil, "trouxe resultados"
        if primeiro_que_respondeu is None:
            primeiro_que_respondeu = perfil
        time.sleep(PAUSA_ENTRE_CHAMADAS)

    if primeiro_que_respondeu is not None:
        if verbose:
            print("   a API respondeu, mas sem nenhuma intimacao no periodo.")
            print("   parametros usados: %s" % descrever_perfil(primeiro_que_respondeu))
        return primeiro_que_respondeu, "respondeu vazio"

    if verbose:
        print("   NENHUMA combinacao funcionou. Ultimos erros: %s"
              % "; ".join(erros[-3:]))
    return None, "; ".join(erros[-3:]) or "sem resposta"


def _testar_alcance():
    """Distingue 'a internet nao chega no DJEN' de 'os parametros estao errados'."""
    try:
        _http_get(API_BASE)
        return True, "o servidor respondeu"
    except urllib.error.HTTPError as e:
        # Respondeu, mesmo que reclamando da falta de parametros: alcance OK.
        return True, "o servidor respondeu com HTTP %s (%s)" % (e.code, e.reason)
    except Exception as e:
        return False, str(e)


def diagnostico_parametros():
    """ETAPA 1: descobre empiricamente quais nomes de parametro funcionam."""
    adv = ADVOGADOS[0]
    fim = date.today()
    ini = fim - timedelta(days=DIAS_JANELA_PADRAO)

    print("=" * 70)
    print("DIAGNOSTICO DO ROBO DE PRAZOS - Escritorio Morestoni")
    print("Gerado em %s" % datetime.now().strftime("%d/%m/%Y as %H:%M"))
    print("Python %s em %s" % (sys.version.split()[0], sys.platform))
    print("Endereco testado: %s" % API_BASE)
    print("Advogado de teste: OAB/%s %s" % (adv["uf"], adv["oab"]))
    print("Periodo: %s a %s" % (ini.strftime("%d/%m/%Y"), fim.strftime("%d/%m/%Y")))
    print("=" * 70)

    alcancou, detalhe = _testar_alcance()
    print("\n[1] A internet deste computador chega ao DJEN?")
    print("    %s - %s" % ("SIM" if alcancou else "NAO", detalhe))
    if not alcancou:
        print("\n    O robo nao conseguiu sequer falar com o servidor do CNJ.")
        print("    Isso NAO e erro de parametro. Pode ser antivirus, firewall")
        print("    ou bloqueio da rede do escritorio. Mande este arquivo para")
        print("    quem cuida da informatica.")
        return None

    print("\n[2] Qual combinacao de parametros a API aceita?")
    achou = None
    for i, perfil in enumerate(perfis_possiveis(), 1):
        url = montar_url(perfil, adv, ini, fim, 1, 5)
        print("\n    tentativa %d: %s" % (i, descrever_perfil(perfil)))
        print("    %s" % url)
        try:
            payload = _http_get(url)
        except urllib.error.HTTPError as e:
            print("    -> recusado: HTTP %s (%s)" % (e.code, e.reason))
            time.sleep(PAUSA_ENTRE_CHAMADAS)
            continue
        except Exception as e:
            print("    -> falhou: %s" % e)
            time.sleep(PAUSA_ENTRE_CHAMADAS)
            continue

        itens = extrair_lista(payload)
        print("    -> aceito, %d intimacoes nesta pagina" % len(itens))
        if itens:
            achou = perfil
            break
        time.sleep(PAUSA_ENTRE_CHAMADAS)

    if achou is None:
        print("\n    A API respondeu, mas nenhuma combinacao trouxe intimacoes.")
        print("    Duas explicacoes possiveis, e so um humano decide qual:")
        print("      a) nao houve mesmo nenhuma publicacao no periodo; ou")
        print("      b) os nomes dos parametros mudaram.")
        print("    Para tirar a duvida: abra https://comunica.pje.jus.br/consulta,")
        print("    faca a mesma busca na tela e veja se aparece alguma coisa.")
        return None

    print("\n[3] Como o DJEN devolve os dados")
    itens = extrair_lista(_http_get(montar_url(achou, adv, ini, fim, 1, 5)))
    print("    CAMPOS DE CADA INTIMACAO:")
    print("    %s" % ", ".join(sorted(str(k) for k in itens[0].keys())))
    for n, item in enumerate(itens[:2], 1):
        print("\n    AMOSTRA %d:" % n)
        print("    %s" % json.dumps(item, ensure_ascii=False)[:1500])

    print("\n" + "=" * 70)
    print("RESULTADO: funcionou. Combinacao aceita:")
    print("  %s" % descrever_perfil(achou))
    print("O robo descobre isso sozinho a cada execucao, entao nao e preciso")
    print("alterar nada. Pode rodar o 2_GERAR_PRAZOS.bat.")
    print("=" * 70)
    return achou


# =====================================================================
# 5. NORMALIZACAO DOS ITENS + DEDUPLICACAO
# =====================================================================

def normalizar_item(bruto, advogado):
    teor = limpar_html(pegar(bruto, CAMPOS_TEOR, ""))
    data_txt = str(pegar(bruto, CAMPOS_DATA_DISP, ""))[:10]
    processo = str(pegar(bruto, CAMPOS_PROCESSO, "")).strip()
    ident = str(pegar(bruto, CAMPOS_ID, "")).strip()
    orgao = str(pegar(bruto, CAMPOS_ORGAO, "")).strip()
    tribunal = str(pegar(bruto, CAMPOS_TRIBUNAL, "")).strip()
    digitos = re.sub(r"\D", "", processo)

    # Se a API nao trouxer identificador, NAO usar so o numero do processo como
    # chave: duas intimacoes diferentes do mesmo processo virariam uma linha so
    # e a segunda sumiria sem ninguem perceber. Nesse caso a impressao digital
    # do proprio teor entra na chave.
    if ident:
        chave = "%s|%s" % (ident, digitos)
    else:
        impressao = hashlib.sha1(
            normalizar(teor)[:4000].encode("utf-8")).hexdigest()[:12]
        chave = "sem-id-%s|%s|%s" % (impressao, data_txt, digitos)

    return {
        "chave": chave,
        "id_comunicacao": ident,
        "numero_processo": processo,
        "data_disponibilizacao": data_txt,
        "tribunal": tribunal,
        "orgao_julgador": orgao,
        "rito": detectar_rito(orgao, tribunal),
        "tipo_comunicacao": str(pegar(bruto, CAMPOS_TIPO, "")).strip(),
        "link": str(pegar(bruto, CAMPOS_LINK, "")).strip(),
        "teor": teor,
        "advogados_captura": [advogado["nome"]],
        "oabs_captura": ["%s/%s" % (advogado["uf"], advogado["oab"])],
    }


# --------------------------------------------------------------------
# Importacao de planilha (segunda fonte, alem do DJEN)
#
# A OAB/SC oferece publicacoes de graca aos inscritos (convenio com a Advise,
# ativacao em liber.adv.br) e a CAASC oferece o CAASC Intimacoes. Ambos
# exportam planilha. Ler essa planilha da ao escritorio uma segunda fonte sem
# custo nenhum, e permite trabalhar mesmo com o DJEN fora do ar.
# --------------------------------------------------------------------

COLUNAS_PROCESSO = ["processo", "numero do processo", "numero processo",
                    "n processo", "num processo", "numeroprocesso", "autos"]
COLUNAS_DATA = ["data de disponibilizacao", "data disponibilizacao",
                "disponibilizacao", "data de publicacao", "data publicacao",
                "publicacao", "data do diario", "data"]
COLUNAS_TEOR = ["teor", "texto", "integra", "conteudo", "publicacao completa",
                "materia", "intimacao", "movimentacao"]
COLUNAS_ORGAO = ["orgao julgador", "orgao", "vara", "juizo", "unidade"]
COLUNAS_TRIB = ["tribunal", "sigla do tribunal", "diario", "origem", "caderno"]
COLUNAS_ADV = ["advogado", "destinatario", "nome do advogado", "nome"]

ORIGEM_PLANILHA = 1899, 12, 30  # como o Excel conta datas


def _achar_coluna(cabecalhos, candidatos):
    """Casa o nome da coluna da planilha com o que precisamos, tolerando
    variacoes de acento, maiuscula e texto extra."""
    normalizados = {c: normalizar(c) for c in cabecalhos}
    for alvo in candidatos:
        for original, limpo in normalizados.items():
            if limpo == alvo:
                return original
    for alvo in candidatos:
        for original, limpo in normalizados.items():
            if alvo in limpo:
                return original
    return None


def converter_data(valor):
    """Aceita 20/07/2026, 2026-07-20 e o numero de serie do Excel."""
    texto = str(valor or "").strip()
    if not texto:
        return ""
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})", texto)
    if m:
        return "%s-%s-%s" % m.groups()
    m = re.match(r"^(\d{1,2})[/-](\d{1,2})[/-](\d{4})", texto)
    if m:
        dia, mes, ano = m.groups()
        return "%s-%02d-%02d" % (ano, int(mes), int(dia))
    if re.match(r"^\d+(\.\d+)?$", texto):  # numero de serie do Excel
        try:
            base = date(*ORIGEM_PLANILHA)
            return (base + timedelta(days=int(float(texto)))).isoformat()
        except (ValueError, OverflowError):
            return ""
    return ""


def _ler_csv(caminho):
    for codificacao in ("utf-8-sig", "latin-1"):
        try:
            with open(caminho, "r", encoding=codificacao, newline="") as f:
                amostra = f.read(4096)
                f.seek(0)
                separador = ";" if amostra.count(";") >= amostra.count(",") else ","
                return [dict(l) for l in csv.DictReader(f, delimiter=separador)]
        except UnicodeDecodeError:
            continue
    raise ValueError("nao consegui ler o arquivo %s" % caminho)


def _ler_xlsx(caminho):
    import xml.etree.ElementTree as ET
    import zipfile

    ns = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
    with zipfile.ZipFile(caminho) as z:
        textos = []
        if "xl/sharedStrings.xml" in z.namelist():
            raiz = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in raiz.findall(ns + "si"):
                textos.append("".join(t.text or "" for t in si.iter(ns + "t")))

        planilhas = sorted(n for n in z.namelist()
                           if n.startswith("xl/worksheets/sheet") and n.endswith(".xml"))
        if not planilhas:
            raise ValueError("planilha vazia: %s" % caminho)
        raiz = ET.fromstring(z.read(planilhas[0]))

        linhas = []
        for linha in raiz.iter(ns + "row"):
            celulas = {}
            for c in linha.findall(ns + "c"):
                coluna = "".join(ch for ch in (c.get("r") or "") if ch.isalpha())
                tipo = c.get("t")
                v = c.find(ns + "v")
                if tipo == "s" and v is not None and v.text is not None:
                    indice = int(v.text)
                    valor = textos[indice] if indice < len(textos) else ""
                elif tipo == "inlineStr":
                    valor = "".join(t.text or "" for t in c.iter(ns + "t"))
                else:
                    valor = (v.text or "") if v is not None else ""
                celulas[coluna] = valor
            linhas.append(celulas)

    if not linhas:
        return []
    cabecalho = linhas[0]
    registros = []
    for linha in linhas[1:]:
        if not any(str(x).strip() for x in linha.values()):
            continue
        registros.append({cabecalho.get(col, col): valor
                          for col, valor in linha.items()})
    return registros


def importar_planilha(caminho):
    """Le uma planilha exportada por outro servico e devolve itens ja
    normalizados, prontos para o mesmo tratamento dado ao que vem do DJEN."""
    if caminho.lower().endswith((".xlsx", ".xlsm")):
        registros = _ler_xlsx(caminho)
    else:
        registros = _ler_csv(caminho)
    if not registros:
        return []

    cabecalhos = list(registros[0].keys())
    col_teor = _achar_coluna(cabecalhos, COLUNAS_TEOR)
    col_data = _achar_coluna(cabecalhos, COLUNAS_DATA)
    col_proc = _achar_coluna(cabecalhos, COLUNAS_PROCESSO)
    col_orgao = _achar_coluna(cabecalhos, COLUNAS_ORGAO)
    col_trib = _achar_coluna(cabecalhos, COLUNAS_TRIB)
    col_adv = _achar_coluna(cabecalhos, COLUNAS_ADV)

    faltando = [nome for nome, col in
                (("teor da publicacao", col_teor), ("data", col_data))
                if col is None]
    if faltando:
        raise ValueError(
            "a planilha nao tem coluna de %s. Colunas encontradas: %s"
            % (" e de ".join(faltando), ", ".join(str(c) for c in cabecalhos)))

    itens = []
    for reg in registros:
        teor = limpar_html(reg.get(col_teor, ""))
        if not teor.strip():
            continue
        nome_adv = str(reg.get(col_adv, "") or "").strip() if col_adv else ""
        advogado = {"nome": nome_adv or "(informado na planilha)",
                    "oab": "", "uf": ""}
        bruto = {
            "texto": teor,
            "data_disponibilizacao": converter_data(reg.get(col_data, "")),
            "numero_processo": str(reg.get(col_proc, "") or "") if col_proc else "",
            "nomeOrgao": str(reg.get(col_orgao, "") or "") if col_orgao else "",
            "siglaTribunal": str(reg.get(col_trib, "") or "") if col_trib else "",
        }
        item = normalizar_item(bruto, advogado)
        item["oabs_captura"] = ["planilha importada"]
        itens.append(item)
    return itens


def deduplicar(itens):
    """Mesma intimacao captada pelas duas OABs vira uma linha so."""
    vistos = {}
    ordem = []
    for it in itens:
        chave = it["chave"]
        if chave in vistos:
            alvo = vistos[chave]
            for nome in it["advogados_captura"]:
                if nome not in alvo["advogados_captura"]:
                    alvo["advogados_captura"].append(nome)
            for oab in it["oabs_captura"]:
                if oab not in alvo["oabs_captura"]:
                    alvo["oabs_captura"].append(oab)
        else:
            vistos[chave] = it
            ordem.append(chave)
    return [vistos[k] for k in ordem]


# =====================================================================
# 6. CLASSIFICACAO
# =====================================================================

PROMPT_SISTEMA = """Voce classifica intimacoes judiciais brasileiras publicadas no DJEN
para um escritorio de advocacia previdenciaria (Blumenau/SC).

Responda SOMENTE com um objeto JSON, sem markdown, sem crase, sem explicacao.

Formato exigido:
{
 "tipo_ato": "sentenca|acordao|despacho|ato_ordinatorio|intimacao_laudo|intimacao_pericia|audiencia|cumprimento_sentenca|arquivamento|outro",
 "materia": "especial|pcd|rural|isencao_ir|ipva|outro",
 "ha_prazo": true|false,
 "prazo_dias": numero inteiro ou null,
 "contagem": "dias_uteis|dias_corridos",
 "acao_esperada": "frase curta do que o escritorio precisa fazer",
 "prazo_extraido_do_texto": "trecho LITERAL copiado do teor que menciona o prazo, ou string vazia",
 "confianca": numero entre 0 e 1
}

REGRAS OBRIGATORIAS:
- NUNCA calcule datas. Nao devolva nenhuma data. Apenas quantidade de dias e forma de contagem.
- prazo_extraido_do_texto deve ser copia literal de um trecho do teor. Se voce nao encontrar
  o prazo escrito no texto, devolva ha_prazo=false, prazo_dias=null e trecho vazio.
- Se a publicacao apenas remete a um evento sem dizer o teor, use tipo_ato "outro",
  ha_prazo=false e confianca baixa.
- Prazo processual em rito comum e em dias uteis; prazo de natureza material e em dias corridos.
- Na duvida, baixe a confianca. Errar em silencio e pior do que pedir revisao humana."""


def classificar_com_ia(teor, chave_api):
    corpo = {
        "model": MODELO_IA,
        "max_tokens": 900,
        "system": PROMPT_SISTEMA,
        "messages": [{
            "role": "user",
            "content": "Classifique esta intimacao. Responda so o JSON.\n\n<teor>\n%s\n</teor>"
                       % teor[:12000],
        }],
    }
    req = urllib.request.Request(
        ANTHROPIC_URL,
        data=json.dumps(corpo).encode("utf-8"),
        headers={
            "content-type": "application/json",
            "x-api-key": chave_api,
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=TIMEOUT_SEGUNDOS) as resp:
        dados = json.loads(resp.read().decode("utf-8"))
    texto = "".join(b.get("text", "") for b in dados.get("content", [])
                    if b.get("type") == "text").strip()
    texto = re.sub(r"^```(?:json)?|```$", "", texto, flags=re.M).strip()
    inicio, fim = texto.find("{"), texto.rfind("}")
    if inicio == -1 or fim == -1:
        raise ValueError("resposta da IA nao trouxe JSON: %s" % texto[:200])
    return json.loads(texto[inicio:fim + 1])


def testar_chave_ia():
    """Confere se a chave de classificacao automatica esta funcionando."""
    chave = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    print("Testando a chave de classificacao automatica...\n")
    if not chave:
        print("Nenhuma chave configurada neste computador.")
        print("O robo vai funcionar assim mesmo, mas as intimacoes precisarao")
        print("ser lidas manualmente (arquivo %s)." % ARQUIVO_CLASSIFICACOES)
        return 1

    print("Chave encontrada (termina em ...%s)." % chave[-4:])
    teor = ("Fica a parte autora intimada do laudo pericial juntado ao evento 58, "
            "para manifestacao no prazo de 15 (quinze) dias uteis.")
    try:
        resultado = sanear_classificacao(classificar_com_ia(teor, chave))
    except urllib.error.HTTPError as e:
        print("\nA chave foi RECUSADA. Codigo do erro: HTTP %s (%s)." % (e.code, e.reason))
        if e.code in (401, 403):
            print("Isso quer dizer chave invalida, apagada ou sem permissao.")
            print("Gere outra em https://console.anthropic.com e rode de novo.")
        elif e.code == 429:
            print("Isso quer dizer limite de uso atingido ou creditos zerados.")
        else:
            print("Mande esta mensagem para o Marcelo.")
        return 1
    except Exception as e:
        print("\nNao foi possivel testar: %s" % e)
        print("Pode ser bloqueio de rede. Mande esta mensagem para o Marcelo.")
        return 1

    print("\nFUNCIONOU. A classificacao de teste devolveu:")
    print("  tipo do ato ...: %s" % resultado["tipo_ato"])
    print("  materia .......: %s" % resultado["materia"])
    print("  tem prazo .....: %s" % ("sim" if resultado["ha_prazo"] else "nao"))
    print("  prazo em dias .: %s" % (resultado["prazo_dias"] or "-"))
    print("  contagem ......: %s" % resultado["contagem"])
    print("  confianca .....: %.2f" % resultado["confianca"])
    print("\nO robo ja pode rodar sozinho, sem depender de leitura manual.")
    return 0


def sanear_classificacao(c):
    """Forca os conjuntos fechados e joga fora qualquer data que a IA devolva."""
    c = dict(c or {})
    saida = {
        "tipo_ato": c.get("tipo_ato") if c.get("tipo_ato") in TIPOS_ATO else "outro",
        "materia": c.get("materia") if c.get("materia") in MATERIAS else "outro",
        "ha_prazo": bool(c.get("ha_prazo")),
        "prazo_dias": None,
        "contagem": c.get("contagem") if c.get("contagem") in CONTAGENS else "dias_uteis",
        "acao_esperada": str(c.get("acao_esperada") or "").strip()[:200],
        "prazo_extraido_do_texto": str(c.get("prazo_extraido_do_texto") or "").strip(),
        "confianca": 0.0,
    }
    try:
        dias = int(c.get("prazo_dias"))
        saida["prazo_dias"] = dias if dias > 0 else None
    except (TypeError, ValueError):
        saida["prazo_dias"] = None
    try:
        conf = float(c.get("confianca"))
        saida["confianca"] = min(max(conf, 0.0), 1.0)
    except (TypeError, ValueError):
        saida["confianca"] = 0.0
    return saida


def obter_classificacoes(itens, usar_ia):
    """Com chave de API classifica na hora; sem chave, le classificacoes.json."""
    resultado = {}
    if usar_ia:
        chave_api = os.environ["ANTHROPIC_API_KEY"]
        for i, it in enumerate(itens, 1):
            print("   classificando %d/%d ..." % (i, len(itens)))
            try:
                resultado[it["chave"]] = sanear_classificacao(
                    classificar_com_ia(it["teor"], chave_api))
            except Exception as e:
                print("   FALHOU na %d: %s -> vai para revisao" % (i, e))
                resultado[it["chave"]] = sanear_classificacao({
                    "acao_esperada": "classificacao automatica falhou",
                    "confianca": 0.0,
                })
        return resultado

    if not os.path.exists(ARQUIVO_CLASSIFICACOES):
        print("\nSem ANTHROPIC_API_KEY e sem %s." % ARQUIVO_CLASSIFICACOES)
        print("Os teores foram gravados em %s." % ARQUIVO_TEORES)
        print("Classifique-os e grave em %s, depois rode de novo."
              % ARQUIVO_CLASSIFICACOES)
        sys.exit(2)

    with open(ARQUIVO_CLASSIFICACOES, "r", encoding="utf-8") as f:
        arquivo = json.load(f)
    mapa = arquivo.get("classificacoes", arquivo)

    faltando = [it for it in itens if it["chave"] not in mapa]

    # Se NENHUMA intimacao capturada consta do arquivo, ele e de outra rodada
    # (tipicamente a amostra simulada). Gerar a planilha assim produziria um
    # relatorio inteiro sem prazo nenhum - o retrato do erro que este sistema
    # existe para evitar. Melhor parar e dizer o que houve.
    if faltando and len(faltando) == len(itens):
        print("\n" + "=" * 60)
        print("PARADO DE PROPOSITO - nada foi gerado.")
        print("")
        print("O arquivo %s nao corresponde a nenhuma" % ARQUIVO_CLASSIFICACOES)
        print("das %d intimacoes capturadas agora. Ele e de outra rodada." % len(itens))
        print("")
        print("O que fazer: mande o arquivo %s" % ARQUIVO_TEORES)
        print("para o Marcelo e substitua o %s pelo que" % ARQUIVO_CLASSIFICACOES)
        print("ele devolver. Ou configure a leitura automatica com o")
        print("3_CONFIGURAR_CHAVE_IA.bat, e o robo faz sozinho.")
        print("=" * 60)
        sys.exit(2)

    if faltando:
        print("   ATENCAO: %d de %d intimacoes nao constam do arquivo de"
              % (len(faltando), len(itens)))
        print("   classificacao. Elas vao para revisao humana obrigatoria.")

    for it in itens:
        resultado[it["chave"]] = sanear_classificacao(mapa.get(it["chave"]))
        if it["chave"] not in mapa:
            resultado[it["chave"]]["acao_esperada"] = "sem classificacao no arquivo"
    return resultado


# =====================================================================
# 7. APLICACAO DAS TRES REGRAS INVIOLAVEIS
# =====================================================================

def montar_linha(item, classificacao, hoje):
    motivos = []
    c = dict(classificacao)

    # REGRA 2 - antialucinacao
    if c["ha_prazo"]:
        if not trecho_confere(item["teor"], c["prazo_extraido_do_texto"]):
            motivos.append("trecho do prazo nao encontrado no teor (antialucinacao)")
            c["ha_prazo"] = False
            c["prazo_dias"] = None
        elif not c["prazo_dias"]:
            motivos.append("classificacao diz que ha prazo mas nao informou os dias")
            c["ha_prazo"] = False

    # REGRA 1 - a data e calculada aqui, em codigo
    prazo_fatal = ""
    dias_restantes = ""
    data_pub = ""
    try:
        disp = datetime.strptime(item["data_disponibilizacao"], "%Y-%m-%d").date()
    except (ValueError, TypeError):
        disp = None
        motivos.append("data de disponibilizacao ausente ou ilegivel")

    if disp:
        try:
            pub = data_publicacao_djen(disp, item["rito"])
            data_pub = pub.isoformat()
            if c["ha_prazo"] and c["prazo_dias"]:
                fatal = calcular_prazo_fatal(pub, c["prazo_dias"],
                                             c["contagem"], item["rito"])
                prazo_fatal = fatal.isoformat()
                dias_restantes = (fatal - hoje).days
        except AnoSemFeriadosError as e:
            motivos.append("motor de prazo: %s" % e)
            prazo_fatal = ""
            dias_restantes = ""

    # prazo ja vencido nunca sai como OK - a controladoria precisa ver
    if dias_restantes != "" and dias_restantes < 0:
        motivos.append("prazo ja vencido na data em que o relatorio foi gerado")

    # REGRA 3 - sentenca e acordao sempre revisao obrigatoria
    if c["tipo_ato"] in TIPOS_REVISAO_OBRIGATORIA:
        status = "REVISAO OBRIGATORIA"
        motivos.append("sentenca/acordao sempre passa por advogado")
    elif motivos:
        status = "REVISAR"
    elif c["confianca"] < CONFIANCA_MINIMA:
        status = "REVISAR"
        motivos.append("confianca %.2f abaixo de %.2f" % (c["confianca"], CONFIANCA_MINIMA))
    elif not c["ha_prazo"]:
        status = "REVISAR"
        motivos.append("classificada como sem prazo - conferir para nao sumir")
    else:
        status = "OK"

    if c["confianca"] < CONFIANCA_MINIMA and "confianca" not in " ".join(motivos):
        motivos.append("confianca %.2f abaixo de %.2f" % (c["confianca"], CONFIANCA_MINIMA))

    return {
        "prazo_fatal": prazo_fatal,
        "dias_restantes": dias_restantes,
        "status": status,
        "advogados": " / ".join(item["advogados_captura"]),
        "oabs": " / ".join(item["oabs_captura"]),
        "tribunal": item["tribunal"],
        "orgao_julgador": item["orgao_julgador"],
        "rito": "JEF" if item["rito"] == "jef" else "comum",
        "numero_processo": item["numero_processo"],
        "data_disponibilizacao": item["data_disponibilizacao"],
        "data_publicacao": data_pub,
        "tipo_ato": c["tipo_ato"],
        "materia": c["materia"],
        "ha_prazo": "sim" if c["ha_prazo"] else "nao",
        "prazo_dias": c["prazo_dias"] if c["prazo_dias"] else "",
        "contagem": "dias uteis" if c["contagem"] == "dias_uteis" else "dias corridos",
        "acao_esperada": c["acao_esperada"],
        "motivo_revisao": "; ".join(motivos),
        "confianca": ("%.2f" % c["confianca"]).replace(".", ","),
        "prazo_extraido_do_texto": c["prazo_extraido_do_texto"],
        "id_comunicacao": item["id_comunicacao"],
        "link": item["link"],
        "teor_resumo": re.sub(r"\s+", " ", item["teor"])[:600],
    }


COLUNAS = [
    ("prazo_fatal", "PRAZO FATAL"),
    ("dias_restantes", "DIAS RESTANTES"),
    ("status", "STATUS"),
    ("acao_esperada", "ACAO ESPERADA"),
    ("numero_processo", "PROCESSO"),
    ("advogados", "ADVOGADO(S)"),
    ("oabs", "OAB"),
    ("tribunal", "TRIBUNAL"),
    ("orgao_julgador", "ORGAO JULGADOR"),
    ("rito", "RITO"),
    ("tipo_ato", "TIPO DE ATO"),
    ("materia", "MATERIA"),
    ("ha_prazo", "TEM PRAZO"),
    ("prazo_dias", "PRAZO (DIAS)"),
    ("contagem", "CONTAGEM"),
    ("data_disponibilizacao", "DISPONIBILIZADO EM"),
    ("data_publicacao", "PUBLICADO EM"),
    ("confianca", "CONFIANCA"),
    ("motivo_revisao", "MOTIVO DA REVISAO"),
    ("prazo_extraido_do_texto", "TRECHO DO PRAZO"),
    ("id_comunicacao", "ID DJEN"),
    ("link", "LINK"),
    ("teor_resumo", "TEOR (RESUMO)"),
]


def ordenar(linhas):
    """Do prazo mais proximo para o mais distante. Sem prazo vai para o fim."""
    def chave(l):
        return (0, l["prazo_fatal"]) if l["prazo_fatal"] else (1, "9999-99-99")
    return sorted(linhas, key=chave)


def gravar_csv(linhas, caminho):
    with open(caminho, "w", encoding="utf-8-sig", newline="") as f:
        escritor = csv.writer(f, delimiter=";", quoting=csv.QUOTE_MINIMAL)
        escritor.writerow([rotulo for _, rotulo in COLUNAS])
        for l in linhas:
            escritor.writerow([l.get(campo, "") for campo, _ in COLUNAS])


# =====================================================================
# 8. PROGRAMA PRINCIPAL
# =====================================================================

def capturar(args):
    fim = date.today()
    ini = fim - timedelta(days=args.dias)
    itens = []

    if args.importar:
        print("Lendo a planilha %s" % args.importar)
        itens = importar_planilha(args.importar)
        print("%d publicacoes lidas da planilha." % len(itens))
        return itens, "planilha importada: %s" % args.importar

    if args.offline:
        print("MODO OFFLINE: lendo %s (dados de amostra, NAO sao intimacoes reais)"
              % args.offline)
        with open(args.offline, "r", encoding="utf-8") as f:
            amostra = json.load(f)
        for bloco in amostra.get("capturas", []):
            adv = bloco["advogado"]
            for bruto in bloco["itens"]:
                itens.append(normalizar_item(bruto, adv))
        return itens, "modo offline: %s" % args.offline

    print("Consultando DJEN de %s a %s\n"
          % (ini.strftime("%d/%m/%Y"), fim.strftime("%d/%m/%Y")))
    print(" Descobrindo o formato aceito pela API...")
    perfil, motivo = descobrir_perfil(ADVOGADOS[0], ini, fim)
    if perfil is None:
        print("\n ERRO: nao foi possivel falar com o DJEN.")
        print(" Motivo: %s" % motivo)
        print(" Rode o 1_TESTAR_CONEXAO.bat e mande o diagnostico.txt.")
        return itens, "falhou: %s" % motivo

    resumo = "%s (%s)" % (descrever_perfil(perfil), motivo)
    print("")
    for adv in ADVOGADOS:
        print(" %s - OAB/%s %s" % (adv["nome"], adv["uf"], adv["oab"]))
        try:
            brutos = consultar_djen(adv, ini, fim, perfil)
        except urllib.error.HTTPError as e:
            print("   ERRO HTTP %s (%s). Rode o 1_TESTAR_CONEXAO.bat."
                  % (e.code, e.reason))
            continue
        except Exception as e:
            print("   ERRO DE REDE: %s" % e)
            print("   Rode o 1_TESTAR_CONEXAO.bat e mande o diagnostico.txt.")
            continue
        print("   %d comunicacoes" % len(brutos))
        for bruto in brutos:
            itens.append(normalizar_item(bruto, adv))
        time.sleep(PAUSA_ENTRE_CHAMADAS)
    return itens, resumo


def main():
    p = argparse.ArgumentParser(description="Prazos do DJEN - Escritorio Morestoni")
    p.add_argument("--dias", type=int, default=DIAS_JANELA_PADRAO,
                   help="janela de dias para tras (padrao 30)")
    p.add_argument("--sem-classificacao", action="store_true",
                   help="so captura e conta, sem classificar nem calcular prazo")
    p.add_argument("--importar", metavar="PLANILHA",
                   help="le uma planilha (.csv ou .xlsx) exportada por outro "
                        "servico, como a Advise da OAB/SC, em vez do DJEN")
    p.add_argument("--offline", metavar="ARQUIVO",
                   help="le itens de um arquivo em vez de consultar a API")
    p.add_argument("--saida", default="prazos.csv", help="arquivo CSV de saida")
    p.add_argument("--diagnostico", action="store_true",
                   help="descobre os nomes de parametro que a API aceita")
    p.add_argument("--testar-chave", action="store_true",
                   help="confere se a chave de classificacao automatica funciona")
    args = p.parse_args()

    if args.diagnostico:
        diagnostico_parametros()
        return 0

    if args.testar_chave:
        return testar_chave_ia()

    itens, resumo_captura = capturar(args)
    print("\nTotal capturado (com duplicatas): %d" % len(itens))
    itens = deduplicar(itens)
    print("Depois de remover duplicatas: %d" % len(itens))

    with open(ARQUIVO_TEORES, "w", encoding="utf-8") as f:
        json.dump({"gerado_em": datetime.now().isoformat(timespec="seconds"),
                   "parametros_da_api": resumo_captura,
                   "itens": itens}, f, ensure_ascii=False, indent=2)
    print("Teores gravados em %s" % ARQUIVO_TEORES)

    if args.sem_classificacao:
        print("\n--- CONFERENCIA DA CAPTURA (sem classificacao) ---")
        for it in itens:
            print(" %s | %s | %s | %d caracteres de teor" % (
                it["data_disponibilizacao"] or "sem data",
                it["numero_processo"] or "sem processo",
                (it["orgao_julgador"] or "sem orgao")[:45],
                len(it["teor"])))
        sem_teor = sum(1 for it in itens if len(it["teor"]) < 40)
        print("\nComunicacoes com teor muito curto ou vazio: %d" % sem_teor)
        return 0

    if not itens:
        print("Nada para classificar.")
        return 0

    usar_ia = bool(os.environ.get("ANTHROPIC_API_KEY"))
    print("\nClassificando %s" % ("pela API da Anthropic (%s)" % MODELO_IA
                                  if usar_ia else "pelo arquivo %s" % ARQUIVO_CLASSIFICACOES))
    classificacoes = obter_classificacoes(itens, usar_ia)

    hoje = date.today()
    linhas = ordenar([montar_linha(it, classificacoes[it["chave"]], hoje)
                      for it in itens])
    gravar_csv(linhas, args.saida)

    com_prazo = [l for l in linhas if l["prazo_fatal"]]
    revisao = [l for l in linhas if l["status"] != "OK"]
    print("\n--- RESUMO ---")
    print("Linhas no CSV: %d" % len(linhas))
    print("Com prazo fatal calculado: %d" % len(com_prazo))
    print("Marcadas para revisao humana: %d" % len(revisao))
    if com_prazo:
        print("Prazo mais proximo: %s (%s dias) - %s" % (
            com_prazo[0]["prazo_fatal"], com_prazo[0]["dias_restantes"],
            com_prazo[0]["numero_processo"]))
    print("Arquivo gerado: %s" % args.saida)
    return 0


if __name__ == "__main__":
    sys.exit(main())
