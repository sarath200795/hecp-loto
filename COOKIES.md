# Cookies & Storage

_Last updated: 2026-06-03_

HECP LOTO does **not** use advertising or third-party tracking cookies, and we
do not sell or share data for advertising. The app uses a small amount of
**essential browser storage** to function.

## What we store in your browser

| Key / mechanism                          | Purpose                                                     | Type             |
| ---------------------------------------- | ----------------------------------------------------------- | ---------------- |
| Firebase Auth session                    | Keeps you signed in **for the current browser session** (cleared when the browser closes). | `sessionStorage` |
| `hecp:lastActivity`                      | Shared inactivity timer for the auto-logout (idle timeout). | `localStorage`   |
| `hecp:sessionExpired`                    | One-shot flag to show the "signed out due to inactivity" notice on the login screen. | `localStorage`   |
| Firebase installation / app identifiers  | Standard Firebase SDK operation (Auth/Firestore).           | `localStorage` / IndexedDB |

These are **strictly necessary** for authentication, security (session timeout),
and core functionality. There are no analytics or marketing cookies.

## Optional abuse protection

If the operator enables **Firebase App Check** (reCAPTCHA v3), Google may set
reCAPTCHA-related storage to distinguish humans from bots. This is a security
measure, not advertising.

## Managing storage

You can clear this data at any time via your browser settings
("Clear site data" / cookies & site data for this site). Clearing it signs you
out and resets the inactivity timer. Disabling storage entirely will prevent
sign-in.

Questions: **[privacy@your-company-domain]**.
