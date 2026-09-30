@echo off
:: =============================================================
:: start-demo.bat — Start the Factory AI Demo (every time)
:: Double-click this after first-run.bat has been done once
:: =============================================================
title Factory AI Demo — Starting...

echo.
echo  ============================================================
echo   Factory AI Predictive Maintenance — IBM watsonx Demo
echo  ============================================================
echo.

:: Quick check that setup has been done
if not exist "%~dp0backend\.venv" (
    echo  Setup not yet done. Running first-run.bat instead...
    call "%~dp0first-run.bat"
    exit /b
)

if not exist "%~dp0frontend\node_modules" (
    echo  Setup not yet done. Running first-run.bat instead...
    call "%~dp0first-run.bat"
    exit /b
)

echo  Starting backend on http://localhost:8000 ...
start "Factory AI Backend" /D "%~dp0backend" cmd /c ".venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

timeout /t 4 /nobreak >nul

echo  Starting frontend on http://localhost:5173 ...
start "Factory AI Frontend" /D "%~dp0frontend" cmd /c "npm run dev"

timeout /t 4 /nobreak >nul

echo  Opening demo in browser...
start "" "http://localhost:5173"

echo.
echo  ============================================================
echo   Demo is running!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8000/api/health
echo.
echo   To stop: close the two black terminal windows.
echo  ============================================================
echo.
