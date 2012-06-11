@echo off
coffee -c -b --output js/ coffee/

if %ERRORLEVEL% = 0 (exit 0)

pause