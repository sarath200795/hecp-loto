# Data Retention Policy

_Last updated: 2026-06-03_

This policy describes how long HECP LOTO retains data and how deletion works.
**Operator note:** adjust the periods below to match your organization's
record-keeping obligations and replace the bracketed contact.

## Retention by data type

| Data                                   | Retention                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------- |
| Account (email, name, role, org, status) | For the life of the account; removed on account deletion.               |
| Organization (name, members, permissions) | While the organization is active.                                       |
| Procedures, isolation points, photos   | Until deleted by an authorized user (revisions keep history).             |
| **LOTO activity log (`lotoEvents`)**   | **Append-only and retained for audit integrity** — not deleted on unlock; kept per your safety record-keeping obligations. |
| Technicians & lock inventory           | While active / until removed by an admin.                                 |
| Authentication session                 | Browser session only (ends on browser close); no server-side session store. |
| Provider backups (Firebase/Vercel)     | Per Google Firebase / Vercel backup schedules, then aged out.             |

## Deletion

- Authorized users can delete procedures and photos in-app; deletion removes the
  main document and its photo document.
- Account/organization deletion requests: contact **[privacy@your-company-domain]**.
- **Audit-log exemption:** entries in the append-only activity log may be exempt
  from deletion where retention is required for workplace-safety compliance.

## Principles

We keep personal data only as long as needed for the purposes in the
[Privacy Policy](./PRIVACY.md) or as required by law, and we minimize what we
store (e.g., photos are compressed; no tracking data is collected).
