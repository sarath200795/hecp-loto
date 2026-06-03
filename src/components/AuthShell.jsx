import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import LockMcbMark from './LockMcbMark'

/**
 * Split-screen layout for the auth pages: animated industrial brand panel on
 * the left, form card on the right. Collapses to a single column on mobile.
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
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-hazard to-hazard-dark text-ink shadow-clay">
            <LockMcbMark size={26} />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
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
            Hazardous Energy Control,{' '}
            <span className="text-amber-600">locked down.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 max-w-md text-steel-300"
          >
            Build LOTO procedures, generate energy tags & QR codes, and track
            every isolation point across your sites — in one auditable system.
          </motion.p>

          <div className="mt-8 flex flex-wrap gap-2">
            {['Electrical', 'Mechanical', 'Hydraulic', 'Pneumatic', 'Chemical', 'Gravitational'].map(
              (e, i) => (
                <motion.span
                  key={e}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="rounded-full border border-steel-700 bg-steel-900/60 px-3 py-1 text-xs font-medium text-steel-300"
                >
                  {e}
                </motion.span>
              ),
            )}
          </div>
        </div>

        <div className="text-xs text-steel-500">
          © {new Date().getFullYear()} HECP Operations · Lockout / Tagout platform
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
          <div className="mb-6 lg:hidden">
            <span className="text-lg font-extrabold tracking-tight">
              HECP <span className="text-amber-600">LOTO</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-steel-50">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-steel-400">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-steel-400">{footer}</div>}
        </motion.div>
        <p className="mt-6 max-w-md text-center text-xs text-steel-500">
          By continuing you agree to our{' '}
          <Link to="/terms" className="hover:text-amber-600">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="hover:text-amber-600">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
