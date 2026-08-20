@echo off
chcp 65001 > nul
setlocal EnableExtensions

:: ------------------------------------------------------------------
::  Repare l'erreur "fatal: bad object refs/desktop.ini"
::  Windows / OneDrive depose des fichiers desktop.ini dans .git ;
::  git les prend pour des references et refuse de fonctionner.
::  Ce script les supprime (uniquement dans .git) et verifie le depot.
:: ------------------------------------------------------------------

cd /d "%~dp0"

if not exist ".git" (
    echo Ce dossier ne contient pas de depot git.
    pause
    exit /b 1
)

echo Suppression des desktop.ini presents dans .git...
del /s /f /q /a ".git\desktop.ini"

echo.
echo Verification du depot...
git fsck --no-progress --connectivity-only

echo.
echo Test de synchronisation...
git pull --rebase --autostash origin main

echo.
echo Termine.
pause
