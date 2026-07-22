# ==========================================================================
# VinBasket Lightweight PowerShell Raw TCP Dev Server
# Works on Windows without requiring Administrator privileges!
# ==========================================================================

$port = 8000
$root = "C:\Users\USER\.gemini\antigravity\scratch\vinbasket"

# Fetch local IP
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.IPAddress -ne "127.0.0.1" -and 
    $_.InterfaceAlias -match "WiFi|Wireless|Ethernet|Network"
}).IPAddress | Select-Object -First 1

if (-not $ipAddress) {
    $ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
        $_.IPAddress -ne "127.0.0.1" -and 
        $_.IPAddress -notlike "169.254.*"
    }).IPAddress | Select-Object -First 1
}

if (-not $ipAddress) {
    $ipAddress = "127.0.0.1"
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "             VinBasket Non-Admin Dev Server               " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  -> Computer Browser:  http://localhost:$port" -ForegroundColor Green
Write-Host "  -> Mobile Phone:      http://$($ipAddress):$port" -ForegroundColor Green
Write-Host ""
Write-Host "  (Ensure your mobile phone is connected to the same Wi-Fi network)" -ForegroundColor Yellow
Write-Host "  Press [Ctrl + C] in this window to stop the server."
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Start raw TCP socket listener
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
try {
    $listener.Start()
} catch {
    Write-Error "Could not start server on port $port. Check if port is in use."
    exit
}

# Serve requests loop
while ($listener.Active -or $true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        
        # Read request line
        $reader = [System.IO.StreamReader]::new($stream)
        $line = $reader.ReadLine()
        if ($null -eq $line) {
            $client.Close()
            continue
        }

        # Parse GET /path HTTP/1.1
        $parts = $line -split " "
        if ($parts.Length -lt 2) {
            $client.Close()
            continue
        }
        
        $urlPath = $parts[1]
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }
        
        # Strip query strings/anchors
        $urlPath = ($urlPath -split "\?")[0]
        $urlPath = ($urlPath -split "#")[0]
        
        # Decode URL encoding (e.g. %20 -> space)
        $urlPath = [System.Web.HttpUtility]::UrlDecode($urlPath)
        if (-not $urlPath) {
            # Basic fallback decodification if System.Web is not loaded
            $urlPath = $urlPath.Replace("%20", " ")
        }

        $filePath = Join-Path $root $urlPath
        $responseBytes = [byte[]]@()
        $header = ""

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Content Type Mapping
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "text/plain"
            
            if ($ext -eq ".html") { $contentType = "text/html; charset=utf-8" }
            elseif ($ext -eq ".css") { $contentType = "text/css; charset=utf-8" }
            elseif ($ext -eq ".js") { $contentType = "text/javascript; charset=utf-8" }
            elseif ($ext -eq ".json") { $contentType = "application/json; charset=utf-8" }
            elseif ($ext -eq ".png") { $contentType = "image/png" }
            elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" }
            elseif ($ext -eq ".svg") { $contentType = "image/svg+xml; charset=utf-8" }

            $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
            $responseBytes = $bytes
        } else {
            $msgBytes = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found")
            $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($msgBytes.Length)`r`nConnection: close`r`n`r`n"
            $responseBytes = $msgBytes
        }

        $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        if ($responseBytes.Length -gt 0) {
            $stream.Write($responseBytes, 0, $responseBytes.Length)
        }
        
        $client.Close()
    } catch {
        # Catch connection breaks
    }
}
