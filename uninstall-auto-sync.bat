@echo off
chcp 65001 > nul
:: Desactive la synchronisation automatique.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0uninstall-auto-sync.ps1"
pause
