# Privacy Policy

_Last updated: 2026-06-03_

This Privacy Policy explains how **HECP LOTO** ("the Service", "we") collects,
uses, and protects personal data. **Operator note:** replace the bracketed
placeholders (legal entity, contact email, governing jurisdiction) before
production use. Depending on your deployment you may be a **data controller**
and/or **processor** for your organization's data.

## 1. Who we are

- **Data controller:** [Your Company Legal Name], [address].
- **Contact / DPO:** [privacy@your-company-domain].

## 2. Data we collect

| Category               | Examples                                                                 | Source            |
| ---------------------- | ------------------------------------------------------------------------ | ----------------- |
| Account data           | Email address, display name, role, organization, approval status         | You, at signup    |
| Organization data      | Organization name, members, permissions                                  | Org admin         |
| LOTO operational data  | Procedures, isolation points, equipment, technicians, lock numbers, lock/unlock activity and timestamps, group-lock membership | You, in use       |
| Images                 | Compressed isolation-point photos (stored in the database, not Storage)  | You, optional     |
| Technical data         | Authentication tokens/session (Firebase Auth), basic device/browser info | Automatically     |

We do **not** intentionally collect special-category data. Do not upload
photos containing unnecessary personal information.

## 3. How we use it

- Provide authentication, multi-tenant access control, and the LOTO workflow.
- Generate procedures, energy tags, QR codes, and the audit register.
- Maintain a permanent, append-only **activity log** for safety auditing.
- Secure the Service and prevent abuse.

**Legal bases (GDPR):** performance of a contract (providing the Service),
legitimate interests (security, audit integrity), legal obligation (workplace
safety record-keeping where applicable), and consent (accepted at signup).

## 4. Processors / sub-processors

The Service runs on **Google Firebase** (Authentication and Cloud Firestore)
and is hosted on **Vercel**. These providers process data on our behalf under
their respective data-processing terms. Data may be processed in regions
operated by these providers.

## 5. Retention

- Account and organization data: for the life of the account.
- **Activity-log (`lotoEvents`) records are append-only and retained for audit
  integrity** and are not deleted on unlock; they may be retained per your
  safety record-keeping obligations.
- Procedures/photos: until deleted by an authorized user.

## 6. Your rights

Subject to applicable law (GDPR/UK GDPR/CCPA and similar), you may request
**access, correction, deletion, restriction, portability, or objection**, and
(CCPA) to know/delete and opt out of "sale" (we do not sell personal data).
Audit-log entries may be exempt from deletion where retention is legally
required. To exercise rights, contact [privacy@your-company-domain]. You may
also lodge a complaint with your supervisory authority.

## 7. Security

Access is enforced by server-side Firestore Security Rules with per-organization
isolation and role/permission checks; transport is encrypted (HTTPS); optional
Firebase App Check mitigates abuse. See [`SECURITY.md`](./SECURITY.md).

## 8. Cookies & local storage

We use browser local storage for authentication/session state (Firebase Auth).
We do not use third-party advertising or tracking cookies.

## 9. Children

The Service is intended for workplace use by adults and is not directed to
children.

## 10. Changes

We may update this policy; material changes will be reflected by the "Last
updated" date and, where appropriate, in-app notice.
