# ------------------------------------------------------------------
#  Portfolio - surveillance du dossier et synchronisation automatique
#
#  Declenche auto-sync.bat une minute apres la DERNIERE modification
#  (chaque nouvelle modification relance le compte a rebours), plus une
#  synchronisation de securite toutes les 30 minutes pour recuperer les
#  commits pousses depuis GitHub.
#
#  Lance au demarrage de session par la tache "Portfolio Auto Sync".
# ------------------------------------------------------------------

$ErrorActionPreference = 'Continue'

$root  = Split-Path -Parent $MyInvocation.MyCommand.Path
$log   = Join-Path $root 'auto-sync.log'
$sync  = Join-Path $root 'auto-sync.bat'

$debounceSeconds = 60      # attente apres la derniere modification
$fullSyncMinutes = 30      # filet de securite : pull regulier

function Write-Log($message) {
    "[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $message |
        Add-Content -Path $log -Encoding UTF8
}

# Une seule instance a la fois
$isNew = $false
$mutex = New-Object System.Threading.Mutex($true, 'Local\PortfolioAutoWatch', [ref]$isNew)
if (-not $isNew) { exit 0 }

function Test-Ignored([string]$path) {
    if ([string]::IsNullOrWhiteSpace($path)) { return $true }
    if ($path -like '*\.git\*' -or $path -like '*\.git')      { return $true }
    if ($path -like '*\node_modules\*')                        { return $true }
    $name = Split-Path $path -Leaf
    if ($name -eq 'auto-sync.log')                             { return $true }
    if ($name -eq 'desktop.ini')                               { return $true }
    if ($name -like '~$*' -or $name -like '*.tmp' -or
        $name -like '*.swp' -or $name -like '*.crdownload')     { return $true }
    return $false
}

function Invoke-Sync([string]$raison) {
    Write-Log "Synchronisation declenchee ($raison)."
    try {
        Start-Process -FilePath $sync -WindowStyle Hidden -Wait
    } catch {
        Write-Log "ECHEC du lancement de auto-sync.bat : $($_.Exception.Message)"
    }
}

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path                  = $root
$watcher.Filter                = '*'
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter          = [System.IO.NotifyFilters]::FileName -bor
                                 [System.IO.NotifyFilters]::DirectoryName -bor
                                 [System.IO.NotifyFilters]::LastWrite -bor
                                 [System.IO.NotifyFilters]::Size
$watcher.EnableRaisingEvents   = $true

foreach ($type in 'Changed', 'Created', 'Deleted', 'Renamed') {
    Register-ObjectEvent -InputObject $watcher -EventName $type -SourceIdentifier "pf_$type" | Out-Null
}

Write-Log "Surveillance active (declenchement $debounceSeconds s apres la derniere modification)."

$enAttente        = $false
$derniereModif    = Get-Date
$derniereSyncFull = Get-Date

Invoke-Sync 'demarrage'

while ($true) {
    Start-Sleep -Seconds 3

    foreach ($evenement in @(Get-Event | Where-Object { $_.SourceIdentifier -like 'pf_*' })) {
        $chemin = $evenement.SourceEventArgs.FullPath
        Remove-Event -EventIdentifier $evenement.EventIdentifier
        if (Test-Ignored $chemin) { continue }
        if (-not $enAttente) {
            Write-Log "Modification detectee : $(Split-Path $chemin -Leaf)"
        }
        $enAttente     = $true
        $derniereModif = Get-Date
    }

    if ($enAttente -and ((Get-Date) - $derniereModif).TotalSeconds -ge $debounceSeconds) {
        $enAttente = $false
        Invoke-Sync 'modifications terminees'
        $derniereSyncFull = Get-Date
    }

    if (((Get-Date) - $derniereSyncFull).TotalMinutes -ge $fullSyncMinutes) {
        Invoke-Sync 'controle periodique'
        $derniereSyncFull = Get-Date
    }
}
