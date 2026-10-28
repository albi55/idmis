@echo off
"C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" status -D "%LOCALAPPDATA%\IDMIS\pgdata" >nul 2>&1
if %errorlevel%==0 (
  echo IDMIS database is already running on localhost:5433.
) else (
  "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" start -w -D "%LOCALAPPDATA%\IDMIS\pgdata" -l "%LOCALAPPDATA%\IDMIS\pgdata.log"
)
pause
