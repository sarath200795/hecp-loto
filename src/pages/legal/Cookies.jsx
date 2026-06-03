import LegalLayout, { H2 } from './LegalLayout'

export default function Cookies() {
  return (
    <LegalLayout title="Cookies & Storage" updated="2026-06-03">
      <p>
        HECP LOTO ("the Service") does <strong>not</strong> use advertising or third-party tracking
        cookies, and we do not sell or share data for advertising. The app uses a small amount of
        <strong> essential browser storage</strong> to function.
      </p>

      <H2>What we store in your browser</H2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Firebase Auth session</strong> (<code>sessionStorage</code>): keeps you signed in
          for the current browser session — cleared when the browser closes.
        </li>
        <li>
          <strong>
            <code>hecp:lastActivity</code>
          </strong>{' '}
          (<code>localStorage</code>): shared inactivity timer powering the auto-logout.
        </li>
        <li>
          <strong>
            <code>hecp:sessionExpired</code>
          </strong>{' '}
          (<code>localStorage</code>): one-shot flag to show the "signed out due to inactivity"
          notice on the login screen.
        </li>
        <li>
          <strong>Firebase identifiers</strong> (<code>localStorage</code> / IndexedDB): standard
          Firebase SDK operation for Auth and Firestore.
        </li>
      </ul>
      <p>
        These are <strong>strictly necessary</strong> for authentication, security (session
        timeout), and core functionality. There are no analytics or marketing cookies.
      </p>

      <H2>Optional abuse protection</H2>
      <p>
        If the operator enables Firebase App Check (reCAPTCHA v3), Google may set reCAPTCHA-related
        storage to distinguish humans from bots. This is a security measure, not advertising.
      </p>

      <H2>Managing storage</H2>
      <p>
        You can clear this data at any time in your browser settings ("Clear site data"). Clearing
        it signs you out and resets the inactivity timer; disabling storage entirely will prevent
        sign-in.
      </p>

      <p className="text-steel-400">
        Details are maintained in the repository's <code>COOKIES.md</code>.
      </p>
    </LegalLayout>
  )
}
