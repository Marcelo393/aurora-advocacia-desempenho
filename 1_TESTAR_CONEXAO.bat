@echo off
setlocal
title Passo 1 - Testar conexao com o DJEN
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
  echo ==========================================================
  echo  O Python nao esta instalado neste computador.
  echo.
  echo  Baixe em https://www.python.org/downloads/
  echo  Na primeira tela, MARQUE a caixinha "Add Python to PATH"
  echo  e depois rode este arquivo de novo.
  echo ==========================================================
  echo.
  pause
  exit /b 1
)

echo.
echo ==========================================================
echo  Testando o acesso ao DJEN e descobrindo os parametros...
echo  Isso leva menos de um minuto.
echo ==========================================================
echo.

%PY% djen_prazos.py --diagnostico > diagnostico.txt 2>&1

echo.
echo Pronto. O resultado foi gravado no arquivo diagnostico.txt
echo Abrindo o arquivo. Mande ele para o Marcelo.
echo.
start "" notepad diagnostico.txt
pause
