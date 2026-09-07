@echo off
echo ================================================================
echo Starting UrbanFlow Prototype - SIH Freight Coordination Platform
echo ================================================================
echo.

echo Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "UrbanFlow Backend" cmd /k "cd backend && python run_backend.py"

timeout /t 3 /nobreak >nul

echo Launching Vite Frontend on http://localhost:5173 ...
start "UrbanFlow Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are launching!
echo Backend API Docs: http://127.0.0.1:8000/docs
echo Frontend UI:     http://localhost:5173
echo ================================================================
