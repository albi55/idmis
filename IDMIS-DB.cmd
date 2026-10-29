@echo off
setlocal EnableExtensions EnableDelayedExpansion
title IDMIS - databaza

set "DB_HOST=192.168.1.50"
set "DB_PORT=5433"
set "DB_NAME=idmis"
set "DB_USER=idmis_admin"

set "PSQL="
for %%v in (18 17 16 15 14 13) do (
  if not defined PSQL if exist "%ProgramFiles%\PostgreSQL\%%v\bin\psql.exe" set "PSQL=%ProgramFiles%\PostgreSQL\%%v\bin\psql.exe"
)
if not defined PSQL for /f "delims=" %%p in ('where psql 2^>nul') do if not defined PSQL set "PSQL=%%p"
if not defined PSQL (
  echo PostgreSQL ^(psql^) nuk u gjet ne kete kompjuter.
  echo Instaloni PostgreSQL nga https://www.postgresql.org/download/windows/ dhe provoni perseri.
  pause
  exit /b 1
)

set "PASSDIR=%APPDATA%\postgresql"
set "PASSFILE=%PASSDIR%\pgpass.conf"
set "KEY=%DB_HOST%:%DB_PORT%:%DB_NAME%:%DB_USER%:"

if /i "%~1"=="/reset" (
  if exist "%PASSFILE%" (
    findstr /v /b /c:"%KEY%" "%PASSFILE%" > "%PASSFILE%.tmp"
    move /y "%PASSFILE%.tmp" "%PASSFILE%" >nul
  )
  echo Fjalekalimi i ruajtur per %DB_USER% u fshi. Nisni perseri IDMIS-DB.cmd.
  pause
  exit /b 0
)

findstr /b /c:"%KEY%" "%PASSFILE%" >nul 2>&1
if errorlevel 1 (
  echo Fjalekalimi per %DB_USER% ruhet nje here ne kete kompjuter.
  set "PW="
  for /f "usebackq delims=" %%p in (`powershell -NoProfile -Command "$s = Read-Host 'Fjalekalimi' -AsSecureString; [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))"`) do set "PW=%%p"
  if not defined PW (
    echo Nuk u dha fjalekalim.
    pause
    exit /b 1
  )
  if not exist "%PASSDIR%" mkdir "%PASSDIR%"
  >>"%PASSFILE%" echo %KEY%!PW!
  set "PW="
)

set "PGPASSFILE=%PASSFILE%"
chcp 1252 >nul
echo Duke u lidhur me %DB_NAME% ne %DB_HOST%:%DB_PORT% si %DB_USER% ...
if "%~1"=="" (
  echo.
  echo Databaza hapet me komanda. Shkruani pas idmis=# dhe shtypni Enter:
  echo   \dt                                    lista e tabelave
  echo   SELECT * FROM skema_ujitese LIMIT 10;   10 skemat e para
  echo   SELECT emri FROM bashkia;               bashkite
  echo   \q                                     dalje
  echo.
)
"%PSQL%" -w -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% %*
if errorlevel 2 (
  echo.
  echo Lidhja nuk u realizua. Kontrolloni:
  echo  - ky kompjuter dhe kompjuteri me databazen jane ne te njejtin Wi-Fi
  echo  - adresa %DB_HOST% eshte ende e sakte
  echo  - nese fjalekalimi ishte gabim: IDMIS-DB.cmd /reset
)
pause
