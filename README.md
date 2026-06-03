# HECP · LOTO Operations

Multi-organization web app for **Hazardous Energy Control Procedures (Lockout / Tagout)**.

**Auth & organization**
- Organization registration (first user becomes the **Admin**)
- Member sign-up via a unique **join code**
- Admin **approval queue** (assign role on approval) + **user management** (roles + per-user permission overrides)
- **Role-Based Access Control** — Admin, Safety Team, Engineering Team, Technician

**LOTO modules**
- **Procedure builder** — organization/site/equipment + multiple isolation points; each point captures energy source (auto-numbered E-1, M-1, H-1… and color-coded), LOTO device type, isolation details, hazard, photo (Firebase Storage), verification.
- **Document generation** — per-procedure **QR code** (links to the public scan view), printable **procedure PDF**, and a **energy-tag sheet** (one color-coded tag per isolation point with point ID, QR, hardware, equipment).
- **Procedure inventory** — filter by site / equipment / status; regenerate PDF & tags; revise; delete.
- **Approval workflow** — draft → send for approval → approve / reject, with revision tracking.
- **QR scan-to-perform** — scanning a tag opens a public read-only view; signing in (with `loto.perform`) unlocks the lock-out controls.
- **LOTO register** — live lock state per isolation point: unlocked / partially locked / **equipment locked**, including who locked each point and when.

Real-time Firestore data throughout, animated UI (Framer Motion), Tailwind styling.

## Tech stack

Vite · React (JSX) · React Router · Firebase (Auth + Firestore) · Tailwind CSS · Framer Motion · react-hot-toast
Quality: ESLint · Prettier · Vitest + Testing Library · GitHub Actions (CI, CodeQL, Vercel deploy, Firestore-rules deploy) · Dependabot

> Members join by selecting their organization from a dropdown at sign-up (admin then approves); the legacy join code is no longer required.

## 1. Firebase setup

1. Create a project at <https://console.firebase.google.com>.
2. **Authentication → Sign-in method →** enable **Email/Password**.
3. **Firestore Database →** create a database. **Keep the Database ID as `(default)`** and choose **Native** mode. (The web SDK connects to `(default)` unless you set `VITE_FIREBASE_FIRESTORE_DB` — see below. A *named* database that isn't `(default)` will make every read/write time out.)
4. **Storage →** _not required_. Isolation-point photos are compressed in-browser and stored in Firestore (collection `procedurePhotos`), so Firebase Storage / the Blaze plan is not needed.
5. **Project settings → General → Your apps →** add a **Web app** and copy the config values.
6. Deploy the security rules:
   - **Firestore → Rules** — paste [`firestore.rules`](./firestore.rules) (or `firebase deploy --only firestore:rules`). These cover `organizations`, `users`, `procedures`, and `procedurePhotos`. **Re-publish whenever the rules file changes.**
   - **Storage → Rules** — not needed (Storage is unused).

> **Security note:** single-doc procedure reads are intentionally **public** so a scanned QR code shows the procedure without login (performing actions still requires auth + permission). Document IDs are random and unguessable. Listing/querying and all writes remain restricted to org members. A later phase can move the QR lookup behind a callable Cloud Function to remove public reads entirely.

## 2. Local environment

```bash
cp .env.example .env.local
```

Fill in the values from the Firebase web-app config:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Optional — only if your Firestore database is NOT named "(default)".
# Set it to your named database's Database ID; otherwise leave blank.
VITE_FIREBASE_FIRESTORE_DB=

# Optional — Firebase App Check (reCAPTCHA v3) site key. Leave blank to disable.
VITE_FIREBASE_RECAPTCHA_KEY=
```

> The `VITE_FIREBASE_*` values are a **public client identifier**, not secrets — access is enforced by [`firestore.rules`](./firestore.rules) and (optionally) App Check. Keep them in `.env.local` (git-ignored) for local dev and in your host's env for production.

## Scripts & quality gates

```bash
npm run dev        # local dev server
npm run lint       # ESLint
npm run test       # Vitest (watch)   ·   npm run test:run = single run
npm run build      # production build
npm run format     # Prettier write   ·   npm run format:check = verify
```

CI runs `lint`, `test:run`, `build`, `npm audit`, and CodeQL on every push/PR.

## 3. Run

```bash
npm install
npm run dev
```

Open the printed URL (default <http://localhost:5173>).

## 4. Try it end-to-end

1. **Register an organization** → you become the Admin and are shown a **join code**.
2. Open a second browser/incognito → **Sign up** with that join code → you land on **Awaiting approval**.
3. Back as the Admin → **Approvals** → approve the user and pick a role.
4. The pending tab auto-advances to the dashboard the moment you're approved.
5. **Users** → change roles or toggle individual permissions; module tiles and nav appear/disappear based on permissions.
6. **Create** → build a LOTO procedure: add isolation points (energy source auto-numbers E-1/M-1…), upload a photo per point, save.
7. On the procedure detail page → **Generate PDF** and **Generate tags** (downloads), or **Send for approval** / **Approve** / **Revise** / **Delete** per your role.
8. Print a tag, **scan its QR** with a phone (or open `/p/<id>`) → public view; sign in to **lock out** each point.
9. **Register** dashboard shows live lock state — equipment turns **“Equipment locked”** once every point is locked.
10. **Inventory** dashboard → filter by site / equipment / status and regenerate documents.

> The QR code encodes `https://<your-domain>/p/<procedureId>`. On `localhost` it points to localhost; once deployed it points to your Vercel domain, so regenerate/print tags from the deployed app for real-world scanning.

## 5. Deploy (CI/CD)

The repo ships with GitHub Actions:

- **CI** (`.github/workflows/ci.yml`) — lint, test, build, dependency audit on every push/PR.
- **CodeQL** (`.github/workflows/codeql.yml`) — static security analysis.
- **Deploy** (`.github/workflows/deploy.yml`) — **preview** deploy on PRs, **production** on push to `main`, via the Vercel CLI.
- **Firestore rules** (`.github/workflows/firestore-rules.yml`) — auto-publishes `firestore.rules` on `main` when they change (no manual console re-paste).

[`vercel.json`](./vercel.json) rewrites routes to `index.html` and sets HTTP **security headers** (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors).

### Required GitHub repository secrets

Add under **GitHub → Settings → Secrets and variables → Actions**:

| Secret                     | Where to get it                                                                 |
| -------------------------- | ------------------------------------------------------------------------------- |
| `VERCEL_TOKEN`             | vercel.com → Account → Tokens                                                   |
| `VERCEL_ORG_ID`            | local `.vercel/project.json` → `orgId` (run `vercel link` once)                 |
| `VERCEL_PROJECT_ID`        | local `.vercel/project.json` → `projectId`                                      |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Console → Project settings → Service accounts → Generate key (paste the JSON) — _optional, enables rules auto-deploy_ |

The deploy/rules workflows **skip cleanly (green) until these secrets exist**, so CI stays green on the first PR. Set the `VITE_FIREBASE_*` env vars in the **Vercel project** (Settings → Environment Variables) — the deploy workflow pulls them via `vercel pull`.

### One-time setup

1. In Firebase **Authentication → Settings → Authorized domains**, add your production domain (e.g. `hecp-loto.vercel.app`).
2. Enable **branch protection** on `main` (require CI to pass + a review).
3. (Optional) Enable **Firebase App Check** (console) and set `VITE_FIREBASE_RECAPTCHA_KEY`.

## 6. Security

- **Authorization** is enforced server-side in [`firestore.rules`](./firestore.rules): per-`orgId` isolation, role/permission gates, immutable `orgId`, write-shape validation, an append-only audit log (`lotoEvents`), and documented public single-doc reads for QR scanning. The UI mirrors these for UX only.
- **HTTP headers** + CSP are set in `vercel.json`.
- **Scanning:** Dependabot + `npm audit` (dependencies) on every repo; **CodeQL** (source) runs automatically on **public** repos or when **GitHub Advanced Security** is enabled — it is skipped on private repos (so CI stays green) and turns on by itself once available.
- **Optional App Check** (reCAPTCHA v3) gates Firestore/Auth against abuse.
- Report vulnerabilities per [`SECURITY.md`](./SECURITY.md). Never commit secrets — `.env*.local` and service-account keys are git-ignored.

## 7. Legal & safety

- **License:** [MIT](./LICENSE).
- **Privacy / Terms / Disclaimer:** [`PRIVACY.md`](./PRIVACY.md), [`TERMS.md`](./TERMS.md), [`DISCLAIMER.md`](./DISCLAIMER.md) — also available in-app at `/privacy` and `/terms`, with a required consent checkbox at sign-up.
- **Safety:** HECP LOTO assists with LOTO documentation; it **does not verify physical energy isolation** and is **not a substitute** for a compliant energy-control program or qualified personnel (e.g. OSHA 29 CFR 1910.147). See the disclaimer.
- Replace the bracketed placeholders (company legal name, contact emails, governing jurisdiction) in the legal docs before production use.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the contributor workflow.

## Project structure

```
src/
  firebase/config.js            Firebase init (Auth, Firestore, Storage)
  constants/roles.js            Roles, permissions, role→permission matrix
  constants/energySources.js    Energy sources + colors/prefixes
  constants/procedures.js       Procedure & lock statuses, lock-summary helper
  context/AuthContext.jsx       Auth state, profile/org subscriptions, actions
  services/procedures.js        Procedure CRUD, photo upload, lock/unlock, approval
  utils/codes.js                Procedure codes + isolation-point numbering
  utils/qr.js                   QR data-URL generation
  utils/pdf.js                  Procedure PDF + energy-tag sheet (lazy-loaded)
  hooks/useOrgProcedures.js     Real-time org procedure list
  components/                   AuthShell, Navbar, guards, ui/, procedures/
  pages/                        Login, Signup, RegisterOrg, PendingApproval, Home
  pages/procedures/             CreateProcedure, ProcedureDetail, Inventory, Register
  pages/scan/ScanView.jsx       Public QR scan landing (/p/:id)
  pages/admin/                  UserApprovals, UserManagement
firestore.rules                 Multi-tenant rules (public single-doc procedure reads)
storage.rules                   Isolation-photo upload rules
```
