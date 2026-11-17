stage('Start InsurePro Frontend') {
    steps {
        powershell '''
            $process = Start-Process `
                -FilePath "cmd.exe" `
                -ArgumentList "/c npm run dev -- --host 127.0.0.1 --port 5175" `
                -WorkingDirectory "$env:WORKSPACE\\frontend" `
                -PassThru `
                -WindowStyle Hidden `
                -RedirectStandardOutput "$env:WORKSPACE\\frontend.log" `
                -RedirectStandardError "$env:WORKSPACE\\frontend-error.log"

            Set-Content "$env:WORKSPACE\\frontend.pid" $process.Id

            $ready = $false

            for ($i = 0; $i -lt 60; $i++) {
                try {
                    Invoke-WebRequest `
                        -Uri "http://127.0.0.1:5175" `
                        -TimeoutSec 2 | Out-Null

                    $ready = $true
                    break
                }
                catch {
                    Start-Sleep -Seconds 2
                }
            }

            if (-not $ready) {
                Get-Content "$env:WORKSPACE\\frontend.log" -ErrorAction SilentlyContinue
                Get-Content "$env:WORKSPACE\\frontend-error.log" -ErrorAction SilentlyContinue
                throw "Frontend did not start on port 5175"
            }

            Write-Host "InsurePro frontend is running successfully"
        '''
    }
}