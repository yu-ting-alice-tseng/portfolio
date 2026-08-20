@echo off
chcp 65001 > nul
setlocal EnableExtensions

:: ------------------------------------------------------------------
::  Ancienne methode : fenetre ouverte en permanence.
::  Elle appelle desormais auto-sync.bat (qui fait aussi un pull),
::  toutes les 30 secondes.
::  Methode recommandee : lancer une fois install-auto-sync.bat,
::  plus aucune fenetre a garder ouverte.
::  Ne pas utiliser les deux methodes en meme temps.
:: ------------------------------------------------------------------

cd /d "%~dp0"

echo ===================================================
echo [MONITORING] Synchronisation automatique active...
echo Ne pas fermer cette fenetre !
echo (Alternative : install-auto-sync.bat, sans fenetre)
echo ===================================================

:loop
call "%~dp0auto-sync.bat"
timeout /t 30 /nobreak > nul
goto loop
