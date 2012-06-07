@echo off
coffee -c --output js/ coffee/

if %ERRORLEVEL% = 0 (exit 0)

pause