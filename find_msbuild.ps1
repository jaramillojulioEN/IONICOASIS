$found = @()
$cmd = Get-Command msbuild -ErrorAction SilentlyContinue
if ($cmd) { $found += $cmd.Path }
try { $w = & where.exe msbuild 2>$null; if ($w) { $found += $w } } catch {}
$searchPaths = @()
if (Test-Path ${env:ProgramFiles}) { $searchPaths += ${env:ProgramFiles} }
if (Test-Path ${env:ProgramFiles(x86)}) { $searchPaths += ${env:ProgramFiles(x86)} }
$searchPaths += 'C:\Program Files\Microsoft Visual Studio','C:\Program Files (x86)\Microsoft Visual Studio','C:\Program Files\dotnet','C:\Program Files (x86)\dotnet'
foreach ($p in $searchPaths) {
  if (Test-Path $p) {
    Get-ChildItem -Path $p -Filter MSBuild.exe -Recurse -ErrorAction SilentlyContinue | ForEach-Object { $found += $_.FullName }
  }
}
Get-ChildItem 'C:\Windows\Microsoft.NET' -Filter msbuild.exe -Recurse -ErrorAction SilentlyContinue | ForEach-Object { $found += $_.FullName }
$found | Select-Object -Unique | ForEach-Object { Write-Output $_ }
