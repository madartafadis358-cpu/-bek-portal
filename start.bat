@echo off
title BEK Portal - Serveur Express
echo ========================================
echo    BEK Portal - Demarrage du serveur
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Node.js n'est pas installe ou introuvable dans le PATH.
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

:: Check if dist/ exists (if not, build it)
if not exist "dist\index.html" (
    echo [INFO] Build du frontend en cours...
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo [ERREUR] Le build a echoue.
        pause
        exit /b 1
    )
    echo [OK] Build termine.
)

:: Installer les dependances si necessaire
if not exist "node_modules\express" (
    echo [INFO] Installation des dependances...
    call npm install
)

echo [OK] Demarrage du serveur sur http://localhost:3000
echo [INFO] Appuyez sur Ctrl+C pour arreter.
echo.
node server.js

pause
