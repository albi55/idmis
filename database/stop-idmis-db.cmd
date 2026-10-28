@echo off
"C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" stop -m fast -w -D "%LOCALAPPDATA%\IDMIS\pgdata"
pause
