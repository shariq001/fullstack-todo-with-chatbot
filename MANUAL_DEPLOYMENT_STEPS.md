# Manual Deployment Steps - Frontend (Vercel) & Backend (HF Spaces)

## 🔵 VERCEL FRONTEND DEPLOYMENT

### Step 1: Set Environment Variables on Vercel
1. Go to: **https://vercel.com/dashboard**
2. Click your project: **full-stack-todo-hazel**
3. Go to **Settings** → **Environment Variables**
4. Add the following variables **(for Production environment)**:

**Production Variables:**
```
NEXT_PUBLIC_BETTER_AUTH_URL = https://full-stack-todo-hazel.vercel.app
NEXT_PUBLIC_API_BASE_URL = https://mushariq-full-stack-todo.hf.space
NEXT_PUBLIC_OPENAI_DOMAIN_KEY = domain_pk_6988b3afd0b081958341072c2233c5a4046f4c06bf2184fb
BETTER_AUTH_SECRET = rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
DATABASE_URL = postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
GOOGLE_API_KEY = AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80
```

**⚠️ IMPORTANT:** Set environment to **Production** (not Preview/Development)

### Step 2: Trigger Redeploy on Vercel
1. In your Vercel dashboard, go to **Deployments**
2. Find the latest deployment
3. Click **Redeploy** button (or wait for auto-deploy if you pushed to main)
4. Wait for deployment to complete (usually 2-3 minutes)
5. Click the deployment to view logs - should show "Production"

### Step 3: Verify Frontend is Working
1. Go to: https://full-stack-todo-hazel.vercel.app
2. Open **DevTools (F12)** → **Network** tab
3. Reload page
4. You should see network requests going to:
   - `https://mushariq-full-stack-todo.hf.space/api/chat`
   - Not `http://localhost:8000`

---

## 🟠 HUGGINGFACE SPACES BACKEND DEPLOYMENT

### Step 1: Prepare Backend Repository
```bash
cd "D:\Muhammad Shariq\GIAIC\Hackathon\Hackathon 2\Phase3\backend"
git add .
git commit -m "Configure backend for production deployment"
git push origin main
```

### Step 2: Set Environment Variables on HF Spaces
1. Go to: **https://huggingface.co/spaces/mushariq/full-stack-todo**
2. Click **Settings** (⚙️ gear icon at top right)
3. Scroll to **Repository secrets**
4. Add the following:

```
ENVIRONMENT = production
DEBUG = False
DATABASE_URL = postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET = rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
GOOGLE_API_KEY = AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80
HF_SPACE_REPO_ID = mushariq/full-stack-todo
```

### Step 3: Restart HF Spaces
1. In your Space page, look for **App status** (top right)
2. If it says "Building" or "Running", wait for it to be ready
3. Click **"Restart"** button (if available)
4. Or edit any file and push - HF will auto-rebuild
5. Wait for status to show **"Running"** (green dot)

### Step 4: Check HF Spaces Logs
1. Go to your Space: https://huggingface.co/spaces/mushariq/full-stack-todo
2. Click **Logs** (if available) to see startup output
3. Look for:
   - ✅ `Application startup complete`
   - ✅ `Uvicorn running on 0.0.0.0:7860` (or 8000)
   - ❌ If you see errors, check DATABASE_URL and GOOGLE_API_KEY

### Step 5: Test Backend Directly
Open in browser:
```
https://mushariq-full-stack-todo.hf.space/health
```

Should return:
```json
{"status":"healthy","database":"connected"}
```

If you see 503 or error, backend is not ready.

---

## 🔗 FULL END-TO-END TEST

### 1. Backend Ready?
```
Test: https://mushariq-full-stack-todo.hf.space/health
Expected: {"status":"healthy","database":"connected"}
```

### 2. Frontend Loading?
```
Test: https://full-stack-todo-hazel.vercel.app
Expected: Page loads, you can see chat interface
```

### 3. Chat Connection Working?
1. Open Frontend: https://full-stack-todo-hazel.vercel.app
2. Open DevTools (F12) → **Network** tab
3. Type message: "Add a task to test"
4. Look for request to: `https://mushariq-full-stack-todo.hf.space/api/chat`
5. Should return 200 OK with response

### 4. Tools Calling?
1. Chat message: "Show me my tasks"
2. Should return list of tasks (or empty if new)
3. Not error, not 503

---

## 🚨 TROUBLESHOOTING 503 Errors

### Check 1: Is Backend URL Correct?
```bash
# Frontend should call this URL (check Network tab in DevTools)
https://mushariq-full-stack-todo.hf.space/api/chat

# NOT this
http://localhost:8000/api/chat
```

Fix: Update `NEXT_PUBLIC_API_BASE_URL` on Vercel

### Check 2: Is HF Space Running?
```
Visit: https://huggingface.co/spaces/mushariq/full-stack-todo
Look for green "Running" status
If not: Click Restart or check Logs for errors
```

### Check 3: Database Connection
```bash
# Check HF Space logs for errors like:
"OperationalError: could not translate host name"
"PermissionDenied"
"connection timeout"
```

Fix: Verify DATABASE_URL is set correctly in HF Spaces secrets

### Check 4: Environment Variables
```bash
# HF Spaces: Make sure ENVIRONMENT=production (not development)
# Check HF Space logs for:
"ENVIRONMENT=production" ✅
"DEBUG=False" ✅
```

---

## 📋 Quick Checklist

**Vercel Frontend:**
- [ ] Environment variables set in Vercel dashboard
- [ ] Set for **Production** environment
- [ ] Redeployed (green checkmark on latest deployment)
- [ ] `NEXT_PUBLIC_API_BASE_URL=https://mushariq-full-stack-todo.hf.space`

**HF Spaces Backend:**
- [ ] Repository secrets set (ENVIRONMENT, DATABASE_URL, etc.)
- [ ] Space is **Running** (green status)
- [ ] `/health` endpoint returns 200 OK
- [ ] Logs show no errors

**Testing:**
- [ ] Frontend loads at Vercel URL
- [ ] Network requests go to HF Spaces backend
- [ ] Chat messages don't return 503
- [ ] Tasks can be added/listed

---

## 📞 If Still Having Issues

1. **Check browser console (F12 → Console tab)** for errors
2. **Check Network tab** for what URL it's actually calling
3. **Check HF Spaces logs** for backend errors
4. **Share the exact error message** - this helps identify the issue

