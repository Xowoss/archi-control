param(
    [string]$LocalDb = "eventdb",
    [string]$LocalUser = "postgres",
    [string]$LocalPassword = "123",
    [string]$LocalHost = "host.docker.internal",
    [int]$LocalPort = 5432,
    [string]$ContainerDb = "eventdb",
    [string]$ContainerUser = "postgres",
    [string]$ContainerPassword = "123",
    [string]$PgDumpImage = "postgres:18-alpine"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
Set-Location $repoRoot

$dumpDir = Join-Path $scriptDir "dump"
New-Item -ItemType Directory -Path $dumpDir -Force | Out-Null
$dumpDirAbs = (Resolve-Path $dumpDir).Path
$dumpFile = Join-Path $dumpDir "eventdb.dump"

Write-Host "Dumping local DB to $dumpFile ..."
docker run --rm `
    -e PGPASSWORD=$LocalPassword `
    -v "${dumpDirAbs}:/backup" `
    $PgDumpImage `
    sh -c "pg_dump -h $LocalHost -p $LocalPort -U $LocalUser -Fc $LocalDb -f /backup/eventdb.dump"
if ($LASTEXITCODE -ne 0) {
    throw "pg_dump failed. Try a PgDumpImage that matches your server version, e.g. -PgDumpImage postgres:18-alpine"
}

if (-not (Test-Path $dumpFile) -or ((Get-Item $dumpFile).Length -lt 100)) {
    throw "Dump file is missing or too small. Aborting restore."
}

$dbContainer = docker compose ps -q db
if (-not $dbContainer) {
    Write-Host "Starting db container..."
    docker compose up -d db
    $dbContainer = docker compose ps -q db
}

if (-not $dbContainer) {
    throw "db container not running. Start it with: docker compose up -d db"
}

Write-Host "Restoring dump into container DB..."
$networks = docker inspect -f "{{range `$k, `$v := .NetworkSettings.Networks}}{{println `$k}}{{end}}" $dbContainer
$network = $networks | Select-Object -First 1
if (-not $network) {
    throw "Could not determine Docker network for db container."
}

docker run --rm `
    --network $network `
    -e PGPASSWORD=$ContainerPassword `
    -v "${dumpDirAbs}:/backup" `
    $PgDumpImage `
    sh -c "pg_restore -h db -U $ContainerUser -d $ContainerDb --clean --if-exists /backup/eventdb.dump"
if ($LASTEXITCODE -ne 0) {
    throw "pg_restore failed. Try a PgDumpImage that matches your dump version."
}

Write-Host "Done."
