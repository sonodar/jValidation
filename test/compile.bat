@echo off
coffee -c -b --output ./ coffee/
if %ERRORLEVEL% NEQ 0 (pause)