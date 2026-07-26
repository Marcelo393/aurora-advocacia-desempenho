#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Testes do motor de prazo e do filtro antialucinacao.
Rode com:  python3 test_prazos.py
"""

import unittest
from datetime import date

from djen_prazos import (
    AnoSemFeriadosError,
    calcular_prazo_fatal,
    data_publicacao_djen,
    deduplicar,
    detectar_rito,
    montar_linha,
    normalizar_item,
    sanear_classificacao,
    trecho_confere,
)


class TestMotorDePrazo(unittest.TestCase):
    """Casos exigidos pelo escritorio."""

    def test_15_dias_uteis_de_07_08_2026_pula_dia_do_advogado(self):
        # 07/08/2026 e sexta. Comeca segunda 10/08. 11/08 e dia do advogado.
        self.assertEqual(
            calcular_prazo_fatal(date(2026, 8, 7), 15, "dias_uteis", "comum"),
            date(2026, 8, 31),
        )

    def test_15_dias_uteis_de_20_07_2026(self):
        self.assertEqual(
            calcular_prazo_fatal(date(2026, 7, 20), 15, "dias_uteis", "comum"),
            date(2026, 8, 10),
        )

    def test_prazo_que_alcanca_2028_levanta_erro(self):
        with self.assertRaises(AnoSemFeriadosError):
            calcular_prazo_fatal(date(2027, 12, 1), 30, "dias_uteis", "comum")

    def test_publicacao_ja_em_ano_nao_cadastrado_levanta_erro(self):
        with self.assertRaises(AnoSemFeriadosError):
            calcular_prazo_fatal(date(2028, 3, 1), 5, "dias_uteis", "comum")

    def test_exclui_dia_do_comeco_inclui_o_do_vencimento(self):
        # 1 dia util publicado numa segunda vence na terca.
        self.assertEqual(
            calcular_prazo_fatal(date(2026, 7, 20), 1, "dias_uteis", "comum"),
            date(2026, 7, 21),
        )

    def test_vencimento_em_dia_nao_util_prorroga(self):
        # 5 dias corridos de 03/07/2026 (sexta): inicio 06/07, dia 5 = 10/07 (sexta).
        # Com 4 dias corridos o dia 4 cai em 09/07 (quinta) - sem prorrogacao.
        # Aqui: 6 dias corridos -> dia 6 = 11/07 (sabado) -> prorroga p/ 13/07.
        self.assertEqual(
            calcular_prazo_fatal(date(2026, 7, 3), 6, "dias_corridos", "comum"),
            date(2026, 7, 13),
        )

    def test_recesso_suspende_no_rito_comum(self):
        # 15/12/2026 (terca), 5 dias uteis. Recesso de 20/12 a 20/01 suspende.
        self.assertEqual(
            calcular_prazo_fatal(date(2026, 12, 15), 5, "dias_uteis", "comum"),
            date(2027, 1, 22),
        )

    def test_recesso_nao_suspende_no_jef(self):
        self.assertEqual(
            calcular_prazo_fatal(date(2026, 12, 15), 5, "dias_uteis", "jef"),
            date(2026, 12, 22),
        )

    def test_publicacao_djen_e_o_dia_util_seguinte(self):
        # 07/08/2026 e sexta -> publica na segunda 10/08.
        self.assertEqual(data_publicacao_djen(date(2026, 8, 7)), date(2026, 8, 10))
        # vespera do dia do advogado: 10/08 (segunda) -> 12/08 (quarta)
        self.assertEqual(data_publicacao_djen(date(2026, 8, 10)), date(2026, 8, 12))

    def test_deteccao_de_rito(self):
        self.assertEqual(detectar_rito("1º JEF de Blumenau"), "jef")
        self.assertEqual(detectar_rito("Juizado Especial Federal de Blumenau"), "jef")
        self.assertEqual(detectar_rito("2ª Vara Federal de Blumenau"), "comum")
        self.assertEqual(detectar_rito("TRF4 - 6ª Turma"), "comum")

    def test_entradas_invalidas(self):
        with self.assertRaises(ValueError):
            calcular_prazo_fatal(date(2026, 7, 20), 0, "dias_uteis", "comum")
        with self.assertRaises(ValueError):
            calcular_prazo_fatal(date(2026, 7, 20), 5, "semanas", "comum")
        with self.assertRaises(ValueError):
            calcular_prazo_fatal("2026-07-20", 5, "dias_uteis", "comum")


TEOR_LAUDO = (
    "Fica a parte autora intimada do laudo pericial juntado ao evento 58, "
    "para manifestacao no prazo de 15 (quinze) dias uteis."
)


class TestAntialucinacao(unittest.TestCase):

    def test_trecho_que_existe_no_teor_passa(self):
        self.assertTrue(trecho_confere(TEOR_LAUDO, "no prazo de 15 (quinze) dias uteis"))

    def test_trecho_ignora_acento_maiuscula_e_pontuacao(self):
        self.assertTrue(trecho_confere(TEOR_LAUDO, "PRAZO DE 15 (QUINZE) DIAS ÚTEIS."))

    def test_trecho_inventado_nao_passa(self):
        self.assertFalse(trecho_confere(TEOR_LAUDO, "no prazo de 30 (trinta) dias uteis"))

    def test_trecho_vazio_nao_passa(self):
        self.assertFalse(trecho_confere(TEOR_LAUDO, ""))

    def _item(self, teor=TEOR_LAUDO, orgao="1º JEF de Blumenau"):
        return {
            "chave": "x|1", "id_comunicacao": "x", "numero_processo": "5000000-00.2026.4.04.7205",
            "data_disponibilizacao": "2026-07-20", "tribunal": "TRF4",
            "orgao_julgador": orgao, "rito": detectar_rito(orgao),
            "tipo_comunicacao": "Intimacao", "link": "", "teor": teor,
            "advogados_captura": ["Teste"], "oabs_captura": ["SC/11666"],
        }

    def test_prazo_inventado_e_descartado_e_vai_para_revisao(self):
        classificacao = sanear_classificacao({
            "tipo_ato": "intimacao_laudo", "materia": "especial", "ha_prazo": True,
            "prazo_dias": 30, "contagem": "dias_uteis",
            "acao_esperada": "elaborar manifestacao ao laudo pericial",
            "prazo_extraido_do_texto": "no prazo de 30 (trinta) dias uteis",
            "confianca": 0.99,
        })
        linha = montar_linha(self._item(), classificacao, date(2026, 7, 26))
        self.assertEqual(linha["prazo_fatal"], "")
        self.assertEqual(linha["ha_prazo"], "nao")
        self.assertEqual(linha["status"], "REVISAR")
        self.assertIn("antialucinacao", linha["motivo_revisao"])

    def test_prazo_verdadeiro_e_calculado(self):
        classificacao = sanear_classificacao({
            "tipo_ato": "intimacao_laudo", "materia": "especial", "ha_prazo": True,
            "prazo_dias": 15, "contagem": "dias_uteis",
            "acao_esperada": "elaborar manifestacao ao laudo pericial",
            "prazo_extraido_do_texto": "no prazo de 15 (quinze) dias uteis",
            "confianca": 0.95,
        })
        linha = montar_linha(self._item(), classificacao, date(2026, 7, 26))
        # disponibilizado 20/07/2026 (segunda) -> publicado 21/07 -> comeca 22/07
        # -> 15 dias uteis, pulando 11/08 (dia do advogado) -> 12/08
        self.assertEqual(linha["data_publicacao"], "2026-07-21")
        self.assertEqual(linha["prazo_fatal"], "2026-08-12")
        self.assertEqual(linha["status"], "OK")


class TestRegrasDeRevisao(unittest.TestCase):

    def _linha(self, tipo, confianca=0.99):
        item = {
            "chave": "y|2", "id_comunicacao": "y", "numero_processo": "5000001-00.2026.4.04.7205",
            "data_disponibilizacao": "2026-07-20", "tribunal": "TRF4",
            "orgao_julgador": "2ª Vara Federal de Blumenau", "rito": "comum",
            "tipo_comunicacao": "Sentenca", "link": "",
            "teor": "Julgo procedente o pedido. Prazo recursal de 15 (quinze) dias uteis.",
            "advogados_captura": ["Teste"], "oabs_captura": ["SC/11666"],
        }
        c = sanear_classificacao({
            "tipo_ato": tipo, "materia": "especial", "ha_prazo": True,
            "prazo_dias": 15, "contagem": "dias_uteis",
            "acao_esperada": "avaliar recurso",
            "prazo_extraido_do_texto": "Prazo recursal de 15 (quinze) dias uteis",
            "confianca": confianca,
        })
        return montar_linha(item, c, date(2026, 7, 26))

    def test_sentenca_sempre_revisao_obrigatoria(self):
        linha = self._linha("sentenca")
        self.assertEqual(linha["status"], "REVISAO OBRIGATORIA")
        self.assertNotEqual(linha["prazo_fatal"], "")  # o prazo continua calculado

    def test_acordao_sempre_revisao_obrigatoria(self):
        self.assertEqual(self._linha("acordao")["status"], "REVISAO OBRIGATORIA")

    def test_confianca_baixa_vai_para_revisao(self):
        linha = self._linha("despacho", confianca=0.80)
        self.assertEqual(linha["status"], "REVISAR")
        self.assertIn("confianca", linha["motivo_revisao"])

    def test_sem_prazo_tambem_vai_para_revisao(self):
        item = {
            "chave": "z|3", "id_comunicacao": "z", "numero_processo": "5000002-00.2026.4.04.7205",
            "data_disponibilizacao": "2026-07-20", "tribunal": "TRF4",
            "orgao_julgador": "1º JEF de Blumenau", "rito": "jef",
            "tipo_comunicacao": "Intimacao", "link": "",
            "teor": "Fica a parte intimada do inteiro teor do evento 42.",
            "advogados_captura": ["Teste"], "oabs_captura": ["SC/11666"],
        }
        c = sanear_classificacao({
            "tipo_ato": "outro", "materia": "outro", "ha_prazo": False,
            "prazo_dias": None, "contagem": "dias_uteis",
            "acao_esperada": "abrir o processo no e-Proc e ler o evento 42",
            "prazo_extraido_do_texto": "", "confianca": 0.9,
        })
        linha = montar_linha(item, c, date(2026, 7, 26))
        self.assertEqual(linha["status"], "REVISAR")


class TestDeduplicacao(unittest.TestCase):
    """A duplicata some; a intimacao diferente NUNCA some."""

    ERNESTO = {"nome": "Ernesto Zulmir Morestoni", "oab": "11666", "uf": "SC"}
    CARLOS = {"nome": "Carlos Oscar Krueger", "oab": "27320", "uf": "SC"}

    def bruto(self, texto, ident=None, data="2026-07-20"):
        item = {
            "numero_processo": "5001234-56.2026.4.04.7205",
            "data_disponibilizacao": data,
            "siglaTribunal": "TRF4",
            "nomeOrgao": "1º JEF de Blumenau",
            "texto": texto,
        }
        if ident:
            item["hash"] = ident
        return item

    def test_mesma_intimacao_nas_duas_oabs_vira_uma_linha(self):
        itens = [
            normalizar_item(self.bruto("Fica intimado do laudo.", "abc"), self.ERNESTO),
            normalizar_item(self.bruto("Fica intimado do laudo.", "abc"), self.CARLOS),
        ]
        resultado = deduplicar(itens)
        self.assertEqual(len(resultado), 1)
        self.assertEqual(len(resultado[0]["advogados_captura"]), 2)

    def test_sem_identificador_duas_intimacoes_do_mesmo_processo_nao_somem(self):
        # O caso perigoso: se a API nao mandar identificador e a chave fosse so
        # o numero do processo, a segunda intimacao desapareceria calada.
        itens = [
            normalizar_item(self.bruto("Fica intimado do laudo pericial."), self.ERNESTO),
            normalizar_item(self.bruto("Fica intimado da sentenca."), self.ERNESTO),
        ]
        self.assertEqual(len(deduplicar(itens)), 2)

    def test_sem_identificador_a_duplicata_real_ainda_e_removida(self):
        itens = [
            normalizar_item(self.bruto("Fica intimado do laudo pericial."), self.ERNESTO),
            normalizar_item(self.bruto("Fica intimado do laudo pericial."), self.CARLOS),
        ]
        resultado = deduplicar(itens)
        self.assertEqual(len(resultado), 1)
        self.assertEqual(len(resultado[0]["oabs_captura"]), 2)

    def test_mesmo_teor_em_datas_diferentes_conta_como_duas(self):
        itens = [
            normalizar_item(self.bruto("Fica intimado.", data="2026-07-20"), self.ERNESTO),
            normalizar_item(self.bruto("Fica intimado.", data="2026-07-27"), self.ERNESTO),
        ]
        self.assertEqual(len(deduplicar(itens)), 2)


class TestSaneamento(unittest.TestCase):

    def test_ia_nao_consegue_injetar_data(self):
        c = sanear_classificacao({
            "tipo_ato": "despacho", "materia": "rural", "ha_prazo": True,
            "prazo_dias": 5, "contagem": "dias_uteis", "acao_esperada": "x",
            "prazo_extraido_do_texto": "prazo de 5 dias",
            "confianca": 0.9,
            "prazo_fatal": "2026-12-31", "data_vencimento": "2026-12-31",
        })
        self.assertNotIn("prazo_fatal", c)
        self.assertNotIn("data_vencimento", c)

    def test_valores_fora_da_lista_viram_outro(self):
        c = sanear_classificacao({"tipo_ato": "peticao", "materia": "trabalhista",
                                  "contagem": "meses", "confianca": "abc",
                                  "prazo_dias": "muitos"})
        self.assertEqual(c["tipo_ato"], "outro")
        self.assertEqual(c["materia"], "outro")
        self.assertEqual(c["contagem"], "dias_uteis")
        self.assertEqual(c["confianca"], 0.0)
        self.assertIsNone(c["prazo_dias"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
