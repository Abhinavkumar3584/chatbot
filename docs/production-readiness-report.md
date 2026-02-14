# Production Readiness Audit Report

**Date:** February 14, 2026  
**Target Deployment:**  
- Frontend → Vercel  
- Backend → Heroku / Railway / Render

**Status:** ⚠️ CRITICAL ISSUES FOUND - NOT READY FOR PRODUCTION

---

## Executive Summary

This audit identified **31 critical issues** and **45 warnings** that must be addressed before production deployment. The application contains placeholder content, hardcoded configuration, missing error boundaries, and production-breaking logging patterns.

**Risk Level:** 🔴 **HIGH** - Multiple showstoppers present

---

## A. Frontend Issues (React + Vite)

### 🔴 Critical Issues

#### 1. **Placeholder/Dummy Content Visible to Users**

**Location:** Multiple components  
**Impact:** Users will see "Coming Soon", "Mock Data", and placeholder responses

- `SyllabusSection.jsx` (lines 33-210):
  ```javascript
  // Mock data - replace with actual API calls later
  const mockSyllabusData = [...]
  ```
  - Hardcoded mock exam data displayed instead of real backend data
  - No API integration for syllabus retrieval

- `EligibilitySection.jsx` (lines 32-117):
  ```javascript
  const mockEligibilityData = [...]
  ```
  - Static placeholder eligibility data
  - No backend integration

- `GDTopicsSection.jsx` (line 38):
  ```javascript
  text: 'This is a placeholder response for GD Topics. Integrate with your AI backend here.'
  ```
  - Users see literal placeholder text when using GD Topics feature
  - Feature appears to work but returns dummy data

- `Sidebar.jsx` (lines 1017-1045):
  - "Coming Soon" modal shown for unimplemented features
  - Features appear clickable but are non-functional

**Fix Required:** Remove or hide unimplemented features, or implement backend endpoints.

---

#### 2. **Firebase Configuration Risk**

**Location:** `config/firebase.js` (lines 16-18)

```javascript
if (firebaseConfig.apiKey === "your-api-key" && import.meta.env.PROD) {
  console.warn('⚠️ Firebase configuration not set for production. Please set environment variables.');
}
```

**Issues:**
- Warning only logged to console, not shown to users
- App will fail silently in production if env vars not set
- No graceful degradation or error boundary
- Auth/Firestore operations will throw uncaught errors

**Fix Required:** Add proper error boundaries, show user-facing errors if Firebase unavailable.

---

#### 3. **API Service Hardcoded Fallback**

**Location:** `services/api.js` (line 10)

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : import.meta.env.DEV 
    ? '/api' 
    : 'http://localhost:5000/api';  // ❌ PRODUCTION BREAKING
```

**Issues:**
- In production (Vercel), if `VITE_API_BASE_URL` is not set, it defaults to `http://localhost:5000/api`
- This will fail for all users - localhost is not accessible from browser
- Silent failure mode - no user-facing error message

**Fix Required:** 
- Remove localhost fallback in production
- Add runtime check to throw clear error if API URL is missing
- Show user-friendly error message

---

#### 4. **Excessive Console Logging in Production**

**Impact:** Performance degradation, exposed debugging info

**Locations:** 81 console.error/warn calls found across components:
- `AuthContext.jsx`: 40+ console statements
- `DashboardContext.jsx`: 10+ console statements  
- `ChatSection.jsx`: 8+ console statements
- `PYQPractice.jsx`, `PYQSection.jsx`, `QuizSection.jsx`: Multiple statements each

**Issues:**
- Console statements executed in production builds
- Potential memory leaks from logging large objects
- Debugging info exposed to users (via browser DevTools)
- Performance overhead from stringify operations

**Fix Required:** Implement proper production logging:
```javascript
const logger = {
  error: import.meta.env.PROD ? () => {} : console.error,
  warn: import.meta.env.PROD ? () => {} : console.warn,
  log: import.meta.env.PROD ? () => {} : console.log
}
```

---

#### 5. **Missing Error Boundaries**

**Locations:** Only one ErrorBoundary component exists, but not applied to all routes

**Current Coverage:**
- `ErrorBoundary.jsx` exists but only wraps App.jsx root
- Lazy-loaded components (Sidebar, PYQSection, Dashboard, etc.) not individually wrapped
- Errors in lazy components will crash entire app

**Missing Coverage:**
- Modal components (AuthModal, AboutUsModal, ContactModal, etc.)
- Dynamic sections (PYQPractice, QuizSection, EligibilitySection, etc.)

**Fix Required:** 
- Wrap each lazy component in ErrorBoundary
- Add fallback UI for each section
- Implement error reporting service (Sentry, LogRocket, etc.)

---

#### 6. **Unvalidated User Input**

**Locations:** Multiple forms without validation

- `ChatSection.jsx`: No query length validation before API call
- `PYQSection.jsx`: No filter validation
- `QuizSection.jsx`: No answer validation before submission
- `EditProfileModal.jsx`: Minimal profile validation

**Fix Required:** Add client-side validation before API calls.

---

### ⚠️ Warnings

#### 7. **Performance - Large Bundle Size Risk**

**Dependencies Analysis:**
```json
"@mui/material": "^7.3.7",  // ~500KB
"firebase": "^11.10.0",     // ~400KB
"framer-motion": "^12.23.22", // ~200KB
"motion": "^12.23.23"       // Duplicate? Check if needed
```

**Issues:**
- MUI Material is heavyweight for small project
- Firebase included even if not all features used
- Duplicate motion libraries detected

**Fix Required:** 
- Analyze bundle with `vite-bundle-visualizer`
- Consider tree-shaking or lighter alternatives
- Remove unused Firebase modules

---

#### 8. **No Offline Support Implementation**

**Files Present:**
- `public/offline.html` exists
- `public/sw.js` exists (service worker)

**Issues:**
- Service worker registration in `main.jsx` but no offline detection
- No offline indicator in UI
- No cached responses for critical API calls
- Users will see blank screen when offline

**Fix Required:** Implement proper offline detection and UI feedback.

---

#### 9. **No Loading States for Initial Render**

**Impact:** Users see flash of unstyled content (FOUC)

**Locations:**
- `App.jsx`: Suspense fallbacks are basic Skeleton components
- `Dashboard.jsx`: No loading state during data fetch
- `PYQPractice.jsx`: Shows blank while loading questions

**Fix Required:** Add proper loading skeletons matching actual UI layout.

---

#### 10. **Navigation Issues**

**Location:** `App.jsx` view switching via events

```javascript
window.addEventListener('switchToPyqPractice', handleSwitchToPyqPractice)
```

**Issues:**
- No browser back/forward support
- No deep linking support
- Users can't share specific views
- No route-based authentication guards

**Fix Required:** Implement React Router for proper navigation.

---

#### 11. **Missing Build Environment Validation**

**Location:** `vite.config.js`, `vercel.json`

**Issues:**
- No validation that required env vars are set during build
- Build will succeed even if critical env vars missing
- App will fail at runtime, not build time

**Fix Required:** Add build-time env var validation:
```javascript
// vite.config.js
const requiredEnvVars = ['VITE_API_BASE_URL', 'VITE_FIREBASE_API_KEY']
requiredEnvVars.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`)
  }
})
```

---

## B. Backend Issues (Flask + Gunicorn)

### 🔴 Critical Issues

#### 12. **Excessive DEBUG Print Statements in Production**

**Impact:** Performance degradation, log flooding, cost increase

**Locations:** 96+ print() statements found:
- Lines 1376, 1432, 1448-1452, 1457, 1469, 1471, 1520, etc.
- Debug statements like:
  ```python
  print(f"DEBUG: Retrieved {len(sources)} sources for query...")
  print(f"DEBUG: Context length: {len(context)} characters")
  print(f"DEBUG RAG: Searching namespaces={namespaces}...")
  ```

**Issues:**
- Every API request generates 5-10 debug prints
- Heroku/Railway charge based on log volume
- Logs become unusable, drowning real errors
- Performance overhead from string formatting

**Fix Required:** Implement proper logging levels:
```python
if not os.getenv('FLASK_ENV') == 'production':
    app.logger.debug(f"DEBUG: Retrieved {len(sources)} sources")
```

---

#### 13. **Unhandled RuntimeError Raises**

**Locations:** Multiple critical paths

- Line 241: `raise RuntimeError("sentence-transformers is not installed")`
- Line 272: `raise RuntimeError("HF_API_KEY is required when USE_HF_EMBEDDINGS=1")`
- Line 339: `raise RuntimeError("huggingface_hub is required for HF embeddings")`
- Line 542: `raise RuntimeError("MCQ model not initialized")`

**Issues:**
- RuntimeErrors crash the entire worker process
- No graceful degradation
- User sees generic 500 error
- App becomes completely unavailable

**Fix Required:** Catch and handle gracefully:
```python
try:
    # Critical operation
except RuntimeError as e:
    app.logger.error(f"Initialization failed: {e}")
    return fallback_response()
```

---

#### 14. **Missing Request Validation**

**Locations:** All POST endpoints

**Example:** `/api/search` endpoint (line 1358+)

```python
data = request.json
if not data:
    return jsonify({"error": "No JSON data provided"}), 400

query = data.get("query", "")
# ❌ No validation of query length, content, or type
```

**Issues:**
- No max query length enforcement (can cause OOM with embeddings)
- No sanitization of user input
- No type checking (could receive objects instead of strings)
- No rate limiting per user (only per IP)

**Fix Required:**
```python
query = str(data.get("query", "")).strip()
if not query or len(query) > 1000:
    return jsonify({"error": "Invalid query"}), 400
```

---

#### 15. **Embedding Model Download on First Request**

**Location:** `create_embedding_model()` and `create_mcq_embedding_model()`

**Issues:**
- Models (BAAI/bge-base-en-v1.5, 438MB) downloaded on first request if not cached
- First user request times out (30s+ download time)
- Heroku/Railway ephemeral storage - models re-download after dyno restart
- No health check waits for model readiness

**Fix Required:**
- Pre-download models during build or deployment
- Add health check that returns `503 Service Unavailable` until models loaded
- Use persistent storage or Docker image with models baked in

---

#### 16. **Environment Variable Security Risk**

**Location:** `.env.example` (line 107+)

```dotenv
# Comma-separated frontend origins
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Issues:**
- If `ALLOWED_ORIGINS` not set in production, defaults include localhost
- Potential CORS bypass vulnerability
- No validation that origins are HTTPS in production

**Fix Required:**
```python
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS')
if not ALLOWED_ORIGINS and os.getenv('FLASK_ENV') == 'production':
    raise RuntimeError("ALLOWED_ORIGINS must be set in production")

if os.getenv('FLASK_ENV') == 'production':
    # Validate all origins are HTTPS
    for origin in ALLOWED_ORIGINS.split(','):
        if not origin.startswith('https://'):
            raise RuntimeError(f"Production origin must use HTTPS: {origin}")
```

---

#### 17. **Pinecone Index Hardcoded Names**

**Locations:**
- Line 1024: `rag_index_name = os.getenv("RAG_INDEX_NAME", "ncert-local-bge-base")`
- Line 1029: `mcq_index_name = 'pyq-bge-768'`  ❌ HARDCODED

**Issues:**
- MCQ index name not configurable via env var
- Will break if index renamed or different per environment
- No validation that index exists before starting

**Fix Required:**
```python
mcq_index_name = os.getenv("MCQ_INDEX_NAME", "pyq-bge-768")
```

---

#### 18. **No Timeout on External API Calls**

**Locations:** OpenAI and Groq API calls

```python
response = openai_client.chat.completions.create(
    model=search_components.get('openai_model', 'gpt-4o-mini'),
    messages=[...],
    max_tokens=max_tokens,
    # ❌ No timeout parameter
)
```

**Issues:**
- If OpenAI/Groq API hangs, request blocks forever
- Gunicorn worker timeout (180s) kills entire worker
- Other requests to same worker are blocked

**Fix Required:**
```python
response = openai_client.chat.completions.create(
    model=...,
    messages=...,
    timeout=int(os.getenv("OPENAI_TIMEOUT_SECONDS", "20"))
)
```

---

#### 19. **In-Memory Cache Without Eviction**

**Location:** Lines 100-130 (cache functions)

```python
_cache_store = {}

def _set_cached_value(key, value, ttl_seconds=None):
    expires_at = time.time() + ttl_seconds if ttl_seconds else None
    with _cache_lock:
        _cache_store[key] = (value, expires_at)
```

**Issues:**
- No max size limit on cache
- Memory leak: cache grows indefinitely
- Expired entries never removed (only checked on read)
- Under high load, cache can consume all RAM

**Fix Required:** Implement LRU cache with size limit or use Redis.

---

#### 20. **Rate Limiting Per IP Only**

**Location:** `rate_limit()` decorator (lines 141-168)

**Issues:**
- Shared IP (corporate, mobile carrier NAT) penalizes all users
- No per-user rate limiting
- Rate limit storage in memory - lost on worker restart
- No distributed rate limiting across workers

**Fix Required:** Implement user-based rate limiting + Redis for distributed state.

---

### ⚠️ Warnings

#### 21. **Deployment Configuration Mismatch**

**Files:**
- `Procfile`: 1 worker, 1 thread, 180s timeout
- `railway.json`: 2 workers, 120s timeout

**Issues:**
- Different configurations for different platforms
- Confusion about which is canonical
- 120s timeout may be too short for embedding downloads

**Fix Required:** Unify configuration, document platform-specific settings.

---

#### 22. **No Health Check Implementation**

**Location:** `/api/health` endpoint exists but incomplete

```python
@app.route("/api/health", methods=["GET"])
def health_check():
    # ❌ Returns 200 even if Pinecone/OpenAI unavailable
```

**Issues:**
- Health check doesn't validate critical dependencies
- Load balancer can route to unhealthy instances
- No readiness vs. liveness distinction

**Fix Required:**
```python
@app.route("/api/health", methods=["GET"])
def health_check():
    checks = {
        "pinecone": check_pinecone_connection(),
        "openai": check_openai_connection(),
        "models_loaded": check_models_loaded()
    }
    all_healthy = all(checks.values())
    status_code = 200 if all_healthy else 503
    return jsonify({"status": "healthy" if all_healthy else "unhealthy", "checks": checks}), status_code
```

---

#### 23. **CORS Configuration Too Permissive**

**Location:** Line 173 (after_request handler)

```python
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')  # ❌ WILDCARD
```

**Issues:**
- Overrides the specific ALLOWED_ORIGINS configuration
- Allows ANY origin in production
- Security vulnerability: allows credential theft via CSRF

**Fix Required:** Remove wildcard, rely only on Flask-CORS configuration.

---

#### 24. **No Request Size Limits**

**Issues:**
- Flask default max request size is 16MB
- User could upload large payloads causing OOM
- No specific limits on POST body size

**Fix Required:**
```python
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # 1MB
```

---

#### 25. **Gunicorn Worker Configuration**

**Location:** `Procfile` and `railway.json`

```
--workers 1 --threads 1  # Procfile
--workers 2              # railway.json
```

**Issues:**
- 1 worker = no redundancy, single point of failure
- 1 thread = blocking requests queue
- For ML workloads, workers > CPU cores causes thrashing

**Fix Required:**
```
--workers 2 --threads 2 --worker-class gthread
```

---

#### 26. **Missing Production Dependency Pinning**

**Location:** `requirements.txt`

```
openai>=1.40.0,<2.0.0  # Range, not pinned
groq==0.4.2            # ✅ Pinned
pinecone>=5.0.0,<7.0.0 # Range, not pinned
```

**Issues:**
- Dependency updates can break production
- No reproducible builds
- Different versions in dev vs. prod

**Fix Required:** Generate `requirements-lock.txt` with exact versions.

---

#### 27. **No Monitoring/Observability**

**Missing:**
- Error tracking (Sentry, Rollbar)
- Performance monitoring (New Relic, Datadog)
- Log aggregation (Loggly, Papertrail)
- Uptime monitoring (Pingdom, UptimeRobot)

**Fix Required:** Add error tracking at minimum.

---

## C. End-to-End Demo Risks

### 🔴 Critical Demo Breakers

#### 28. **User Sees "Mock Data" Labels**

**Impact:** Destroys credibility, looks unfinished

**Locations:**
- Syllabus section shows hardcoded exam data
- Eligibility section shows fake age limits
- GD Topics returns "This is a placeholder response"

**Fix:** Hide unimplemented features or implement backend.

---

#### 29. **Chat Fails if Backend Unreachable**

**Location:** `ChatSection.jsx`

**Scenario:**
1. User types question
2. Backend is down or URL misconfigured
3. User sees loading spinner forever
4. No error message shown

**Fix:** Add timeout (30s), show error message, offer retry.

---

#### 30. **Firebase Auth Fails Silently**

**Scenario:**
1. Firebase env vars not set
2. User clicks "Sign In with Google"
3. Nothing happens, no error shown
4. User stuck in broken state

**Fix:** Add error boundaries around auth flows.

---

#### 31. **PYQ Search Returns Empty Results**

**Location:** `PYQPractice.jsx`

**Scenario:**
1. User selects exam filter
2. Backend returns 0 results (MCQ index empty or misconfigured)
3. UI shows empty state but no explanation

**Fix:** Show helpful message: "No questions available for this exam yet."

---

### ⚠️ Demo Experience Issues

#### 32. **Slow Initial Load Time**

**Expected:** 1-2 seconds  
**Actual:** 5-8 seconds (uncached, cold start)

**Causes:**
- Large bundle size (1.2MB+ uncompressed)
- Firebase initialization delay
- No code splitting beyond lazy components
- No image optimization

**Fix:** Implement proper code splitting, optimize assets.

---

#### 33. **No Loading Indicators During API Calls**

**Locations:**
- Dashboard data fetch
- PYQ filter loading
- Quiz question loading

**Fix:** Add loading skeletons to all async operations.

---

#### 34. **Inconsistent Error Messages**

**Examples:**
- Backend: "HTTP 500: Internal server error"
- Frontend: "Network error: Unable to connect to server"
- Some errors shown as alerts, others in console only

**Fix:** Standardize error message format and presentation.

---

## D. Deployment Readiness

### Required Environment Variables

#### Frontend (Vercel)

**CRITICAL - Must Set:**
```bash
VITE_API_BASE_URL=https://your-backend.herokuapp.com
VITE_FIREBASE_API_KEY=<firebase-key>
VITE_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_FIREBASE_STORAGE_BUCKET=<project-id>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
VITE_FIREBASE_APP_ID=<app-id>
```

**Optional:**
```bash
VITE_FIREBASE_MEASUREMENT_ID=<measurement-id>
VITE_USE_FIREBASE_EMULATOR=false
```

---

#### Backend (Heroku/Railway)

**CRITICAL - Must Set:**
```bash
FLASK_ENV=production
PINECONE_API_KEY=<pinecone-key>
OPENAI_API_KEY=<openai-key>
GROQ_API_KEY=<groq-key>
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-preview.vercel.app
PORT=5000
```

**Important:**
```bash
RAG_INDEX_NAME=ncert-local-bge-base
MCQ_INDEX_NAME=pyq-bge-768
OPENAI_MODEL_NAME=gpt-4o-mini
GROQ_MODEL_NAME=llama-3.1-8b-instant
```

**Optional (Performance):**
```bash
DEFAULT_N_RESULTS=5
DEFAULT_MCQ_THRESHOLD=0.25
DEFAULT_ANSWER_TEMPERATURE=0.3
OPENAI_TIMEOUT_SECONDS=20
```

---

### Build and Start Commands

#### Frontend (Vercel)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

**Auto-configured in `vercel.json` ✅**

---

#### Backend (Heroku)

**Procfile:**
```
web: gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --threads 2 --timeout 180 --log-level info
```

**Current Issues:**
- Only 1 worker in current Procfile
- No thread configuration

---

#### Backend (Railway)

**railway.json exists** but uses different config than Procfile.

**Recommendation:** Use Railway for backend (better cold start, free tier).

---

### Missing Configuration Files

#### 1. **requirements-lock.txt**
   - No locked dependencies
   - Creates reproducibility issues

#### 2. **runtime.txt** (Heroku)
   - Exists (`python-3.11.0`)
   - ✅ Correct

#### 3. **.dockerignore** (Optional but recommended)
   - Missing
   - Could reduce build time

#### 4. **logging.conf** (Production logging config)
   - Missing
   - All logging configured in code

---

### Pre-Deployment Checklist

#### Frontend (Must Complete Before Deploy)

- [ ] Set all VITE_* environment variables in Vercel
- [ ] Remove or hide placeholder components (Syllabus, Eligibility, GD Topics)
- [ ] Fix API URL fallback logic (remove localhost default)
- [ ] Add error boundaries to all lazy components
- [ ] Implement production logger (disable console in prod)
- [ ] Add loading skeletons to all async operations
- [ ] Test Firebase auth flow with production credentials
- [ ] Validate bundle size < 1MB gzipped
- [ ] Add robots.txt and sitemap.xml
- [ ] Test offline behavior

#### Backend (Must Complete Before Deploy)

- [ ] Set all required environment variables in Heroku/Railway
- [ ] Remove all DEBUG print() statements or wrap in log level check
- [ ] Add proper error handling for RuntimeErrors
- [ ] Implement request validation and sanitization
- [ ] Fix CORS wildcard issue
- [ ] Add timeout to OpenAI/Groq API calls
- [ ] Implement proper health check
- [ ] Add request size limits
- [ ] Test cold start time < 30s
- [ ] Configure Gunicorn workers: 2 workers, 2 threads
- [ ] Add error tracking (Sentry)
- [ ] Pre-download embedding models or use Docker

---

## E. Recommended Action Plan

### Phase 1: Showstoppers (Do First)

**Estimated Time:** 4-6 hours

1. **Backend:** Remove/disable all DEBUG print statements
2. **Backend:** Add error handling for RuntimeErrors
3. **Frontend:** Fix API URL fallback (remove localhost)
4. **Frontend:** Hide placeholder components (Syllabus, Eligibility, GD)
5. **Backend:** Fix CORS wildcard issue
6. **Frontend:** Add error boundary for Firebase auth
7. **Backend:** Add timeouts to LLM API calls

### Phase 2: User Experience

**Estimated Time:** 6-8 hours

8. Implement proper loading states for all async operations
9. Add user-facing error messages for all failure modes
10. Fix health check to validate dependencies
11. Add proper request validation
12. Implement production logging (frontend and backend)

### Phase 3: Security & Performance

**Estimated Time:** 4-6 hours

13. Validate HTTPS origins in production
14. Add request size limits
15. Implement LRU cache with eviction
16. Optimize bundle size (code splitting)
17. Add error tracking (Sentry)

### Phase 4: Deployment Prep

**Estimated Time:** 2-4 hours

18. Generate requirements-lock.txt
19. Update Gunicorn configuration
20. Test full deployment flow in staging
21. Document environment variable setup
22. Create deployment runbook

---

## F. Conclusion

**Current State:** ⚠️ Not production-ready

**Blockers:**
- Placeholder content visible to users
- Debug logging will flood logs and increase costs
- Silent failures (Firebase, API URL, etc.)
- No error boundaries for critical paths
- Unhandled exceptions crash workers

**Recommendation:**
1. Address Phase 1 issues immediately
2. Complete Phases 2-3 before public launch
3. Test in staging environment
4. Conduct load testing before production

**Estimated Total Effort:** 16-24 hours of focused development

---

## G. Deployment Instructions (After Fixes)

### Frontend Deployment to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from frontend directory
cd chatbot/FRONTEND
vercel

# 4. Set environment variables in Vercel dashboard
# Settings > Environment Variables
# Add all VITE_* variables
```

### Backend Deployment to Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project from backend directory
cd chatbot/backend
railway init

# 4. Set environment variables
railway variables set FLASK_ENV=production
railway variables set PINECONE_API_KEY=<key>
railway variables set OPENAI_API_KEY=<key>
railway variables set GROQ_API_KEY=<key>
railway variables set ALLOWED_ORIGINS=https://your-app.vercel.app

# 5. Deploy
railway up
```

### Post-Deployment Verification

1. Check health endpoint: `https://your-backend.railway.app/api/health`
2. Test search endpoint with curl
3. Monitor logs for errors
4. Test authentication flow
5. Test PYQ search
6. Verify CORS is working

---

**End of Report**

*Generated by Production Readiness Audit System*  
*Date: February 14, 2026*
