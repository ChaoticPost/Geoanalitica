param(
    [int]$port = 3006
)

function Test-PortInUse {
    param([int]$port)
    $listener = $null
    try {
        $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $port)
        $listener.Start()
        return $false
    }
    catch {
        return $true
    }
    finally {
        if ($listener) {
            $listener.Stop()
        }
    }
}

function Stop-ProcessOnPort {
    param([int]$port)
    $processInfo = netstat -ano | findstr ":$port"
    if ($processInfo) {
        $processPID = $processInfo -split ' +' | Select-Object -Last 1
        Write-Host "Stopping process with PID: $processPID on port $port"
        Stop-Process -Id $processPID -Force
        Start-Sleep -Seconds 1
    }
}

# Проверяем порт
if (Test-PortInUse -port $port) {
    Write-Host "Port $port is in use. Attempting to free it..."
    Stop-ProcessOnPort -port $port
    
    # Проверяем еще раз
    if (Test-PortInUse -port $port) {
        Write-Host "Could not free port $port. Please check running processes manually."
        exit 1
    }
    else {
        Write-Host "Successfully freed port $port"
    }
}
else {
    Write-Host "Port $port is available"
} 