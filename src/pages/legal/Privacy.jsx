import LegalLayout, { H2 } from './LegalLayout'

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="9 June 2026">
      <p>
        This policy explains how HECP LOTO ("the Service"), operated by <strong>WE EHS</strong>{' '}
        (India), collects, uses, and protects personal data. WE EHS may act as a data controller
        and/or processor for your organization's data. Contact:{' '}
        <a href="mailto:sarath200795@gmail.com" className="font-semibold text-amber-600">sarath200795@gmail.com</a>.
      </p>

      <H2>Data we collect</H2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Account data: email, display name, role, organization, approval status.</li>
        <li>Organization data: organization name, members, permissions.</li>
        <li>
          LOTO operational data: procedures, isolation points, equipment, technicians, lock numbers,
          lock/unlock activity and timestamps, group-lock membership.
        </li>
        <li>Images: compressed isolation-point photos stored in the database.</li>
        <li>Technical: authentication session (Firebase Auth) and basic device/browser info.</li>
      </ul>

      <H2>How we use it</H2>
      <p>
        To provide authentication and access control, run the LOTO workflow, generate procedures /
        tags / QR codes / the audit register, maintain a permanent append-only activity log for
        safety auditing, and secure the Service. Legal bases (GDPR) include contract performance,
        legitimate interests (security and audit integrity), legal obligation, and consent.
      </p>

      <H2>Processors</H2>
      <p>
        The Service runs on Google Firebase (Authentication and Cloud Firestore) and is hosted on
        Vercel, which process data on our behalf under their data-processing terms.
      </p>

      <H2>Retention</H2>
      <p>
        Account/organization data is kept for the life of the account. Activity-log records are
        append-only and retained for audit integrity (not deleted on unlock). Procedures and photos
        are kept until deleted by an authorized user.
      </p>

      <H2>Your rights</H2>
      <p>
        Subject to applicable law (GDPR/UK GDPR/CCPA and similar), you may request access,
        correction, deletion, restriction, portability, or objection, and opt out of any "sale" of
        personal data (we do not sell personal data). Audit-log entries may be exempt from deletion
        where retention is legally required. To exercise these rights, contact your administrator
        or WE EHS at sarath200795@gmail.com.
      </p>

      <H2>Security & cookies</H2>
      <p>
        Access is enforced server-side by Firestore Security Rules with per-organization isolation
        and role/permission checks; transport is encrypted (HTTPS); optional Firebase App Check
        mitigates abuse. We use browser local storage for authentication/session state only — no
        third-party advertising or tracking cookies.
      </p>

      <p className="text-steel-400">
        The complete policy, including processor details and contacts, is maintained in the
        repository's <code>PRIVACY.md</code>.
      </p>
    </LegalLayout>
  )
}
