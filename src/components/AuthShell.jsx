import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import LockMcbMark from './LockMcbMark'

const FeatureIcon = ({ d }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {d}
  </svg>
)

const FEATURES = [
  {
    icon: <FeatureIcon d={<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3M21 21v.01M17 21h.01M21 17h.01" /></>} />,
    label: 'QR-tagged procedures, publicly scannable',
  },
  {
    icon: <FeatureIcon d={<><path d="M12 3l8 4v5c0 4.4-3.1 7.9-8 9-4.9-1.1-8-4.6-8-9V7l8-4z" /><path d="m9 12 2 2 4-4" /></>} />,
    label: 'Org-scoped access with admin approvals',
  },
  {
    icon: <FeatureIcon d={<><path d="M4 19V5M4 19h16" /><rect x="7" y="11" width="3" height="5" rx="0.5" /><rect x="12" y="8" width="3" height="8" rx="0.5" /><rect x="17" y="13" width="3" height="3" rx="0.5" /></>} />,
    label: 'Live, color-coded LOTO register',
  },
]

const LEGAL = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/data-retention', label: 'Data Retention' },
  { to: '/cookies', label: 'Cookies & Storage' },
]

/**
 * Split-screen layout for the auth pages: dark industrial brand panel on the
 * left (logo, headline, feature rows, legal footer), form card on the right.
 * Collapses to a single column on mobile.
 */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="hecp-grid-bg flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="hazard-stripes absolute inset-x-0 top-0 h-1.5 opacity-80" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-hazard to-hazard-dark text-ink shadow-clay">
            <LockMcbMark size={24} />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            HECP <span className="text-amber-600">LOTO</span>
          </span>
        </motion.div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="max-w-md text-4xl font-extrabold leading-tight tracking-tight text-steel-50"
          >
            Hazardous energy,{' '}
            <span className="text-amber-600">locked down.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 max-w-md text-steel-300"
          >
            Build LOTO procedures, generate energy tags &amp; QR codes, and track every
            isolation point across your sites — in one auditable system.
          </motion.p>

          <div className="mt-8 max-w-md space-y-2.5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-hazard/15 text-amber-500">
                  {f.icon}
                </span>
                <span className="text-sm font-medium text-steel-200">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-xs text-steel-500">
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            {LEGAL.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-amber-600">
                {l.label}
              </Link>
            ))}
          </nav>
          <div>© {2026} HECP LOTO · Lockout / Tagout platform</div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="clay-card w-full max-w-md p-8"
        >
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-hazard to-hazard-dark text-ink">
              <LockMcbMark size={18} />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              HECP <span className="text-amber-600">LOTO</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-steel-50">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-steel-400">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-steel-400">{footer}</div>}
        </motion.div>

        {/* Legal links (kept reachable on mobile where the brand panel is hidden) */}
        <nav className="mt-6 flex max-w-md flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-steel-500">
          {LEGAL.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-amber-600">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
