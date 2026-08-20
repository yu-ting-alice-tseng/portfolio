@echo off
chcp 65001 > nul
setlocal EnableExtensions

:: ------------------------------------------------------------------
::  Portfolio - synchronisation automatique avec GitHub (branche main)
::  Un passage = commit local -> pull --rebase -> push
::  Lance automatiquement par la tache Windows "Portfolio Auto Sync"
::  (voir install-auto-sync.bat). Peut aussi etre lance a la main.
:: ------------------------------------------------------------------

cd /d "%~dp0"
set "LOG=%~dp0auto-sync.log"
set GIT_TERMINAL_PROMPT=0
git config gc.auto 0

call :log "--- Synchronisation demarree ---"

:: 0. Toujours travailler sur main
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set "BRANCH=%%b"
if not "%BRANCH%"=="main" (
    call :log "Branche courante : %BRANCH% - basculement sur main."
    git checkout main >> "%LOG%" 2>&1
    if errorlevel 1 (
        call :log "ECHEC du checkout main - synchronisation annulee."
        goto :end
    )
)

:: 1. Commit des modifications locales, s'il y en a
git add -A
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "Auto-update: %date% %time%" >> "%LOG%" 2>&1
    call :log "Modifications locales commitees."
) else (
    call :log "Aucune modification locale."
)

:: 2. Recuperer les commits distants AVANT de pousser
git pull --rebase --autostash origin main >> "%LOG%" 2>&1
if errorlevel 1 (
    git rebase --abort > nul 2>&1
    call :log "ECHEC du pull (conflit ou reseau) - rien n'a ete pousse, a regler a la main."
    goto :end
)

:: 3. Pousser vers GitHub
git push origin main >> "%LOG%" 2>&1
if errorlevel 1 (
    call :log "ECHEC du push - nouvelle tentative au prochain passage."
) else (
    call :log "Synchronisation terminee."
)

:end
endlocal
exit /b 0

:log
>> "%LOG%" echo [%date% %time%] %~1
exit /b 0
