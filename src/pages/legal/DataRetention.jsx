import LegalLayout, { H2 } from './LegalLayout'

export default function DataRetention() {
  return (
    <LegalLayout title="Data Retention" updated="2026-06-03">
      <p>
        This policy describes how long HECP LOTO ("the Service") keeps data and how deletion works.
        Operators should align the periods below with their own record-keeping obligations.
      </p>

      <H2>Retention by data type</H2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Account</strong> (email, name, role, organization, status): for the life of the
          account; removed on account deletion.
        </li>
        <li>
          <strong>Organization</strong> (name, members, permissions): while the organization is
          active.
        </li>
        <li>
          <strong>Procedures, isolation points, photos</strong>: until deleted by an authorized
          user (revisions retain history).
        </li>
        <li>
          <strong>LOTO activity log</strong>: <strong>append-only and retained for audit
          integrity</strong> — not deleted when a lock is removed, and kept per your safety
          record-keeping obligations.
        </li>
        <li>
          <strong>Technicians &amp; lock inventory</strong>: while active / until removed by an
          admin.
        </li>
        <li>
          <strong>Authentication session</strong>: browser session only (ends when the browser
          closes); no server-side session store.
        </li>
        <li>
          <strong>Provider backups</strong>: per Google Firebase / Vercel backup schedules, then
          aged out.
        </li>
      </ul>

      <H2>Deletion</H2>
      <p>
        Authorized users can delete procedures and photos in-app (removing both the procedure and
        its photo document). Account or organization deletion requests can be made to the
        operator's privacy contact. Entries in the append-only activity log may be exempt from
        deletion where retention is required for workplace-safety compliance.
      </p>

      <H2>Principles</H2>
      <p>
        We keep personal data only as long as needed for the purposes set out in the Privacy
        Policy or as required by law, and we minimize what we store (photos are compressed; no
        tracking data is collected).
      </p>

      <p className="text-steel-400">
        The full policy is maintained in the repository's <code>DATA_RETENTION.md</code>.
      </p>
    </LegalLayout>
  )
}
