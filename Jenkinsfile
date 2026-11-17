
stage('Start InsurePro Frontend') {
    steps {
        powershell '''
            $frontendPath = "$env:WORKSPACE\\frontend"
            $stdoutLog = "$env:WORKSPACE\\frontend.stdout.log"
            $stderrLog = "$env:WORKSPACE\\frontend.stderr.log"

            $process = Start-Process `
                -FilePath "cmd.exe" `
                -ArgumentList '/c npm run preview -- --host 127.0.0.1 --port 5175 --strictPort' `
                -WorkingDirectory $frontendPath `
                -PassThru `
                -WindowStyle Hidden `
                -RedirectStandardOutput $stdoutLog `
                -RedirectStandardError $stderrLog

            Set-Content "$env:WORKSPACE\\frontend.pid" $process.Id

            $ready = $false

            for ($i = 0; $i -lt 60; $i++) {
                if ($process.HasExited) {
                    break
                }

                try {
                    Invoke-WebRequest `
                        -Uri "http://localhost:5175" `
                        -TimeoutSec 2 | Out-Null

                    $ready = $true
                    break
                }
                catch {
                    Start-Sleep -Seconds 2
                }
            }

            if (-not $ready) {
                Write-Host "Frontend startup logs:"
                if (Test-Path $stdoutLog) {
                    Get-Content $stdoutLog
                }
                if (Test-Path $stderrLog) {
                    Get-Content $stderrLog
                }
                throw "Frontend preview server failed to start on port 5175"
            }

            Write-Host "InsurePro production frontend is running"
        '''
    }
}
