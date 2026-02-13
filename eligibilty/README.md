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
