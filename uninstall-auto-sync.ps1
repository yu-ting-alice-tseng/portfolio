# Desactive la synchronisation automatique : supprime la tache planifiee
# et arrete la surveillance en cours.

$tache = 'Portfolio Auto Sync'

if (Get-ScheduledTask -TaskName $tache -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $tache -Confirm:$false
    Write-Host "Tache supprimee."
} else {
    Write-Host "Aucune tache a supprimer."
}

Get-CimInstance Win32_Process |
    Where-Object { $_.CommandLine -like '*auto-watch.ps1*' } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Write-Host "Synchronisation automatique desactivee."
