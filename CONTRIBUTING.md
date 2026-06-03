# Contributing to HECP LOTO

Thanks for your interest in improving HECP LOTO. This is a safety-adjacent tool,
so correctness and clear review matter.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Firebase web config
npm run dev
```

## Quality gates (run before opening a PR)

```bash
npm run lint        # ESLint (must pass)
npm run test:run    # Vitest unit + smoke tests (must pass)
npm run build       # production build (must pass)
npm run format      # Prettier (optional, keeps style consistent)
```

CI runs lint, tests, build, and CodeQL on every pull request; a Vercel **preview**
deployment is created for review.

## Workflow

1. Branch from `main` (e.g. `feat/...`, `fix/...`, `chore/...`).
2. Keep changes focused; add/adjust tests for logic changes (see
   `src/**/*.test.js`).
3. Open a PR using the template; describe the change and how you verified it.
4. At least one approval + green CI is required to merge (branch protection).
5. Merging to `main` triggers a **production** deploy.

## Conventions

- JavaScript/JSX (no TypeScript). React 18 + React Router + Firebase modular SDK.
- Tailwind for styling (note the inverted `steel` scale — see `tailwind.config.js`).
- Server-side authorization lives in `firestore.rules`; the UI mirrors it for UX
  only. Any new collection needs matching rules **and** a CI rules deploy.
- Don't commit secrets. `.env*.local` and service-account keys are git-ignored.

## Reporting issues

- Security vulnerabilities: follow [`SECURITY.md`](./SECURITY.md) (do not open a
  public issue).
- Bugs/features: open a GitHub issue with steps to reproduce / context.

By contributing, you agree your contributions are licensed under the project's
[MIT License](./LICENSE).
