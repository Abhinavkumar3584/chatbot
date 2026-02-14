# Heroku Deployment Guide

**Platform:** Heroku Basic Dyno  
**Cost:** $7/month (512MB RAM)  
**Target:** Production deployment of Flask RAG backend  
**Last Updated:** February 15, 2026

---

## Prerequisites

Before deploying, ensure you have:

✅ Heroku account (free tier works for setup, then upgrade to Basic)  
✅ Heroku CLI installed ([download here](https://devcenter.heroku.com/articles/heroku-cli))  
✅ Git repository with your backend code  
✅ Valid API keys:
- Pinecone API key
- OpenAI API key  
- Groq API key (optional but recommended)

---

## Step 1: Install Heroku CLI

### Linux/WSL:
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### macOS:
```bash
brew tap heroku/brew && brew install heroku
```

### Windows:
Download installer from https://devcenter.heroku.com/articles/heroku-cli

### Verify Installation:
```bash
heroku --version
# Should show: heroku/X.X.X linux-x64 node-vX.X.X
```

---

## Step 2: Login to Heroku

```bash
heroku login
# Opens browser for authentication
# Or use: heroku login -i  # For CLI-only login
```

---

## Step 3: Create Heroku App

```bash
cd /path/to/your/chatbot/backend

# Create new Heroku app
heroku create your-app-name
# Example: heroku create pratiyogita-gyan-backend

# Verify app created
heroku apps:info
```

**Important:** App name must be unique across all Heroku. If taken, try:
- `your-project-backend`
- `your-name-chatbot-api`
- Let Heroku auto-generate: `heroku create` (no name specified)

---

## Step 4: Set Environment Variables

Heroku uses "Config Vars" instead of .env files. Set all required variables:

### Critical Variables (REQUIRED):

```bash
# Flask environment
heroku config:set FLASK_ENV=production

# Debug mode (MUST be 0 for production to reduce log costs)
heroku config:set DEBUG_MODE=0

# API Keys
heroku config:set PINECONE_API_KEY=your_actual_pinecone_api_key_here
heroku config:set OPENAI_API_KEY=your_actual_openai_api_key_here
heroku config:set GROQ_API_KEY=your_actual_groq_api_key_here

# CORS (replace with your actual Vercel frontend URL)
heroku config:set ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Pinecone index names
heroku config:set RAG_INDEX_NAME=ncert-local-bge-base
heroku config:set MCQ_INDEX_NAME=pyq-bge-768
```

### Recommended Variables:

```bash
# LLM configuration
heroku config:set OPENAI_MODEL_NAME=gpt-4o-mini
heroku config:set OPENAI_TIMEOUT_SECONDS=20
heroku config:set GROQ_MODEL_NAME=llama-3.1-8b-instant

# Rate limiting (adjust based on your traffic)
heroku config:set RATE_LIMIT_MAX_REQUESTS=20
heroku config:set RATE_LIMIT_WINDOW_SECONDS=60

# Cache management
heroku config:set MAX_CACHE_SIZE=100
heroku config:set CACHE_CLEANUP_INTERVAL=300

# Embedding configuration
heroku config:set EMBEDDING_PROVIDER=local
heroku config:set LOCAL_EMBEDDING_MODEL=BAAI/bge-base-en-v1.5
heroku config:set EMBEDDING_DEVICE=cpu
```

### Verify Config Vars:

```bash
heroku config
# Should show all variables you just set
```

---

## Step 5: Verify Required Files

Ensure these files exist in your `backend/` directory:

### 1. Procfile (REQUIRED)
```bash
cat Procfile
# Should show:
# web: gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --threads 4 --worker-class gthread --timeout 180 --log-level info --access-logfile - --error-logfile -
```

### 2. runtime.txt (REQUIRED)
```bash
cat runtime.txt
# Should show:
# python-3.11.0
```

### 3. requirements.txt (REQUIRED)
```bash
head -5 requirements.txt
# Should list all dependencies like Flask, gunicorn, openai, etc.
```

### 4. .gitignore (RECOMMENDED)
Ensure `.env` is in `.gitignore` to prevent committing secrets:
```bash
echo ".env" >> .gitignore
```

---

## Step 6: Deploy to Heroku

### Option A: Deploy from Local Git

```bash
# Add Heroku remote (if not already added)
heroku git:remote -a your-app-name

# Commit any pending changes
git add .
git commit -m "Prepare for Heroku deployment"

# Deploy to Heroku
git push heroku main
# Or if your branch is named 'master':
# git push heroku master
```

### Option B: Deploy from GitHub

```bash
# Connect GitHub repo in Heroku dashboard
# Or via CLI:
heroku git:remote -a your-app-name
heroku git:clone -a your-app-name
```

Then push as normal.

---

## Step 7: Monitor Deployment

### Watch Build Logs:
```bash
heroku logs --tail

# Look for:
# ✅ "Build succeeded"
# ✅ "Launching..."
# ✅ "State changed from starting to up"
```

### Common Build Errors:

**Error:** `No web process running`  
**Fix:** Check Procfile exists and is named exactly `Procfile` (capital P)

**Error:** `Python version not available`  
**Fix:** Update runtime.txt to supported version (check [Heroku Python support](https://devcenter.heroku.com/articles/python-support))

**Error:** `requirements.txt not found`  
**Fix:** Ensure requirements.txt is in backend root directory

---

## Step 8: Scale to Basic Dyno

Free dynos sleep after 30 minutes. Upgrade to Basic for always-on:

```bash
# Upgrade to Basic dyno ($7/month, 512MB RAM)
heroku ps:scale web=1:basic

# Verify dyno type
heroku ps
# Should show: web.1: up YYYY/MM/DD HH:MM:SS +0000 (~ 1m ago)
```

**Cost Breakdown:**
- Basic dyno: $7/month
- 512MB RAM (sufficient for BGE-base model)
- No sleep (always on)
- Custom domain support

---

## Step 9: Verify Deployment

### 1. Check Health Endpoint:
```bash
curl https://your-app-name.herokuapp.com/api/health

# Expected response (first request may take 5-10s for model download):
# {"status": "healthy", "checks": {...}}
```

### 2. Test Search Endpoint:
```bash
curl -X POST https://your-app-name.herokuapp.com/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "What is photosynthesis?", "answer_length": "normal"}'

# Should return RAG answer with sources
```

### 3. Check Logs for Errors:
```bash
heroku logs --tail | grep -i error
# Should show no critical errors
```

---

## Step 10: Update Frontend to Use Heroku Backend

In your Vercel frontend environment variables:

```bash
# Set in Vercel dashboard > Settings > Environment Variables
VITE_API_BASE_URL=https://your-app-name.herokuapp.com
```

Redeploy frontend:
```bash
cd ../FRONTEND
vercel --prod
```

---

## Monitoring & Maintenance

### View Logs:
```bash
# Real-time logs
heroku logs --tail

# Last 100 lines
heroku logs -n 100

# Filter for errors
heroku logs --tail | grep ERROR
```

### Check Dyno Status:
```bash
heroku ps
# Shows: web.1: up YYYY/MM/DD HH:MM:SS
```

### View Metrics (Requires Heroku Dashboard):
1. Go to https://dashboard.heroku.com
2. Select your app
3. Click "Metrics" tab
4. Monitor:
   - Memory usage (should stay under 500MB)
   - Response time (should be <3s for RAG answers)
   - Throughput (requests/minute)
   - Error rate

### Restart Dyno (if needed):
```bash
heroku restart
# Use if app becomes unresponsive
```

---

## Troubleshooting

### Issue 1: High Memory Usage (R14 Errors)

**Symptom:** Logs show `Error R14 (Memory quota exceeded)`

**Cause:** Cache growing too large or memory leak

**Fix:**
```bash
# Reduce cache size
heroku config:set MAX_CACHE_SIZE=50

# Restart dyno
heroku restart

# Monitor memory
heroku logs --tail | grep R14
```

---

### Issue 2: Slow First Request (5-10 seconds)

**Symptom:** First request after dyno restart takes long

**Cause:** BGE-base model downloading (~438MB)

**Fix:** This is expected behavior on Heroku Basic
- Model downloads on first request
- Cached in memory after download
- Subsequent requests are fast
- Happens again after daily dyno restart (normal)

**Mitigation:**
- Keep dyno warm with health check pings every 25 minutes
- Or upgrade to hobby dyno with persistent storage

---

### Issue 3: Rate Limit Errors (429)

**Symptom:** Users see "Rate limit exceeded" errors

**Cause:** RATE_LIMIT_MAX_REQUESTS too low

**Fix:**
```bash
# Increase rate limit
heroku config:set RATE_LIMIT_MAX_REQUESTS=50
heroku config:set RATE_LIMIT_WINDOW_SECONDS=120

# Dyno restarts automatically, no manual restart needed
```

---

### Issue 4: CORS Errors from Frontend

**Symptom:** Frontend can't connect, "CORS policy" error in browser

**Cause:** ALLOWED_ORIGINS not set correctly

**Fix:**
```bash
# Verify current setting
heroku config:get ALLOWED_ORIGINS

# Update to match your Vercel URL
heroku config:set ALLOWED_ORIGINS=https://your-frontend.vercel.app

# For multiple origins (production + preview)
heroku config:set ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend-git-main.vercel.app
```

---

### Issue 5: OpenAI Timeout Errors

**Symptom:** Logs show "OpenAI request timed out"

**Cause:** OPENAI_TIMEOUT_SECONDS too low or OpenAI API slow

**Fix:**
```bash
# Increase timeout
heroku config:set OPENAI_TIMEOUT_SECONDS=30

# Or check OpenAI status
curl https://status.openai.com/api/v2/status.json
```

---

### Issue 6: "Application Error" on Browser

**Symptom:** Opening app URL shows "Application Error"

**Debugging Steps:**
```bash
# 1. Check if dyno is running
heroku ps
# Should show: web.1: up

# 2. Check recent logs for errors
heroku logs --tail

# 3. Common causes:
# - Missing PINECONE_API_KEY (check: heroku config:get PINECONE_API_KEY)
# - Missing ALLOWED_ORIGINS in production
# - Invalid Procfile

# 4. Restart dyno
heroku restart
```

---

## Environment Variable Quick Reference

### How to Change Variables:

```bash
# View all variables
heroku config

# Get specific variable
heroku config:get DEBUG_MODE

# Set variable
heroku config:set DEBUG_MODE=1

# Unset variable
heroku config:unset SOME_VAR

# Set multiple variables at once
heroku config:set VAR1=value1 VAR2=value2
```

### Important Notes:

- ✅ Changes apply immediately and restart dyno automatically
- ✅ No need to redeploy code for config changes
- ✅ Changes persist across deployments
- ❌ Cannot use .env file on Heroku (must use config vars)
- ❌ Config changes require restart (automatic in Heroku)

---

## Cost Optimization Tips

### 1. Keep DEBUG_MODE=0
```bash
heroku config:set DEBUG_MODE=0
# Reduces log volume → lower log retention costs
```

### 2. Use gpt-4o-mini
```bash
heroku config:set OPENAI_MODEL_NAME=gpt-4o-mini
# Cheapest OpenAI model, good quality for education
```

### 3. Set Rate Limits
```bash
heroku config:set RATE_LIMIT_MAX_REQUESTS=20
# Prevents abuse and excessive API costs
```

### 4. Monitor Heroku Costs
- Check dashboard monthly
- Basic dyno: $7/month (fixed)
- Log retention: Free tier sufficient with DEBUG_MODE=0
- External APIs (OpenAI, Pinecone): Pay-per-use

**Expected Total Cost:**
- Heroku dyno: $7/month
- Pinecone Serverless: Free tier (100k vectors)
- OpenAI API: ~$5-15/month (depends on usage)
- **Total: $12-22/month**

---

## Performance Expectations

### Response Times (Heroku Basic):
- Health check: <100ms
- MCQ search: 200-500ms
- RAG answer (normal): 1-3s
- RAG answer (explanatory): 2-5s
- First request after restart: 5-10s (model download)

### Throughput:
- Concurrent requests: 4 (1 worker × 4 threads)
- Requests/minute: 30-60 (conservative estimate)
- Rate limit: 20 requests/60s per IP (configurable)

### Memory Usage:
- Gunicorn master: ~50MB
- Worker 1: ~450MB (includes BGE-base model)
- Cache: ~10MB
- **Total: ~510MB** (within 512MB limit)

---

## Security Checklist

Before going live:

- [x] FLASK_ENV=production
- [x] DEBUG_MODE=0
- [x] ALLOWED_ORIGINS set to HTTPS URLs only
- [x] .env file in .gitignore (never committed)
- [x] API keys set via Heroku Config Vars (not in code)
- [x] Rate limiting enabled
- [x] Request size limits (1MB max)
- [x] HTTPS enforced for production origins

---

## Next Steps After Deployment

### Immediate (First Hour):
1. ✅ Verify health endpoint
2. ✅ Test search endpoint
3. ✅ Check logs for errors
4. ✅ Test from frontend
5. ✅ Monitor memory usage

### First Week:
1. Monitor error rate in logs
2. Check LLM API costs (OpenAI dashboard)
3. Adjust rate limits if needed
4. Verify cache is working (check logs)
5. Test under load

### Optional Enhancements:
1. Add Sentry for error tracking
2. Set up uptime monitoring (Pingdom, UptimeRobot)
3. Configure custom domain
4. Add Redis for distributed caching
5. Implement request queuing

---

## Useful Commands Cheat Sheet

```bash
# Deployment
git push heroku main                    # Deploy latest code
heroku restart                          # Restart dyno

# Logs
heroku logs --tail                      # Real-time logs
heroku logs -n 200                      # Last 200 lines
heroku logs --tail | grep ERROR         # Filter errors

# Config
heroku config                           # View all variables
heroku config:set KEY=value             # Set variable
heroku config:get KEY                   # Get variable

# Dyno Management
heroku ps                               # Check dyno status
heroku ps:scale web=1:basic             # Scale to Basic
heroku restart                          # Restart dyno

# Debugging
heroku run bash                         # SSH into dyno
heroku run python                       # Python REPL
heroku releases                         # View deployment history
heroku rollback                         # Rollback to previous version

# Addons (Optional)
heroku addons:create heroku-postgresql  # Add database
heroku addons:create heroku-redis       # Add Redis
```

---

## Support & Resources

### Heroku Documentation:
- [Python Support](https://devcenter.heroku.com/articles/python-support)
- [Deploying Python](https://devcenter.heroku.com/articles/deploying-python)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- [Config Vars](https://devcenter.heroku.com/articles/config-vars)

### Project Documentation:
- [.env.example](/.env.example) - Full environment variable guide
- [BACKEND_ISSUES_STATUS.md](/BACKEND_ISSUES_STATUS.md) - All fixes applied
- [PRODUCTION_FIXES_SUMMARY.md](/PRODUCTION_FIXES_SUMMARY.md) - Deployment readiness

### Get Help:
- Heroku Support: https://help.heroku.com
- Project Issues: [Your GitHub repo issues]
- Stack Overflow: Tag `heroku` + `flask`

---

**Deployment Status:** ✅ **READY FOR HEROKU PRODUCTION**

Your backend is fully configured for Heroku Basic deployment with optimized memory usage, proper logging, security hardening, and configurable rate limiting. Follow this guide step-by-step for successful deployment.
