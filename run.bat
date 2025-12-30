@echo off
title Full Stack Ecommerce Site Launcher

echo ============================================
echo    Full Stack Ecommerce Site Launcher
echo ============================================
echo.

:: Set the root directory to where the bat file is located
cd /d "%~dp0"
echo [INFO] Working directory: %cd%
echo.

:: Check if Node.js is installed
echo [INFO] Checking Node.js installation...
for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VER=%%i
if "%NODE_VER%"=="" (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    goto :error
)
echo [OK] Node.js found: %NODE_VER%
echo.

:: Check if npm is installed
echo [INFO] Checking npm installation...
for /f "tokens=*" %%i in ('npm --version 2^>nul') do set NPM_VER=%%i
if "%NPM_VER%"=="" (
    echo [ERROR] npm is not installed or not in PATH.
    goto :error
)
echo [OK] npm found: %NPM_VER%
echo.

echo ============================================
echo    Checking Frontend Dependencies
echo ============================================
echo.

:: Check if node_modules exists for frontend
if not exist "node_modules\" (
    echo [INFO] Frontend node_modules not found. Installing...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies.
        goto :error
    )
    echo [SUCCESS] Frontend dependencies installed.
) else (
    echo [OK] Frontend dependencies already installed.
)
echo.

echo ============================================
echo    Checking Backend Dependencies
echo ============================================
echo.

:: Check if backend folder exists
if not exist "backend\" (
    echo [ERROR] Backend folder not found!
    goto :error
)

:: Check if node_modules exists for backend
if not exist "backend\node_modules\" (
    echo [INFO] Backend node_modules not found. Installing...
    cd backend
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install backend dependencies.
        cd ..
        goto :error
    )
    cd ..
    echo [SUCCESS] Backend dependencies installed.
) else (
    echo [OK] Backend dependencies already installed.
)
echo.

:: Check for backend .env file
if not exist "backend\.env" (
    echo [WARNING] Backend .env file not found!
    echo [INFO] Creating basic backend\.env file...
    echo PORT=5000> "backend\.env"
    echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production>> "backend\.env"
    echo CLOUD_NAME=your_cloudinary_cloud_name>> "backend\.env"
    echo CLOUDINARY_API_KEY=your_cloudinary_api_key>> "backend\.env"
    echo CLOUDINARY_API_SECRET=your_cloudinary_api_secret>> "backend\.env"
    echo [WARNING] Please update backend\.env with your actual configuration!
    echo.
)

:: Check for frontend .env file
if not exist ".env" (
    echo [INFO] Creating frontend .env file...
    echo VITE_API_URL=http://localhost:5000/api> ".env"
    echo [SUCCESS] Frontend .env created.
    echo.
)

echo ============================================
echo    Starting Servers
echo ============================================
echo.
echo [INFO] Starting Backend Server on http://localhost:5000
echo [INFO] Starting Frontend Server on http://localhost:5173
echo.

:: Get the current directory for use in start commands
set "PROJECT_DIR=%cd%"

:: Start backend server in a new window
start "Backend Server" cmd /k "cd /d "%PROJECT_DIR%\backend" && echo Starting Backend... && npm start"

:: Wait for backend to initialize
echo [INFO] Waiting for backend to start...
ping localhost -n 5 >nul

:: Start frontend server in a new window  
start "Frontend Server" cmd /k "cd /d "%PROJECT_DIR%" && echo Starting Frontend... && npm run dev"

echo.
echo ============================================
echo    Servers Started Successfully!
echo ============================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000/api
echo.
echo   Two new terminal windows have been opened.
echo   Close them to stop the servers.
echo ============================================
echo.

:: Wait then open browser
ping localhost -n 4 >nul
start http://localhost:5173

echo Press any key to close this launcher window...
pause >nul
goto :eof

:error
echo.
echo ============================================
echo    An error occurred. See above for details.
echo ============================================
echo.
pause
exit /b 1
