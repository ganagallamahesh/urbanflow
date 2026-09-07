@echo off
echo ================================================================
echo UrbanFlow - Unified Deployment & Live Cloudflare Public Tunnel
echo ================================================================
echo.
echo [1/2] Starting Unified Server (UI + API) on http://127.0.0.1:8000 ...
start "UrbanFlow Server" cmd /k "cd backend && python run_backend.py"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Cloudflare Public Tunnel...
start "UrbanFlow Public Tunnel" cmd /k "cloudflared.exe tunnel --url http://127.0.0.1:8000"

echo.
echo ================================================================
echo UrbanFlow Deployment Launched Successfully!
echo Local Web App:     http://127.0.0.1:8000
echo Interactive Docs:  http://127.0.0.1:8000/docs
echo.
echo Check the 'UrbanFlow Public Tunnel' window for your live HTTPS URL:
echo (e.g. https://xxxx.trycloudflare.com)
echo ================================================================
