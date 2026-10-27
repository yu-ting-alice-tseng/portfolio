# Split the Kaggle CSV files into parts under 100 MB (gzip by default),
# the size limit for a local upload in the BigQuery console.
# Every part keeps the header line.
#
# Usage (from the project folder):
#   powershell -ExecutionPolicy Bypass -File split-csv.ps1
# If BigQuery refuses the .csv.gz files, add -NoGzip to get plain .csv parts.
#
# Works with Windows PowerShell 5.1 and PowerShell 7.

param(
    [string]$InputDir  = "data",
    [string]$OutputDir = "upload",
    [int]$MaxMB        = 90,
    [switch]$NoGzip
)

$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding($false)
$maxBytes = [int64]$MaxMB * 1MB
$ext = if ($NoGzip) { "csv" } else { "csv.gz" }

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$files = Get-ChildItem -Path $InputDir -Filter *.csv | Sort-Object Name
if ($files.Count -eq 0) { throw "No CSV file found in '$InputDir'." }

function Open-Part([string]$path, [string]$header) {
    $fs = [System.IO.File]::Create($path)
    if ($NoGzip) {
        $w = New-Object System.IO.StreamWriter($fs, $utf8, 1MB)
    } else {
        $gz = New-Object System.IO.Compression.GZipStream($fs, [System.IO.Compression.CompressionLevel]::Optimal)
        $w  = New-Object System.IO.StreamWriter($gz, $utf8, 1MB)
    }
    $w.WriteLine($header)
    return @{ Fs = $fs; Writer = $w; Path = $path }
}

foreach ($file in $files) {
    $base   = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $reader = New-Object System.IO.StreamReader($file.FullName, $utf8)
    $header = $reader.ReadLine()
    $partN  = 1
    $part   = Open-Part (Join-Path $OutputDir ("{0}_part{1:D2}.{2}" -f $base, $partN, $ext)) $header
    $n = 0

    while ($null -ne ($line = $reader.ReadLine())) {
        $part.Writer.WriteLine($line)
        $n++
        # Check the file size every 20 000 lines
        if (($n % 20000) -eq 0) {
            $part.Writer.Flush()
            if ($part.Fs.Length -ge $maxBytes) {
                $part.Writer.Close()
                Write-Host ("  {0}" -f (Split-Path $part.Path -Leaf))
                $partN++
                $part = Open-Part (Join-Path $OutputDir ("{0}_part{1:D2}.{2}" -f $base, $partN, $ext)) $header
            }
        }
    }
    $part.Writer.Close()
    $reader.Close()
    Write-Host ("  {0}" -f (Split-Path $part.Path -Leaf))
    Write-Host ("{0}: {1:N0} lines, {2} part(s)" -f $file.Name, $n, $partN)
}

Write-Host ""
Write-Host "Files to upload:"
foreach ($f in (Get-ChildItem -Path $OutputDir -Filter "*.$ext" | Sort-Object Name)) {
    Write-Host ("  {0,-28} {1,6:N1} MB" -f $f.Name, ($f.Length / 1MB))
}
