# Deployment Environment Variables Guide

## Overview
This guide explains how to set environment variables on **Vercel** (frontend) and **HuggingFace Spaces** (backend) for production deployment.

---

## 🔵 Vercel Frontend Configuration

### Where to Set Variables:
1. Go to: **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add variables for **Production** environment

### Required Environment Variables:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://mushariq-full-stack-todo.hf.space

# Better Auth Configuration
NEXT_PUBLIC_BETTER_AUTH_URL=https://full-stack-todo-hazel.vercel.app
BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require

# ChatKit Configuration
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=domain_pk_6988b3afd0b081958341072c2233c5a4046f4c06bf2184fb

# Google/Gemini API
GOOGLE_API_KEY=AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80
```

### Important Notes:
- `NEXT_PUBLIC_*` variables are exposed to browser (public)
- Non-`NEXT_PUBLIC_` variables are server-side only
- **After setting variables, redeploy the project** (Vercel auto-triggers or manually trigger)

---

## 🟠 HuggingFace Spaces Backend Configuration

### Where to Set Variables:
1. Go to: **HuggingFace** → Your Space → **Settings** → **Repository secrets**
2. Or set in the Space's environment via app.py startup

### Required Environment Variables:

```env
# Environment Mode
ENVIRONMENT=production
DEBUG=False

# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require

# Authentication
BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF

# Google/Gemini API
GOOGLE_API_KEY=AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80

# Space Configuration
HF_SPACE_REPO_ID=mushariq/full-stack-todo
```

### HuggingFace Spaces Deployment Steps:

1. **In your HF Space settings:**
   - Set **Persistent storage** if needed (for logs, uploads)
   - Set **Environment variables** (Repository secrets)
   - Ensure **Runtime** is set to "Docker" or "Python"

2. **Backend app.py should include:**
   ```python
   import os
   from dotenv import load_dotenv

   # Load from HF Spaces secrets
   load_dotenv()

   environment = os.getenv("ENVIRONMENT", "development")
   debug = os.getenv("DEBUG", "False") == "True"
   ```

3. **Restart the space** after environment variable changes

---

## 🔄 Full Deployment Workflow

### 1. Backend (HuggingFace Spaces) Setup:
```bash
# In your HF Space repository
# Environment variables are set via HF Spaces UI (Settings → Secrets)
# Restart space after setting variables
```

### 2. Frontend (Vercel) Setup:
```bash
# Set environment variables in Vercel dashboard
# Trigger redeploy or wait for auto-deploy
```

### 3. Verify Connectivity:
1. Open Vercel frontend: https://full-stack-todo-hazel.vercel.app
2. Open browser DevTools (F12) → Network tab
3. Try to add a task
4. Check if request goes to correct backend URL
5. If 503 error, backend is not responding - check HF Spaces logs

---

## 🚨 Troubleshooting 503 Errors

### Cause 1: Backend not responding
- Check HF Spaces space status
- Look at Space logs: HF Spaces → Space → Logs
- Verify environment variables are set

### Cause 2: Wrong backend URL
- Frontend is calling wrong URL
- Verify `NEXT_PUBLIC_API_BASE_URL` in Vercel
- Should be: `https://mushariq-full-stack-todo.hf.space`

### Cause 3: CORS blocked
- Backend CORS config must allow Vercel URL
- Check main.py: `allow_origins` includes `https://full-stack-todo-hazel.vercel.app`
- Already configured ✓

### Cause 4: Database connection
- Backend can't connect to Neon PostgreSQL
- Check DATABASE_URL is correct
- Verify Neon project still active
- Check backend logs for connection errors

---

## 📝 Quick Reference: What Goes Where

| Variable | Vercel | HF Spaces | Type |
|----------|--------|-----------|------|
| ENVIRONMENT | ❌ | ✅ (production) | Backend only |
| NEXT_PUBLIC_API_BASE_URL | ✅ | ❌ | Frontend only |
| NEXT_PUBLIC_BETTER_AUTH_URL | ✅ | ❌ | Frontend only |
| BETTER_AUTH_SECRET | ✅ | ✅ | Both (must match) |
| DATABASE_URL | ✅ | ✅ | Both (same value) |
| GOOGLE_API_KEY | ✅ | ✅ | Both (same value) |

---

## ✅ Checklist Before Deployment

- [ ] Vercel: Set all `NEXT_PUBLIC_*` variables
- [ ] Vercel: Set BETTER_AUTH_SECRET and DATABASE_URL
- [ ] HF Spaces: Set ENVIRONMENT=production
- [ ] HF Spaces: Set all required secrets
- [ ] HF Spaces: Restart the space
- [ ] Vercel: Redeploy frontend
- [ ] Test: Open Vercel frontend and try chat
- [ ] Check: Network tab for correct API URL
- [ ] Verify: Backend responds (not 503)

