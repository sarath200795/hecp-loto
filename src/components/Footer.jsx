import { Link } from 'react-router-dom'

// App-wide footer: legal links + a short LOTO safety disclaimer.
export default function Footer() {
  const year = 2026
  return (
    <footer className="mt-10 border-t border-steel-700/40 px-4 py-6 text-center text-xs text-steel-400">
      <div className="mx-auto max-w-4xl space-y-2">
        <p>
          <span className="font-semibold text-steel-300">HECP LOTO</span> assists with
          Lockout/Tagout documentation — it does not verify physical energy isolation and is not a
          substitute for a compliant energy-control program (e.g. OSHA 29 CFR 1910.147) or qualified
          personnel.
        </p>
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span>© {year} WE EHS</span>
          <span aria-hidden>·</span>
          <Link to="/privacy" className="hover:text-amber-600">
            Privacy Policy
          </Link>
          <span aria-hidden>·</span>
          <Link to="/terms" className="hover:text-amber-600">
            Terms of Service
          </Link>
          <span aria-hidden>·</span>
          <Link to="/data-retention" className="hover:text-amber-600">
            Data Retention
          </Link>
          <span aria-hidden>·</span>
          <Link to="/cookies" className="hover:text-amber-600">
            Cookies &amp; Storage
          </Link>
        </p>
      </div>
    </footer>
  )
}
