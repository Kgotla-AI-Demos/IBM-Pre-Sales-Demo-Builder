@echo off
:: =============================================================
:: first-run.bat — ONE TIME SETUP for Factory AI Demo
:: Double-click this file after installing Node.js + Python
:: =============================================================
title Factory AI Demo — First Run Setup

echo.
echo  ============================================================
echo   Factory AI Predictive Maintenance — IBM watsonx Demo
echo   First-run setup (one time only)
echo  ============================================================
echo.

:: Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Node.js not found.
    echo  Please install it from https://nodejs.org then re-run this file.
    pause
    exit /b 1
)

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Python not found.
    echo  Please install it from https://python.org
    echo  IMPORTANT: Check "Add Python to PATH" during install.
    pause
    exit /b 1
)

echo  [1/5] Node.js and Python found. Good.
echo.

:: Copy .env if not present
if not exist "%~dp0.env" (
    echo  [2/5] Creating .env from .env.example...
    copy "%~dp0.env.example" "%~dp0.env" >nul
    echo        Done.
) else (
    echo  [2/5] .env already exists — skipping.
)
echo.

:: Frontend install
echo  [3/5] Installing frontend packages (this takes ~1 min)...
cd "%~dp0frontend"
call npm install --prefer-offline 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: npm install failed. Check your internet connection.
    pause
    exit /b 1
)
echo        Done.
echo.

:: Backend venv + install
echo  [4/5] Setting up Python virtual environment + backend packages...
cd "%~dp0backend"
python -m venv .venv
call .venv\Scripts\activate.bat
pip install --quiet -r requirements.txt
if %errorlevel% neq 0 (
    echo  ERROR: pip install failed.
    pause
    exit /b 1
)
echo        Done.
echo.

echo  [5/5] Setup complete! Starting the demo...
echo.

:: Launch backend
echo  Starting backend on http://localhost:8000 ...
start "Factory AI Backend" /D "%~dp0backend" cmd /c ".venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

:: Wait for backend to boot
timeout /t 5 /nobreak >nul

:: Launch frontend
echo  Starting frontend on http://localhost:5173 ...
start "Factory AI Frontend" /D "%~dp0frontend" cmd /c "npm run dev"

:: Wait then open browser
timeout /t 4 /nobreak >nul
echo.
echo  Opening demo in your browser...
start "" "http://localhost:5173"

echo.
echo  ============================================================
echo   Demo is running!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8000/api/health
echo.
echo   To stop: close the two black terminal windows.
echo   Next time: just double-click start-demo.bat
echo  ============================================================
echo.
pause
