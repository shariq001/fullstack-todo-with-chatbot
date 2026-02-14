# Final Deployment & Testing Checklist

Complete this checklist to ensure your project works perfectly in both local and production environments.

---

## 🔧 Phase 1: Local Development Setup

### A. Backend Setup
- [ ] Navigate to `backend` directory
- [ ] Create `.env` file with:
  ```env
  DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
  BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
  GOOGLE_API_KEY=AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80
  ENVIRONMENT=development
  DEBUG=True
  ```
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Run backend: `python src/main.py`
- [ ] Verify startup:
  ```
  ✓ Application starting up
  ✓ Database tables created/verified
  ✓ Gemini API client and AI agent initialized
  ✓ Application ready
  ```

### B. Frontend Setup
- [ ] Navigate to `frontend` directory
- [ ] Verify `.env.local` exists with LOCAL values:
  ```env
  NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
  NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
  BETTER_AUTH_SECRET=rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
  DATABASE_URL=postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
  NEXT_PUBLIC_OPENAI_DOMAIN_KEY=domain_pk_6988b3afd0b081958341072c2233c5a4046f4c06bf2184fb
  GOOGLE_API_KEY=AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80
  ```
- [ ] Install dependencies: `npm install`
- [ ] Run frontend: `npm run dev`
- [ ] Verify it loads at `http://localhost:3000`

---

## 🧪 Phase 2: Local Testing

### A. Authentication Tests
1. **Signup**
   - [ ] Go to signup page
   - [ ] Create account with email and password
   - [ ] Verify redirect to dashboard
   - [ ] Check `auth-token` in localStorage (F12 → Application)

2. **Login**
   - [ ] Logout or open incognito window
   - [ ] Go to login page
   - [ ] Login with same credentials
   - [ ] Verify redirect to dashboard
   - [ ] Check `auth-token` exists in localStorage

### B. Tasks Tests
1. **View Tasks**
   - [ ] Login successfully
   - [ ] Dashboard loads
   - [ ] "Your Tasks" section visible
   - [ ] No errors in console (F12)

2. **Create Task**
   - [ ] Click "Create New Task"
   - [ ] Enter task title: "Test task"
   - [ ] Click submit
   - [ ] Task appears in list immediately
   - [ ] Page shows "Test task" with checkbox

3. **Update Task**
   - [ ] Click on task to edit
   - [ ] Change title to "Updated task"
   - [ ] Save changes
   - [ ] Task title updated in list

4. **Complete Task**
   - [ ] Click checkbox on task
   - [ ] Task marks as complete (strikethrough)
   - [ ] Status persists on refresh

5. **Delete Task**
   - [ ] Hover over task
   - [ ] Click delete button
   - [ ] Task removed from list
   - [ ] List updates immediately

### C. Chat Tests
1. **Access Chat**
   - [ ] Click "Go to ChatBot" button
   - [ ] Chat page loads
   - [ ] Message input visible

2. **Send Messages**
   - [ ] Type: "list my tasks"
   - [ ] Press Send
   - [ ] Agent responds with task list
   - [ ] No console errors

3. **Create via Chat**
   - [ ] Type: "create a task called test from chat"
   - [ ] Agent responds with confirmation
   - [ ] New task appears in dashboard

4. **Conversation History**
   - [ ] Send multiple messages
   - [ ] Verify all messages visible in chat
   - [ ] Close and reopen chat
   - [ ] History loads correctly

### D. Browser Console Check (F12)
- [ ] No red error messages
- [ ] No CORS errors
- [ ] No 404 errors for API calls
- [ ] `auth-token` present in localStorage
- [ ] Network tab shows `/tasks/` requests to `http://localhost:8000`

---

## 🚀 Phase 3: Production Deployment

### A. Vercel Frontend Deployment

1. **Set Environment Variables**
   - [ ] Go to https://vercel.com/dashboard
   - [ ] Select project: `frontend-drab-eight-71`
   - [ ] Click Settings → Environment Variables
   - [ ] Add variables:
     ```
     NEXT_PUBLIC_BETTER_AUTH_URL: https://frontend-drab-eight-71.vercel.app
     NEXT_PUBLIC_API_BASE_URL: https://mushariq-full-stack-todo.hf.space
     BETTER_AUTH_SECRET: rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
     DATABASE_URL: postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
     NEXT_PUBLIC_OPENAI_DOMAIN_KEY: domain_pk_6988b3afd0b081958341072c2233c5a4046f4c06bf2184fb
     GOOGLE_API_KEY: AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80
     ```
   - [ ] Save each variable
   - [ ] Verify all 6 variables are set

2. **Trigger Deployment**
   - [ ] Go to Deployments tab
   - [ ] Click latest deployment
   - [ ] Click "..." menu
   - [ ] Click "Redeploy"
   - [ ] Wait 2-3 minutes
   - [ ] Verify "Ready" status

### B. HuggingFace Backend Deployment

1. **Set Environment Variables**
   - [ ] Go to https://huggingface.co/spaces/your-username/your-space
   - [ ] Click Settings
   - [ ] Find "Repository secrets"
   - [ ] Add variables:
     ```
     DATABASE_URL: postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
     BETTER_AUTH_SECRET: rC2qUxXoaTcZV8uc1CtmM43P0bireTIF
     GOOGLE_API_KEY: AIzaSyCTJJWgwfjLTzUHA1hEZqOJIcC-67OSD80
     ENVIRONMENT: production
     DEBUG: False
     ```
   - [ ] Save each secret

2. **Deploy Code**
   - [ ] Ensure latest code is pushed to GitHub
   - [ ] Space auto-syncs with GitHub
   - [ ] Or: Go to Space settings and restart
   - [ ] Wait 3-5 minutes for startup
   - [ ] Check Logs tab for startup messages

3. **Verify Backend Started**
   - [ ] Open Logs tab
   - [ ] Look for: `=== APPLICATION READY ===`
   - [ ] Should see: `Database tables created`
   - [ ] Should see: `Gemini API client initialized`

---

## ✅ Phase 4: Production Testing

### A. Basic Connectivity
1. **Frontend Loads**
   - [ ] Go to https://frontend-drab-eight-71.vercel.app/
   - [ ] Page loads quickly
   - [ ] No blank page

2. **Backend Health**
   - [ ] Paste in browser console:
     ```javascript
     fetch('https://mushariq-full-stack-todo.hf.space/health')
       .then(r => r.json())
       .then(d => console.log('Health:', d))
     ```
   - [ ] Should show: `{"status": "healthy", "database": "connected"}`

3. **Backend Ready**
   - [ ] Paste in browser console:
     ```javascript
     fetch('https://mushariq-full-stack-todo.hf.space/ready')
       .then(r => r.json())
       .then(d => console.log('Ready:', d))
     ```
   - [ ] Should show: `{"status": "ready"}`

### B. Authentication Tests
1. **Signup**
   - [ ] Go to production frontend
   - [ ] Click "Create new account"
   - [ ] Create account with new email
   - [ ] Verify redirect to dashboard
   - [ ] Check `auth-token` in localStorage

2. **Login with Different Account**
   - [ ] Logout
   - [ ] Login with first test account
   - [ ] Verify authentication works

### C. Tasks Tests
1. **Tasks Load**
   - [ ] Dashboard loads
   - [ ] "Your Tasks" section visible
   - [ ] Open DevTools Network tab
   - [ ] Should see request to `https://mushariq-full-stack-todo.hf.space/tasks/`
   - [ ] Status should be 200 (not 503, 404, or hanging)

2. **Create Task**
   - [ ] Enter task title
   - [ ] Click submit
   - [ ] Task appears in list
   - [ ] Network tab shows POST to `/tasks/` with 201 status

3. **Update Task**
   - [ ] Edit task title
   - [ ] Task updates in list
   - [ ] Network tab shows PUT to `/tasks/{id}` with 200 status

4. **Delete Task**
   - [ ] Delete a task
   - [ ] Task removed from list
   - [ ] Network tab shows DELETE to `/tasks/{id}` with 204 status

5. **Refresh & Persist**
   - [ ] Create multiple tasks
   - [ ] Refresh page
   - [ ] All tasks still visible
   - [ ] Proves data persists

### D. Chat Tests
1. **Access Chat**
   - [ ] Click "Go to ChatBot"
   - [ ] Chat page loads
   - [ ] No console errors

2. **Send Message**
   - [ ] Type: "hello"
   - [ ] Click Send
   - [ ] Wait 2-3 seconds
   - [ ] Agent responds
   - [ ] Network tab shows POST to `/api/chat` with 200 status

3. **Task Management via Chat**
   - [ ] Type: "create a task called production test"
   - [ ] Agent creates task
   - [ ] Task appears in dashboard
   - [ ] Verify in database

4. **List via Chat**
   - [ ] Type: "show my tasks"
   - [ ] Agent lists all tasks
   - [ ] Matches dashboard tasks

5. **Conversation Persistence**
   - [ ] Send multiple messages
   - [ ] Refresh page
   - [ ] Chat history loads
   - [ ] All previous messages visible

### E. Cross-Environment Tests
1. **Test Both URLs**
   - [ ] Use different browsers/incognito for each
   - [ ] Test local version: `http://localhost:3000`
   - [ ] Test production: `https://frontend-drab-eight-71.vercel.app/`
   - [ ] Both should work identically

2. **API Calls**
   - [ ] Check each endpoint returns 200:
     - [ ] `GET /` - root
     - [ ] `GET /health` - health check
     - [ ] `GET /ready` - readiness
     - [ ] `GET /tasks/` - tasks list (with auth)
     - [ ] `POST /api/chat` - chat message (with auth)

---

## 🐛 Phase 5: Troubleshooting

### If Tasks Not Loading

**Local:**
1. Backend running? `python src/main.py`
2. Check backend logs for errors
3. Database URL correct in `.env`?
4. Frontend console errors? (F12)

**Production:**
1. Check Vercel env vars set correctly
2. Check HuggingFace Space logs
3. Try health check endpoint
4. Verify `NEXT_PUBLIC_API_BASE_URL` in console

**Fix:**
```javascript
// From console, test directly
const token = localStorage.getItem('auth-token');
fetch('https://mushariq-full-stack-todo.hf.space/tasks/', {
  headers: {'Authorization': `Bearer ${token}`}
})
.then(r => console.log('Status:', r.status))
.catch(e => console.error('Error:', e));
```

### If Chat Not Working

1. Check `NEXT_PUBLIC_API_BASE_URL` is set
2. Verify `GOOGLE_API_KEY` on backend
3. Agent should fallback to mock if API key missing
4. Check backend logs for agent errors

### If 503 Errors

1. Backend might be starting up (wait 1-2 min)
2. Database connection timing out
3. Check HuggingFace Space logs
4. Restart Space if needed
5. Verify DATABASE_URL is correct

### If 401 Errors

1. Token expired? Logout and login again
2. Token not being sent? Check auth header
3. BETTER_AUTH_SECRET mismatch between frontend/backend?
4. JWT generation failing? Check frontend `/api/auth/jwt` logs

---

## 📊 Final Verification Summary

| Feature | Local | Production | Status |
|---------|-------|------------|--------|
| Frontend Loads | ✓ | ✓ | ✓ |
| Backend Health | ✓ | ✓ | ✓ |
| Signup | ✓ | ✓ | ✓ |
| Login | ✓ | ✓ | ✓ |
| View Tasks | ✓ | ✓ | ✓ |
| Create Task | ✓ | ✓ | ✓ |
| Update Task | ✓ | ✓ | ✓ |
| Delete Task | ✓ | ✓ | ✓ |
| Chat Send | ✓ | ✓ | ✓ |
| Chat Tools | ✓ | ✓ | ✓ |
| Persistence | ✓ | ✓ | ✓ |

---

## 🎉 Success Criteria

Your project is **COMPLETE** when:

1. ✅ Both local and production versions work identically
2. ✅ Authentication (signup/login) works
3. ✅ All CRUD operations on tasks work (Create, Read, Update, Delete)
4. ✅ Chat accepts messages and returns responses
5. ✅ Chat tools execute (create tasks via chat)
6. ✅ Data persists across page refreshes
7. ✅ No console errors in browser
8. ✅ API endpoints return proper status codes
9. ✅ Both environments accessible without timeouts
10. ✅ Full feature parity between local and production

---

## 📞 Quick Reference

**Local URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API: http://localhost:8000/tasks/, http://localhost:8000/api/chat

**Production URLs:**
- Frontend: https://frontend-drab-eight-71.vercel.app
- Backend: https://mushariq-full-stack-todo.hf.space
- API: https://mushariq-full-stack-todo.hf.space/tasks/, https://mushariq-full-stack-todo.hf.space/api/chat

**Key Commands:**
```bash
# Backend
cd backend && python src/main.py

# Frontend
cd frontend && npm run dev

# Test
curl https://mushariq-full-stack-todo.hf.space/health
```

**Quick Fix:**
If something breaks, check:
1. All environment variables set correctly
2. Backend logs for startup errors
3. Browser console for CORS/auth errors
4. Network tab for 503/timeout errors

---

**Go through this checklist completely. Your project will work perfectly! 🚀**
