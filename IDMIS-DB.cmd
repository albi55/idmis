<# :
@echo off
set "IDMIS_ARG=%~1"
powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ([IO.File]::ReadAllText('%~f0'))"
exit /b
#>
$ErrorActionPreference = 'Stop'
$Host.UI.RawUI.WindowTitle = 'IDMIS - databaza'

$DbHost = '192.168.1.50'
$DbPort = 5433
$DbName = 'idmis'
$DbUser = 'idmis_admin'

function Fund([string]$msg) {
  Write-Host ''
  Write-Host $msg -ForegroundColor Yellow
  Read-Host 'Shtypni Enter per te mbyllur' | Out-Null
  exit 1
}

$passDir = Join-Path $env:APPDATA 'postgresql'
$passFile = Join-Path $passDir 'pgpass.conf'
$marker = Join-Path $passDir ("idmis-pgadmin-$DbHost-$DbPort.ok")
$key = "${DbHost}:${DbPort}:*:${DbUser}:"
$keyOld = "${DbHost}:${DbPort}:${DbName}:${DbUser}:"
$arg = "$env:IDMIS_ARG".ToLower()

$lines = @()
if (Test-Path $passFile) { $lines = @(Get-Content -LiteralPath $passFile) }

if ($arg -eq '/reset') {
  $lines | Where-Object { -not $_.StartsWith($key) -and -not $_.StartsWith($keyOld) } | Set-Content -LiteralPath $passFile -Encoding ascii
  Remove-Item -LiteralPath $marker -ErrorAction SilentlyContinue
  Write-Host "Fjalekalimi i ruajtur per $DbUser u fshi. Nisni perseri IDMIS-DB.cmd."
  Read-Host 'Shtypni Enter per te mbyllur' | Out-Null
  exit 0
}

$have = $lines | Where-Object { $_.StartsWith($key) } | Select-Object -First 1
if (-not $have) {
  $old = $lines | Where-Object { $_.StartsWith($keyOld) } | Select-Object -First 1
  if ($old) {
    $pw = $old.Substring($keyOld.Length)
  } else {
    Write-Host "Fjalekalimi per $DbUser ruhet nje here ne kete kompjuter."
    $sec = Read-Host 'Fjalekalimi' -AsSecureString
    $pw = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
    if (-not $pw) { Fund 'Nuk u dha fjalekalim.' }
  }
  if (-not (Test-Path $passDir)) { New-Item -ItemType Directory -Path $passDir | Out-Null }
  Add-Content -LiteralPath $passFile -Value ($key + $pw) -Encoding ascii
  $pw = $null
}

$tcp = New-Object Net.Sockets.TcpClient
$reach = $false
try { $reach = $tcp.ConnectAsync($DbHost, $DbPort).Wait(3000) -and $tcp.Connected } catch { $reach = $false } finally { $tcp.Close() }
if (-not $reach) {
  Write-Host "Kujdes: databaza ne $DbHost`:$DbPort nuk po pergjigjet." -ForegroundColor Yellow
  Write-Host ' - kompjuteri me databazen duhet te jete ndezur dhe ne te njejtin Wi-Fi'
  Write-Host " - adresa $DbHost duhet te jete ende e sakte"
}

if ($arg -eq '/psql') {
  $psql = @(Get-ChildItem "$env:ProgramFiles\PostgreSQL\*\bin\psql.exe" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending) | Select-Object -First 1
  if (-not $psql) { Fund 'psql nuk u gjet. Instaloni PostgreSQL.' }
  $env:PGPASSFILE = $passFile
  & $psql.FullName -w -h $DbHost -p $DbPort -U $DbUser -d $DbName
  exit $LASTEXITCODE
}

$roots = @(
  "$env:ProgramFiles\pgAdmin 4",
  "${env:ProgramFiles(x86)}\pgAdmin 4",
  "$env:LOCALAPPDATA\Programs\pgAdmin 4"
) + @(Get-ChildItem "$env:ProgramFiles\PostgreSQL\*\pgAdmin 4" -Directory -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | ForEach-Object { $_.FullName })
$pga = $roots | Where-Object { $_ -and (Test-Path (Join-Path $_ 'runtime\pgAdmin4.exe')) } | Select-Object -First 1
if (-not $pga) { Fund 'pgAdmin 4 nuk u gjet ne kete kompjuter. Shkarkojeni nga https://www.pgadmin.org/download/ dhe nisni perseri IDMIS-DB.cmd.' }
$exe = Join-Path $pga 'runtime\pgAdmin4.exe'

if (-not (Test-Path $marker)) {
  Write-Host 'IDMIS po shtohet ne pgAdmin (vetem heren e pare) ...'
  $running = @(Get-Process -Name pgAdmin4 -ErrorAction SilentlyContinue)
  if ($running.Count -and $arg -ne '/vetem-regjistro') {
    $running | ForEach-Object { if ($_.MainWindowHandle -ne 0) { $null = $_.CloseMainWindow() } }
    Start-Sleep -Seconds 3
    Get-Process -Name pgAdmin4 -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
  }
  $json = Join-Path $env:TEMP 'idmis-pgadmin-server.json'
  $servers = @{ Servers = @{ '1' = [ordered]@{
    Name = "IDMIS ($DbHost)"; Group = 'Servers'; Host = $DbHost; Port = $DbPort
    MaintenanceDB = $DbName; Username = $DbUser
    Comment = 'IDMIS - hapet me fjalekalimin e ruajtur nga IDMIS-DB.cmd'
    ConnectionParameters = [ordered]@{ sslmode = 'prefer'; connect_timeout = 10; passfile = $passFile }
  } } }
  [IO.File]::WriteAllText($json, ($servers | ConvertTo-Json -Depth 5))
  $py = Join-Path $pga 'python\python.exe'
  $setup = Join-Path $pga 'web\setup.py'
  if (-not (Test-Path (Join-Path $env:APPDATA 'pgAdmin\pgadmin4.db'))) { & $py $setup setup-db 2>&1 | Out-Null }
  $out = & $py $setup load-servers $json 2>&1 | Out-String
  Remove-Item -LiteralPath $json -ErrorAction SilentlyContinue
  if ($LASTEXITCODE -ne 0 -or $out -notmatch 'Added') { Fund ("Serveri nuk u shtua ne pgAdmin:`n" + $out) }
  New-Item -ItemType File -Path $marker -Force | Out-Null
}

if ($arg -eq '/vetem-regjistro') { Write-Host 'IDMIS eshte ne pgAdmin.'; exit 0 }

Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
Start-Process -FilePath $exe -WorkingDirectory (Split-Path $exe)
Write-Host "pgAdmin po hapet. Klikoni 'IDMIS ($DbHost)' te Servers, pastaj Databases > idmis > Schemas > public > Tables."
Start-Sleep -Seconds 4
