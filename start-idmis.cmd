@echo off
rem IDMIS me hyrje në sistem: ndez databazën (5433), serverin (47821) dhe hap faqen e hyrjes.
rem Mbyllni këtë dritare për të ndalur serverin.
chcp 65001 >nul
title IDMIS server

"C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" status -D "%LOCALAPPDATA%\IDMIS\pgdata" >nul 2>&1
if errorlevel 1 (
  echo Duke ndezur databazen IDMIS...
  "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" start -w -D "%LOCALAPPDATA%\IDMIS\pgdata" -l "%LOCALAPPDATA%\IDMIS\pgdata.log" >nul
)

cd /d "%~dp0backend"
start "" "http://127.0.0.1:47821/Account/Login.html"
node server.js
pause
