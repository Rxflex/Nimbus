@echo off
REM Nimbus Agent Installation Script for Windows
REM Usage: install.bat http://director_url/api/agent/AGENT_KEY [agent_name]

if "%~1"=="" (
    echo Usage: %0 ^<director_url^> [agent_name]
    echo Example: %0 http://director.example.com/api/agent/your_api_key
    echo Example: %0 http://director.example.com/api/agent/your_api_key my-agent
    exit /b 1
)

set DIRECTOR_URL=%~1
set AGENT_NAME=%~2

echo Installing Nimbus Agent...
echo Director URL: %DIRECTOR_URL%
if not "%AGENT_NAME%"=="" (
    echo Agent Name: %AGENT_NAME%
)

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Please run as Administrator
    exit /b 1
)

REM Detect architecture
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    set ARCH=amd64
) else if "%PROCESSOR_ARCHITECTURE%"=="ARM64" (
    set ARCH=arm64
) else (
    echo Unsupported architecture: %PROCESSOR_ARCHITECTURE%
    exit /b 1
)

echo Detected architecture: %ARCH%

REM Download and install agent binary
set BINARY_URL=https://github.com/Rxflex/Nimbus/releases/latest/download/nimbus-agent-%ARCH%.exe
echo Downloading agent binary from: %BINARY_URL%

curl -L -o "C:\Program Files\nimbus-agent.exe" "%BINARY_URL%"

REM Create Windows service using sc command
set SERVICE_NAME=nimbus-agent
set BINARY_PATH="C:\Program Files\nimbus-agent.exe"

REM Extract API key from URL
for /f "tokens=3 delims=/" %%a in ("%DIRECTOR_URL%") do set API_KEY=%%a

REM Create service
sc create %SERVICE_NAME% binPath= "%BINARY_PATH% --director %DIRECTOR_URL% --api-key %API_KEY% --name %AGENT_NAME%" start= auto

REM Start service
sc start %SERVICE_NAME%

echo Nimbus Agent installed and started successfully!
echo Check status with: sc query %SERVICE_NAME%
echo View logs in Event Viewer under Windows Logs ^> System
