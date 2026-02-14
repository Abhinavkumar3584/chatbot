# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.


- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Authentication integration (Phase 1)

This app now uses Firebase Authentication and must share the **same Firebase project** as the parent app.

### Setup

1. Copy [eligibilty/.env.example](.env.example) to `.env`.
2. Use the exact same `VITE_FIREBASE_*` values used in the parent app.

### Implemented behavior

- Email/password signup and login are live.
- Session persistence honors "Remember me":
  - `true` → local persistence
  - `false` → session-only persistence
- Logout synchronization is implemented between websites through Firestore `users/{uid}/authSync/state`.
- Expired/invalid sessions are handled gracefully via token checks.

### Manual verification checklist

1. Login on parent website (Site A).
2. Open this website (Site B):
	- If both are served under the same browser origin policy setup with shared Firebase persistence, the user is recognized.
3. Logout from Site A, keep Site B open:
	- Site B signs out via `authSync` state.
4. Logout from Site B, keep Site A open:
	- Site A signs out via `authSync` state.

## Secure exam data (moved from frontend JSON to Firestore)

Exam JSON is no longer bundled in the client app. The app now reads:

- catalog doc: `examCatalog/allExamNames`
- payload docs: `examData/{docId}`

### 1) Seed Firestore from local examsdata

Set one of these before running:

- `GOOGLE_APPLICATION_CREDENTIALS` (recommended), or
- `FIREBASE_SERVICE_ACCOUNT_PATH` (path to service account json)

Then run:

- `npm run seed:exam-data`

### 2) Deploy Firestore rules

Use [firestore.rules](firestore.rules).

This enforces:

- exam data readable only by authenticated users with custom claim `eligibility_reader=true`
- no client writes to exam data collections

Grant claim to an allowed account:

- `npm run set:eligibility-reader -- <firebase_uid> true`

Revoke claim:

- `npm run set:eligibility-reader -- <firebase_uid> false`

### 3) Frontend env

Add these to `.env` (already in [.env.example](.env.example)):

- `VITE_EXAM_CATALOG_COLLECTION=examCatalog`
- `VITE_EXAM_CATALOG_DOC_ID=allExamNames`
- `VITE_EXAM_DATA_COLLECTION=examData`
- `VITE_FIREBASE_APPCHECK_SITE_KEY=your_recaptcha_v3_site_key`

### 4) Enable App Check enforcement

In Firebase Console:

- Enable **App Check** for Firestore
- Register your web app with reCAPTCHA v3
- Add the site key in `.env`

This significantly reduces scripted scraping from non-genuine clients.
