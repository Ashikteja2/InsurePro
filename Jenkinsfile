
pipeline {
    agent any

    stages {

        stage('Checkout GitHub Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Ashikteja2/InsurePro.git'
            }
        }

        stage('Build React Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Start InsurePro Frontend') {
            steps {
                powershell '''
                    $frontendPath = "$env:WORKSPACE\\frontend"

                    $process = Start-Process `
                        -FilePath "cmd.exe" `
                        -ArgumentList "/c npm run dev -- --host 127.0.0.1 --port 5175" `
                        -WorkingDirectory $frontendPath `
                        -PassThru `
                        -WindowStyle Hidden `
                        -RedirectStandardOutput "$env:WORKSPACE\\frontend.log" `
                        -RedirectStandardError "$env:WORKSPACE\\frontend-error.log"

                    $process.Id | Set-Content "$env:WORKSPACE\\frontend.pid"

                    $ready = $false

                    for ($i = 0; $i -lt 30; $i++) {
                        Start-Sleep -Seconds 2

                        try {
                            $response = Invoke-WebRequest `
                                -Uri "http://127.0.0.1:5175/" `
                                -UseBasicParsing `
                                -TimeoutSec 3

                            if ($response.StatusCode -eq 200) {
                                $ready = $true
                                break
                            }
                        }
                        catch {
                            Write-Host "Waiting for frontend..."
                        }
                    }

                    if (-not $ready) {
                        Write-Host "Frontend startup failed."
                        Get-Content "$env:WORKSPACE\\frontend-error.log" -ErrorAction SilentlyContinue
                        exit 1
                    }

                    Write-Host "InsurePro frontend is running."
                '''
            }
        }

        stage('Run Selenium Automation Tests') {
            steps {
                dir('automation') {
                    bat '.\\mvnw.cmd clean test'
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Cleaning up frontend process...'

                int cleanupStatus = powershell(
                    returnStatus: true,
                    script: '''
                        $pidFile = "$env:WORKSPACE\\frontend.pid"

                        if (Test-Path $pidFile) {
                            $frontendProcessId = Get-Content $pidFile

                            if ($frontendProcessId) {
                                & taskkill.exe /PID $frontendProcessId /T /F 2>$null

                                if ($LASTEXITCODE -ne 0) {
                                    Write-Host "Frontend process already stopped."
                                }
                            }

                            Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
                        }

                        exit 0
                    '''
                )

                echo "Frontend cleanup exit code: ${cleanupStatus}"
            }

            junit(
                testResults: 'automation/target/surefire-reports/TEST-*.xml',
                allowEmptyResults: true
            )
        }
    }
}
