@echo off
setlocal enabledelayedexpansion

set "URL=http://localhost:4000/"
REM Replace with your actual restart command
set "FALLBACK=node app.js"
set "LOGFILE=%~dp0server_watchdog.log"

REM Run from the script's folder (change if your app lives elsewhere)
cd /d "%~dp0"

:loop
echo [!date! !time!] Checking %URL% ...>>"%LOGFILE%"

REM Reset so a failed curl can't reuse the old value
set "STATUS="

REM Get HTTP status code from curl (10s timeout)
for /f %%i in ('curl -s -o nul --max-time 10 -w "%%{http_code}" "%URL%"') do set "STATUS=%%i"

echo [!date! !time!] Got status !STATUS!>>"%LOGFILE%"

if "!STATUS!"=="200" (
    echo [!date! !time!] Server is running - 200 OK.>>"%LOGFILE%"
) else if "!STATUS!"=="302" (
    echo [!date! !time!] Server is running - 302 redirect.>>"%LOGFILE%"
) else (
    echo [!date! !time!] Server returned "!STATUS!". Executing fallback...>>"%LOGFILE%"
    start "node-server" /min cmd /c %FALLBACK%
)

timeout /t 30 /nobreak >nul
goto loop