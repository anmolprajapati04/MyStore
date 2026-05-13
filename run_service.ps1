param (
    [string]$ServiceDir,
    [string]$Command = "mvn spring-boot:run"
)

$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | Where-Object { $_ -match "=" } | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $name, $value = $line.Split('=', 2)
            $name = $name.Trim()
            $value = $value.Trim()
            [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
        }
    }
}

Set-Location $ServiceDir
# Use Start-Process or similar to capture output?
# For now, just run it and let the caller handle redirection if possible, 
# but better to just run and output to console.
Invoke-Expression $Command
