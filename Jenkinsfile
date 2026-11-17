pipeline {
    agent any

    options {
        timestamps()
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout GitHub Code') {
            steps {
                checkout scm
                echo 'GitHub code downloaded successfully'
            }
        }

        stage('Install and Build React Frontend') {
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
                    $process = Start-Process `
                        -FilePath "cmd.exe" `
                        -ArgumentList "/c npm run dev -- --host 127.0.0.1 --port 5175" `
                        -WorkingDirectory "$env:WORKSPACE\\frontend" `
                        -PassThru `
                        -WindowStyle Hidden

                    Set-Content "$env:WORKSPACE\\frontend.pid" $process.Id

                    $ready = $false

                    for ($i = 0; $i -lt 60; $i++) {
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
                        throw "Frontend did not start on port 5175"
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
