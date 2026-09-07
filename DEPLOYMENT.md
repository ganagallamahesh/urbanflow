# UrbanFlow — Cloud Deployment Guide

This guide provides step-by-step instructions for deploying UrbanFlow to major cloud hosting platforms directly from GitHub.

---

## Architecture Overview

UrbanFlow is designed as a **unified full-stack application**:
- **FastAPI Backend**: Serves algorithmic optimization, network graph pathfinding, and simulation APIs under `/api/*` and OpenAPI documentation at `/docs`.
- **React Frontend**: Served directly by FastAPI from `frontend/dist`, ensuring zero CORS issues and a single port/URL.

---

## Option 1: Deploy on Render (Recommended — Free & Easiest)

Render can build and host Docker containers directly from your GitHub repository for free.

### Steps:
1. Log in to **[Render.com](https://render.com)**.
2. Click **New +** &rarr; **Web Service**.
3. Connect your GitHub account and select your **`urbanflow`** repository.
4. Configure the service:
   - **Name**: `urbanflow` (or your preferred name)
   - **Runtime**: Select **Docker** (Render will automatically detect the root `Dockerfile`).
   - **Region**: Choose the closest region (e.g., Oregon or Frankfurt).
   - **Instance Type**: **Free**.
5. Click **Create Web Service**.
6. Render will automatically build the React frontend, package the Python backend, and deploy your live URL (e.g. `https://urbanflow.onrender.com`).

---

## Option 2: Deploy on Railway

Railway automatically detects Dockerfiles and deploys with continuous GitHub integration.

### Steps:
1. Go to **[Railway.app](https://railway.app)** and sign in with GitHub.
2. Click **New Project** &rarr; **Deploy from GitHub repo**.
3. Select your **`urbanflow`** repository.
4. Railway will automatically pick up the `Dockerfile` and start building.
5. In **Settings** &rarr; **Networking**, click **Generate Domain** to get your public HTTPS URL (e.g. `https://urbanflow.up.railway.app`).

---

## Option 3: Deploy with Docker (Local or Any Cloud VM / VPS)

You can build and run the Docker image anywhere:

```bash
# 1. Build the Docker image
docker build -t urbanflow:latest .

# 2. Run the container on port 8000
docker run -d -p 8000:8000 --name urbanflow urbanflow:latest
```
Access at `http://localhost:8000` or your VM's public IP.

---

## Option 4: Split Deployment (Vercel Frontend + Render Backend)

If you prefer hosting the React frontend on Vercel and the FastAPI backend on Render:

### Backend (Render):
- Set root directory to `backend`.
- Build command: `pip install -r requirements.txt`.
- Start command: `python run_backend.py`.
- Note your backend URL: `https://your-backend.onrender.com`.

### Frontend (Vercel):
- Connect GitHub repo and set root directory to `frontend`.
- Add environment variable:
  `VITE_API_BASE=https://your-backend.onrender.com`
- Framework Preset: **Vite**.
- Deploy!
