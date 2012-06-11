@echo off
coffee -c -b --output js/ coffee/
if %ERRORLEVEL% NEQ 0 (pause)
