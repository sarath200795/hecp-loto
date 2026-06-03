import { Link } from 'react-router-dom'
import LockMcbMark from '../../components/LockMcbMark'
import Footer from '../../components/Footer'

// Shared shell for the public /privacy and /terms pages.
export default function LegalLayout({ title, updated, children }) {
  return (
    <div className="min-h-screen bg-clay">
      <header className="border-b border-steel-700/40 bg-claySurface/70 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-steel-50">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-hazard to-hazard-dark text-ink">
              <LockMcbMark size={17} />
            </span>
            HECP <span className="text-amber-600">LOTO</span>
          </Link>
          <Link to="/login" className="text-sm text-steel-400 hover:text-amber-600">
            Back to app →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-steel-50">{title}</h1>
        {updated && <p className="mt-1 text-xs text-steel-400">Last updated: {updated}</p>}
        <div className="legal-prose mt-6 space-y-4 text-sm leading-relaxed text-steel-200">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export function H2({ children }) {
  return <h2 className="mt-6 text-lg font-bold text-steel-50">{children}</h2>
}
