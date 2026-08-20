@echo off
chcp 65001 > nul
setlocal EnableExtensions

:: ------------------------------------------------------------------
::  Installe la tache planifiee Windows qui synchronise le portfolio
::  avec GitHub toutes les 5 minutes, sans fenetre et sans rien ouvrir.
::  A lancer UNE SEULE FOIS (double-clic).
:: ------------------------------------------------------------------

set "TACHE=Portfolio Auto Sync"
set "VBS=%~dp0auto-sync-hidden.vbs"

echo Installation de la tache "%TACHE%"...
schtasks /Create /F /TN "%TACHE%" /SC MINUTE /MO 5 /TR "wscript.exe //B \"%VBS%\""
if errorlevel 1 (
    echo.
    echo ECHEC : relancer ce fichier avec un clic droit ^> "Executer en tant qu'administrateur".
    pause
    exit /b 1
)

echo.
echo Tache installee. Premiere synchronisation immediate...
schtasks /Run /TN "%TACHE%"
echo.
echo C'est fait : le site se synchronise desormais toutes les 5 minutes,
echo sans fenetre a garder ouverte. Journal : auto-sync.log
echo Pour desinstaller : uninstall-auto-sync.bat
pause
