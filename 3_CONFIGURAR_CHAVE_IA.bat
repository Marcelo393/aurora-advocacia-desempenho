@echo off
setlocal
title Passo 3 (opcional) - Configurar a leitura automatica das intimacoes
cd /d "%~dp0"

set "PY="
where py >nul 2>&1
if not errorlevel 1 set "PY=py -3"
if not defined PY (
  where python >nul 2>&1
  if not errorlevel 1 set "PY=python"
)

if not defined PY (
  echo.
  echo O Python nao esta instalado neste computador.
  echo Baixe em https://www.python.org/downloads/ marcando
  echo a caixinha "Add Python to PATH" e rode de novo.
  echo.
  pause
  exit /b 1
)

echo.
echo ==========================================================
echo  LEITURA AUTOMATICA DAS INTIMACOES (opcional)
echo.
echo  Sem isto, o robo captura as intimacoes mas a leitura de
echo  cada uma precisa ser feita a mao.
echo.
echo  Com isto, ele faz o servico inteiro sozinho. O custo fica
echo  em torno de tres centavos por intimacao.
echo.
echo  A chave se pega em https://console.anthropic.com
echo  Ela e uma sequencia longa que comeca com sk-ant-
echo ==========================================================
echo.
set "CHAVE="
set /p CHAVE=Cole aqui a chave e tecle Enter (ou so Enter para cancelar):

if not defined CHAVE (
  echo.
  echo Cancelado. Nada foi alterado.
  echo.
  pause
  exit /b 0
)

setx ANTHROPIC_API_KEY "%CHAVE%" >nul
set "ANTHROPIC_API_KEY=%CHAVE%"

echo.
echo Chave guardada neste computador. Agora vamos testar de verdade.
echo.
%PY% djen_prazos.py --testar-chave

echo.
echo ==========================================================
echo  IMPORTANTE: feche esta janela e todas as janelas de
echo  prompt abertas. So depois disso o 2_GERAR_PRAZOS.bat
echo  enxerga a chave.
echo ==========================================================
echo.
pause
