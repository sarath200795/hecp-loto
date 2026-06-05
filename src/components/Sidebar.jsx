import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { RoleBadge } from './ui/Badge'
import LockMcbMark from './LockMcbMark'

const Icon = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
)
const ICONS = {
  home: <Icon d={<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>} />,
  inventory: <Icon d={<><rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v12h14V8" /><path d="M9 12h6" /></>} />,
  register: <Icon d={<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>} />,
  create: <Icon d={<><path d="M12 5v14M5 12h14" /></>} />,
  approvals: <Icon d={<><path d="M20 6 9 17l-5-5" /></>} />,
  users: <Icon d={<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 7a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6" /></>} />,
  operate: <Icon d={<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>} />,
  tech: <Icon d={<><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>} />,
  locks: <Icon d={<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>} />,
  sites: <Icon d={<><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>} />,
}

function NavItem({ to, end, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
          isActive
            ? 'bg-hazard text-ink shadow-clay'
            : 'text-[#cfc9bf] hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}

function Group({ title, children }) {
  return (
    <div className="mb-1">
      <div className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-[#7c766b]">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function SidebarContent({ onNavigate }) {
  const { profile, org, isAdmin, can, PERMISSIONS, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    toast.success('Signed out')
    navigate('/login')
  }

  const initials =
    profile?.displayName?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '··'

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <button onClick={() => { navigate('/app'); onNavigate?.() }} className="flex items-center gap-3 px-4 py-4">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-hazard to-hazard-dark text-ink shadow-clay">
          <LockMcbMark size={24} />
        </span>
        <div className="text-left leading-tight">
          <div className="text-sm font-extrabold tracking-tight text-white">
            HECP <span className="text-hazard">LOTO</span>
          </div>
          <div className="max-w-[150px] truncate text-[11px] text-[#9a948a]">
            {org?.name || 'Operations'}
          </div>
        </div>
      </button>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 pb-2">
        <Group title="Overview">
          <NavItem to="/app" end icon={ICONS.home} label="Dashboard" onClick={onNavigate} />
        </Group>

        {can(PERMISSIONS.PROCEDURE_VIEW) && (
          <Group title="LOTO">
            {can(PERMISSIONS.LOTO_PERFORM) && (
              <NavItem to="/app/operations" icon={ICONS.operate} label="LOTO Operations" onClick={onNavigate} />
            )}
            <NavItem to="/app/inventory" icon={ICONS.inventory} label="Procedure Inventory" onClick={onNavigate} />
            <NavItem to="/app/register" icon={ICONS.register} label="LOTO Register" onClick={onNavigate} />
            {can(PERMISSIONS.PROCEDURE_CREATE) && (
              <NavItem to="/app/procedures/new" icon={ICONS.create} label="Create Procedure" onClick={onNavigate} />
            )}
          </Group>
        )}

        {isAdmin && (
          <Group title="Admin">
            <NavItem to="/app/approvals" icon={ICONS.approvals} label="Approvals" onClick={onNavigate} />
            <NavItem to="/app/users" icon={ICONS.users} label="Users" onClick={onNavigate} />
            <NavItem to="/app/sites" icon={ICONS.sites} label="Sites" onClick={onNavigate} />
            <NavItem to="/app/technicians" icon={ICONS.tech} label="Technicians" onClick={onNavigate} />
            <NavItem to="/app/locks" icon={ICONS.locks} label="Lock Inventory" onClick={onNavigate} />
          </Group>
        )}
      </nav>

      {/* User card */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-hazard to-hazard-dark text-sm font-bold text-ink">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white">{profile?.displayName}</div>
            <div className="truncate text-[11px] text-[#9a948a]">{profile?.email}</div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          {profile?.role && <RoleBadge role={profile.role} />}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/15 px-2.5 py-1 text-xs font-medium text-[#cfc9bf] transition-colors hover:border-danger/60 hover:text-danger"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

const DARK = 'bg-[#1f1c17]'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setOpen(false), [location.pathname])

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-30 hidden w-64 ${DARK} shadow-clay lg:block`}>
        <SidebarContent />
      </aside>

      {/* Mobile top bar (dark to match the sidebar aesthetic) */}
      <div className={`sticky top-0 z-30 flex h-14 items-center justify-between ${DARK} px-4 shadow-md lg:hidden`}>
        <span className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-white">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-hazard to-hazard-dark text-ink">
            <LockMcbMark size={17} />
          </span>
          HECP <span className="text-hazard">LOTO</span>
        </span>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg border border-white/15 p-2 text-[#cfc9bf]"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className={`fixed inset-y-0 left-0 z-50 w-64 ${DARK} shadow-clay lg:hidden`}
            >
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
