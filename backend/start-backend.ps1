$ErrorActionPreference = "Stop"
$env:PHP_INI_SCAN_DIR = Join-Path $PSScriptRoot "phpconf"
& "php" "artisan" "serve" @args