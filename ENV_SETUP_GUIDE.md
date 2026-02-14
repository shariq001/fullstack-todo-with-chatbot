# Complete Environment Variables Setup Guide

This guide covers all environment variables needed for local development and production deployment.

---

## 📋 Environment Variables Checklist

### **Frontend (.env files)**
- [x] `NEXT_PUBLIC_BETTER_AUTH_URL` - Frontend auth URL
- [x] `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (MUST start with NEXT_PUBLIC_)
- [x] `BETTER_AUTH_SECRET` - Auth secret (min 32 chars)
- [x] `DATABASE_URL` - Neon PostgreSQL connection string
- [x] `NEXT_PUBLIC_OPENAI_DOMAIN_KEY` - ChatKit API key
- [x] `GOOGLE_API_KEY` - Gemini API key

### **Backend (.env)**
- [x] `DATABASE_URL` - Neon PostgreSQL connection string (SAME as frontend)
- [x] `BETTER_AUTH_SECRET` - Auth secret (SAME as frontend, min 32 chars)
- [x] `GOOGLE_API_KEY` - Gemini API key (for chat agent)
- [x] `ENVIRONMENT` - `production` or `development`
- [x] `DEBUG` - `False` or `True`

---

## 🏠 Local Development Setup

### **Frontend - .env.local**

```env
# Better Auth Configuration - LOCAL DEVELOPMENT
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF

# Database Configuration (Neon PostgreSQL for Better Auth)
DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require

# API Configuration - LOCAL DEVELOPMENT BACKEND
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# OpenAI ChatKit Configuration
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=domain_pk_6988b3afd0b081958341072c2233c5a4046f4c06bf2184fb

# Google/Gemini API
GOOGLE_API_KEY=AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80
```

### **Backend - .env (in backend directory)**

```env
# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require

# Authentication Secret (MUST BE SAME AS FRONTEND)
BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF

# Google API Key (for Gemini agent)
GOOGLE_API_KEY=AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80

# Environment
ENVIRONMENT=development
DEBUG=True
```

---

## 🚀 Production Deployment Setup

### **Vercel Frontend Environment Variables**

Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

Add these variables:

```
NEXT_PUBLIC_BETTER_AUTH_URL=https://frontend-drab-eight-71.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://mushariq-full-stack-todo.hf.space
BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=domain_pk_6988b3afd0b081958341072c2233c5a4046f4c06bf2184fb
GOOGLE_API_KEY=AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80
```

**⚠️ CRITICAL:**
- `NEXT_PUBLIC_*` variables are visible in browser - use only non-sensitive keys
- Database URL contains credentials - don't share this publicly
- All production variables should be set, not relying on defaults

### **HuggingFace Spaces Backend**

Go to: **https://huggingface.co/spaces/your-username/your-space** → **Settings** → **Repository secrets**

Add these variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
GOOGLE_API_KEY=AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80
ENVIRONMENT=production
DEBUG=False
```

Or create `.env` file in Space root:
```env
DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
GOOGLE_API_KEY=AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80
ENVIRONMENT=production
DEBUG=False
```

---

## 🔧 Environment Variable Descriptions

### **Frontend Variables**

| Variable | Local Value | Production Value | Purpose |
|----------|-------------|------------------|---------|
| `NEXT_PUBLIC_BETTER_AUTH_URL` | `http://localhost:3000` | `https://frontend-drab-eight-71.vercel.app` | Frontend/Auth base URL |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000` | `https://mushariq-full-stack-todo.hf.space` | Backend API endpoint |
| `BETTER_AUTH_SECRET` | (32 chars min) | (same) | Auth session secret |
| `DATABASE_URL` | (Neon URL) | (same) | Neon PostgreSQL connection |
| `NEXT_PUBLIC_OPENAI_DOMAIN_KEY` | ChatKit key | (same) | OpenAI ChatKit domain |
| `GOOGLE_API_KEY` | Gemini API key | (same) | Google Gemini API for chat |

### **Backend Variables**

| Variable | Local Value | Production Value | Purpose |
|----------|-------------|------------------|---------|
| `DATABASE_URL` | (Neon URL) | (same) | Neon PostgreSQL connection |
| `BETTER_AUTH_SECRET` | (32 chars min) | (same) | Auth session secret |
| `GOOGLE_API_KEY` | Gemini API key | (same) | Google Gemini API for chat |
| `ENVIRONMENT` | `development` | `production` | App environment |
| `DEBUG` | `True` | `False` | Debug logging |

---

## ✅ Critical Points

1. **NEXT_PUBLIC_ Prefix** - Frontend variables visible in browser must start with `NEXT_PUBLIC_`
2. **No Trailing Slashes** - URLs should NOT have trailing slashes (e.g., `/vercel.app` not `/vercel.app/`)
3. **Secrets Match** - `BETTER_AUTH_SECRET` must be identical in frontend and backend
4. **Database Same** - `DATABASE_URL` must be identical in frontend and backend
5. **Timeout Values** - Backend connection timeout is 60 seconds for Neon serverless

---

## 🧪 Verification Commands

### **Test Frontend API Connection**
```bash
# From browser console (F12)
const token = localStorage.getItem('auth-token');
fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/health')
  .then(r => console.log('Backend health:', r.status))
  .catch(e => console.error('Backend unreachable:', e));
```

### **Test Backend Health**
```bash
curl -i https://mushariq-full-stack-todo.hf.space/health
# Should return 200 with: {"status": "healthy", "database": "connected"}
```

### **Test Backend Tasks Endpoint**
```bash
curl -X GET https://mushariq-full-stack-todo.hf.space/tasks/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔄 Deployment Workflow

1. **Update Local `.env.local`** if developing locally
2. **Test locally** - `npm run dev` (frontend) and `python backend/src/main.py` (backend)
3. **Commit to Git** - `git add .env.local` (if tracking) or exclude from git
4. **Set Vercel Env Vars** - Add to Vercel dashboard
5. **Set HuggingFace Env Vars** - Add to Space settings or create `.env` file
6. **Push to Git** - `git push origin main`
7. **Wait for Deployment** - Vercel/HuggingFace auto-deploys
8. **Verify Production** - Test endpoints and features

---

## 🐛 Troubleshooting

### **Tasks Not Loading**
- Check `NEXT_PUBLIC_API_BASE_URL` is correct in Vercel
- Verify backend `DATABASE_URL` is set on HuggingFace
- Check browser console for CORS errors

### **Chat Not Working**
- Verify `NEXT_PUBLIC_API_BASE_URL` points to correct backend
- Check `GOOGLE_API_KEY` is set on backend
- Verify JWT token is being stored in localStorage

### **Authentication Issues**
- Ensure `BETTER_AUTH_SECRET` is identical on frontend and backend
- Verify `DATABASE_URL` is correct and accessible
- Check database has `session` and `user` tables

### **Database Connection Timeout**
- Verify `DATABASE_URL` has `sslmode=require`
- Check Neon database is not sleeping (add traffic)
- Backend now uses 60-second timeout for Neon serverless

---

## 📞 Quick Reference

**Local URLs:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Database: Neon PostgreSQL (same in both)

**Production URLs:**
- Frontend: `https://frontend-drab-eight-71.vercel.app`
- Backend: `https://mushariq-full-stack-todo.hf.space`
- Database: Neon PostgreSQL (same in both)

**All Variables Present?** ✓ Yes, setup complete!
