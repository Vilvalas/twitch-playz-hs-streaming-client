@echo off
: startpoint
tasklist /FI "IMAGENAME eq Hearthstone.exe" 2>NUL | find /I /N "Hearthstone.exe">NUL
if "%ERRORLEVEL%"=="1" .\launchHS.url
timeout 15 > NUL
goto startpoint