@echo off
setlocal
title Passo 2 - Gerar a planilha de prazos
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
echo  Buscando as intimacoes dos ultimos 30 dias no DJEN...
echo ==========================================================
echo.

%PY% djen_prazos.py
set "CODIGO=%errorlevel%"

if "%CODIGO%"=="2" (
  echo.
  echo ==========================================================
  echo  As intimacoes foram capturadas, mas ainda falta a
  echo  leitura de cada uma delas.
  echo.
  echo  Mande o arquivo teores_capturados.json para o Marcelo.
  echo  Ele devolve o arquivo classificacoes.json e voce roda
  echo  este mesmo atalho de novo.
  echo ==========================================================
  echo.
  start "" .
  pause
  exit /b 0
)

if not "%CODIGO%"=="0" (
  echo.
  echo Algo deu errado. Tire uma foto desta tela e mande ao Marcelo.
  echo.
  pause
  exit /b 1
)

echo.
echo Pronto. Abrindo a planilha prazos.csv no Excel...
start "" prazos.csv
pause
