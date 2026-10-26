<#
  Starts backend (Spring Boot :8081), frontend (Angular :4200) and mobile (Flutter) together.

  Usage (from weather-frontend):
    .\run-all.ps1                      # all three, Flutter on Chrome
    .\run-all.ps1 -MobileDevice emulator-5554   # Flutter on an Android emulator
    .\run-all.ps1 -SkipMobile          # backend + frontend only
  Stop everything with Ctrl+C (child processes are killed in the finally block).
#>
param(
  [string]$BackendDir  = "$PSScriptRoot\..\weather-backend",
  [string]$FrontendDir = "$PSScriptRoot",
  [string]$MobileDir   = "$PSScriptRoot\..\Wheather-mobile",
  [string]$MobileDevice = "chrome",
  [int]$BackendPort = 8081,
  [switch]$SkipMobile
)

$ErrorActionPreference = 'Stop'
$procs = @()

function Start-Service($name, $dir, $command) {
  Write-Host "Starting $name ..." -ForegroundColor Cyan
  $p = Start-Process powershell -WorkingDirectory (Resolve-Path $dir) `
        -ArgumentList '-NoExit', '-Command', "`$Host.UI.RawUI.WindowTitle='$name'; $command" -PassThru
  $script:procs += $p
}

try {
  Start-Service 'backend'  $BackendDir  "`$env:SERVER_PORT='$BackendPort'; mvn spring-boot:run"
  Start-Service 'frontend' $FrontendDir "if (-not (Test-Path node_modules)) { npm install }; npx ng serve --open"

  if (-not $SkipMobile) {
    # 10.0.2.2 = host machine from the Android emulator; localhost for chrome/desktop
    Start-Service 'mobile' $MobileDir "flutter pub get; flutter run -d $MobileDevice"
  }

  Write-Host "`nBackend : http://localhost:$BackendPort/api  (Swagger: /api/v1/swagger-ui/index.html)"
  Write-Host "Frontend: http://localhost:4200"
  Write-Host "Press Ctrl+C here to stop everything." -ForegroundColor Yellow
  Wait-Process -Id ($procs.Id)
}
finally {
  foreach ($p in $procs) {
    if ($p -and -not $p.HasExited) { & taskkill /PID $p.Id /T /F | Out-Null }
  }
}
