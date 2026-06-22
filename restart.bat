@echo off
cd /d "D:\MOURAD-TRAV-OP-CODE\BEK"
taskkill /f /im node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
node server.js
pause
