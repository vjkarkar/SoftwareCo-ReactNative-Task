# Clean install - fixes npm ENOTEMPTY errors on Windows
# Run: .\scripts\clean-install.ps1

Write-Host "Stopping Metro/Node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Removing node_modules..." -ForegroundColor Yellow
cmd /c "cd /d $PWD && rd /s /q node_modules 2>nul"

Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Done!" -ForegroundColor Green
