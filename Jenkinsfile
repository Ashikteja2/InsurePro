
pipeline {
    agent any

    options {
        timestamps()
        skipDefaultCheckout(true)
        timeout(time: 15, unit: 'MINUTES')
    }

    stages {

        stage('Checkout GitHub Code') {
            steps {
                checkout scm
                echo 'GitHub code downloaded successfully'
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
                            Start-Sleep -Seconds 2
                        }
                    }

                    if (-not $ready) {
                        Write-Host "Frontend output:"
                        if (Test-Path $stdoutLog) {
                            Get-Content $stdoutLog
                        }

                        Write-Host "Frontend errors:"
                        if (Test-Path $stderrLog) {
                            Get-Content $stderrLog
                        }

                        throw "Frontend did not respond with HTTP 200"
                    }

                    Write-Host "InsurePro frontend is running"
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
                if (fileExists('frontend.pid')) {
                    powershell '''
                        $processId = Get-Content "$env:WORKSPACE\\frontend.pid"
                        taskkill /PID $processId /T /F 2>$null
                        Remove-Item "$env:WORKSPACE\\frontend.pid" -Force
                    '''
                }
            }

            junit(
                testResults: 'automation/target/surefire-reports/TEST-*.xml',
                allowEmptyResults: true
            )
        }
    }
}
