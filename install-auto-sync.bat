@echo off
chcp 65001 > nul
:: Installe la surveillance automatique du dossier (a lancer une seule fois).
:: Toute la logique est dans install-auto-sync.ps1.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-auto-sync.ps1"
pause
