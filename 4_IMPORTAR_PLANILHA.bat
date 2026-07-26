@echo off
setlocal
title Passo 4 (alternativo) - Gerar prazos a partir de uma planilha
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

set "PLANILHA=%~1"

if not defined PLANILHA (
  echo.
  echo ==========================================================
  echo  GERAR PRAZOS A PARTIR DE UMA PLANILHA
  echo.
  echo  Serve para a planilha baixada do Sistema Advise (o
  echo  servico gratuito da OAB/SC) ou do CAASC Intimacoes.
  echo  Aceita arquivos .csv e .xlsx.
  echo.
  echo  DICA: da para simplesmente arrastar a planilha para
  echo  cima deste atalho, que ele ja abre com o arquivo certo.
  echo ==========================================================
  echo.
  set /p PLANILHA=Arraste a planilha aqui, ou digite o caminho:
)

if not defined PLANILHA (
  echo.
  echo Cancelado. Nada foi alterado.
  echo.
  pause
  exit /b 0
)

set "PLANILHA=%PLANILHA:"=%"

if not exist "%PLANILHA%" (
  echo.
  echo Nao encontrei o arquivo:
  echo   %PLANILHA%
  echo Confira se o caminho esta certo e tente de novo.
  echo.
  pause
  exit /b 1
)

echo.
echo Lendo a planilha...
echo.
%PY% djen_prazos.py --importar "%PLANILHA%"
set "CODIGO=%errorlevel%"

if "%CODIGO%"=="2" (
  echo.
  echo ==========================================================
  echo  As publicacoes foram lidas, mas falta a leitura de cada
  echo  uma delas. Mande o teores_capturados.json para o Marcelo,
  echo  ou configure o 3_CONFIGURAR_CHAVE_IA.bat.
  echo ==========================================================
  echo.
  start "" .
  pause
  exit /b 0
)

if not "%CODIGO%"=="0" (
  echo.
  echo Algo deu errado. Tire uma foto desta tela e mande ao Marcelo.
  echo A causa mais comum e a planilha nao ter uma coluna com o
  echo texto da publicacao ou com a data.
  echo.
  pause
  exit /b 1
)

echo.
echo Pronto. Abrindo a planilha prazos.csv no Excel...
start "" prazos.csv
pause
