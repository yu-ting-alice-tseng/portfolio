@echo off
chcp 65001 > nul
setlocal EnableExtensions

set "TACHE=Portfolio Auto Sync"

echo Suppression de la tache "%TACHE%"...
schtasks /Delete /F /TN "%TACHE%"
if errorlevel 1 (
    echo La tache n'existait pas ou droits insuffisants.
) else (
    echo Tache supprimee : la synchronisation automatique est desactivee.
)
pause
