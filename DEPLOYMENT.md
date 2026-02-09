# Phase 3 Todo AI Chatbot - Deployment Guide

## Deployment Status

✅ **Code committed and pushed to GitHub**
- Repository: https://github.com/shariq001/fullstack-todo-with-chatbot

## Frontend Deployment (Vercel)

### Current Status
- Deployed at: https://full-stack-todo-hazel.vercel.app
- Auto-deploys on git push to main

### Steps to Verify/Redeploy

1. **Visit Vercel Dashboard:** https://vercel.com/dashboard
2. **Select the project:** "fullstack-todo-with-chatbot"
3. **Environment Variables** - Ensure these are set:
   ```
   NEXT_PUBLIC_BETTER_AUTH_URL=https://full-stack-todo-hazel.vercel.app
   NEXT_PUBLIC_API_BASE_URL=https://mushariq-full-stack-todo.hf.space
   BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
   DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
   NEXT_PUBLIC_OPENAI_DOMAIN_KEY=domain_pk_6988b3afd0b081958341072c2233c5a4046f4c06bf2184fb
   ```
4. **Trigger Redeploy:** Click "Deployments" → Latest → "Redeploy"

## Backend Deployment (HF Spaces)

### Current Status
- Deployed at: https://mushariq-full-stack-todo.hf.space
- Manual deployment needed

### Steps to Deploy

1. **Visit HF Spaces:** https://huggingface.co/spaces/mushariq/mushariq-full-stack-todo

2. **Connect to GitHub:**
   - Go to Space Settings → Model Card → Edit
   - Ensure it's linked to: https://github.com/shariq001/fullstack-todo-with-chatbot

3. **Set Environment Variables** in HF Space:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
   BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
   ENVIRONMENT=production
   DEBUG=False
   GOOGLE_API_KEY=<YOUR_GEMINI_API_KEY>
   ```

4. **Deploy:**
   - Go to Space Settings → Restart this space
   - Or wait for auto-sync (if GitHub webhook is configured)

## Configuration Files Updated

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_BETTER_AUTH_URL=https://full-stack-todo-hazel.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://mushariq-full-stack-todo.hf.space
BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=domain_pk_6988b3afd0b081958341072c2233c5a4046f4c06bf2184fb
```

### Backend (`backend/.env`)
```
ENVIRONMENT=production
DEBUG=False
DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
GOOGLE_API_KEY=<YOUR_GEMINI_API_KEY>
```

## Backend Changes (V2.0)

- **File:** `backend/src/services/agent_service.py`
- **Changes:**
  - Integrated Google Generative AI (Gemini 2.0 Flash)
  - Real API mode with mock fallback
  - Production-ready error handling
  - Conversation history loading for context

## API Configuration

### CORS Updated
- Backend accepts requests from:
  - Production frontend: `https://full-stack-todo-hazel.vercel.app`
  - Local development: `http://localhost:3000`, `http://localhost:3001`

### API Endpoints
- **Chat:** `POST /api/chat`
- **Chat History:** `GET /api/chat?conversation_id=<id>`
- **Health:** `GET /`

## Testing

### Local Testing (if needed)
```bash
# Backend
cd backend
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm run dev
```

### Production Testing
1. Visit: https://full-stack-todo-hazel.vercel.app
2. Login with Better Auth
3. Send a message to test the chat
4. Backend logs available in HF Space Runtime

## Troubleshooting

### Frontend Not Loading
- Check Vercel deployments: https://vercel.com/dashboard
- Verify environment variables are set
- Check browser console for errors

### Chat Not Responding
- Check HF Space is running: https://huggingface.co/spaces/mushariq/mushariq-full-stack-todo
- Verify Gemini API key is set in environment
- Check API logs in HF Space

### API Connection Issues
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check CORS settings in backend
- Check network requests in browser DevTools

## Next Steps

1. ✅ Code deployed to GitHub
2. ⏳ Verify Vercel frontend is deployed
3. ⏳ Deploy backend to HF Space
4. ⏳ Test production URLs
5. ⏳ Monitor logs and performance

---

**Last Updated:** 2026-02-09
**Deployment Status:** Ready for production
