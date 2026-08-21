# ------------------------------------------------------------------
#  Installe la tache Windows "Portfolio Auto Sync".
#
#  Elle lance auto-watch.ps1 (surveillance du dossier) a chaque
#  ouverture de session, sans aucune fenetre. Un declenchement toutes
#  les 30 minutes sert de filet de securite : si la surveillance s'est
#  arretee, elle repart ; sinon la tache est simplement ignoree.
# ------------------------------------------------------------------

$ErrorActionPreference = 'Stop'

$tache   = 'Portfolio Auto Sync'
$dossier = Split-Path -Parent $MyInvocation.MyCommand.Path
$vbs     = Join-Path $dossier 'auto-watch-hidden.vbs'

if (-not (Test-Path $vbs)) {
    Write-Host "Fichier introuvable : $vbs" -ForegroundColor Red
    exit 1
}

try {
    $action = New-ScheduledTaskAction -Execute 'wscript.exe' -Argument ('//B ' + [char]34 + $vbs + [char]34)

    $declencheurs = @(
        New-ScheduledTaskTrigger -AtLogOn
        New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 30)
    )

    $reglages = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -MultipleInstances IgnoreNew `
        -ExecutionTimeLimit ([TimeSpan]::Zero)

    Register-ScheduledTask -TaskName $tache -Action $action -Trigger $declencheurs -Settings $reglages -Force | Out-Null
    Start-ScheduledTask -TaskName $tache

    Write-Host ""
    Write-Host "C'est fait. Plus rien a ouvrir :" -ForegroundColor Green
    Write-Host "  - fichier modifie  -> synchronisation 1 minute apres la derniere modification"
    Write-Host "  - controle de securite toutes les 30 minutes (recupere les commits distants)"
    Write-Host "  - demarrage automatique a chaque ouverture de session Windows"
    Write-Host ""
    Write-Host "Journal : auto-sync.log"
    Write-Host "Desinstaller : uninstall-auto-sync.bat"
}
catch {
    Write-Host ""
    Write-Host "ECHEC : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Relancer install-auto-sync.bat avec un clic droit > Executer en tant qu'administrateur."
    exit 1
}
