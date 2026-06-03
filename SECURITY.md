# Security Policy

## Supported versions

This project is under active development. Security fixes are applied to the
latest `main` and the current production deployment only.

| Version            | Supported |
| ------------------ | --------- |
| `main` (latest)    | ✅        |
| older tags/commits | ❌        |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Report privately via one of:

- GitHub's **[Private vulnerability reporting](https://github.com/sarath200795/hecp-loto/security/advisories/new)**
  (Security tab → Report a vulnerability), or
- Email **security@<your-company-domain>** with details and reproduction steps.

Please include:

- A description of the issue and its impact.
- Steps to reproduce (proof of concept if possible).
- Affected URL/commit and any relevant logs (redact secrets).

### Our commitment

- We acknowledge reports within **3 business days**.
- We provide a remediation timeline after triage (typically ≤ 30 days for
  high/critical issues).
- We credit reporters in the advisory unless anonymity is requested.

## Scope & handling notes

- **Secrets:** the Firebase web config (`VITE_FIREBASE_*`) is a public client
  identifier, not a secret — security is enforced by Firestore Security Rules
  and (optionally) Firebase App Check, not by hiding these values. Service
  account keys, deploy tokens, and `.env*.local` files are secrets and are
  git-ignored; never commit them.
- **Authorization:** all multi-tenant isolation and permission checks are
  enforced server-side in [`firestore.rules`](./firestore.rules). The UI mirrors
  these checks for UX only.
- **Dependencies:** Dependabot and `npm audit` (in CI) track known
  vulnerabilities; CodeQL scans the source on every push/PR.
- **Disclosure:** we follow coordinated disclosure — please give us reasonable
  time to fix before any public disclosure.
