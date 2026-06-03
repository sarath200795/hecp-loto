import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import toast from 'react-hot-toast'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import {
  ASSIGNABLE_ROLES,
  PERMISSIONS,
  PERMISSION_LABELS,
  ROLE_META,
  USER_STATUS,
  permissionsForRole,
} from '../../constants/roles'
import Card from '../../components/ui/Card'
import Spinner from '../../components/ui/Spinner'
import { RoleBadge, StatusBadge } from '../../components/ui/Badge'
import PageHeader, { HdrIcon } from '../../components/PageHeader'

const ALL_PERMISSIONS = Object.values(PERMISSIONS)

function UserRow({ user, isSelf, onRole, onTogglePerm }) {
  const [open, setOpen] = useState(false)
  return (
    <Card animate={false} className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-steel-700 font-bold text-steel-100">
            {user.displayName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="flex items-center gap-2 font-semibold text-steel-50">
              {user.displayName}
              {isSelf && (
                <span className="rounded bg-steel-700 px-1.5 py-0.5 text-[10px] font-bold text-steel-300">
                  YOU
                </span>
              )}
            </div>
            <div className="text-sm text-steel-400">{user.email}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={user.status} />
          <RoleBadge role={user.role} />
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg border border-steel-700 px-2.5 py-1 text-xs font-medium text-steel-300 hover:border-steel-500"
          >
            {open ? 'Close' : 'Manage'}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 overflow-hidden border-t border-steel-800 pt-4"
        >
          {user.status !== USER_STATUS.APPROVED ? (
            <p className="text-sm text-steel-400">
              This user is {user.status}. Manage them from the Approvals queue.
            </p>
          ) : isSelf ? (
            <p className="text-sm text-steel-400">
              You can't change your own role or permissions to avoid locking
              yourself out. Ask another admin if needed.
            </p>
          ) : (
            <>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-steel-400">
                Role
              </div>
              <div className="flex flex-wrap gap-2">
                {ASSIGNABLE_ROLES.map((r) => {
                  const m = ROLE_META[r]
                  const active = user.role === r
                  return (
                    <button
                      key={r}
                      onClick={() => onRole(user, r)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                        active
                          ? m.accent
                          : 'border-steel-700 text-steel-300 hover:border-steel-500'
                      }`}
                    >
                      {m.label}
                    </button>
                  )
                })}
              </div>

              <div className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-steel-400">
                Permissions
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {ALL_PERMISSIONS.map((perm) => {
                  const checked = user.permissions?.includes(perm)
                  return (
                    <label
                      key={perm}
                      className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-steel-800 bg-steel-900/40 px-3 py-2 text-sm"
                    >
                      <span className="text-steel-200">{PERMISSION_LABELS[perm]}</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={checked}
                        onClick={() => onTogglePerm(user, perm)}
                        className={`relative h-5 w-9 rounded-full transition-colors ${
                          checked ? 'bg-safe' : 'bg-steel-700'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                            checked ? 'left-[18px]' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </label>
                  )
                })}
              </div>
            </>
          )}
        </motion.div>
      )}
    </Card>
  )
}

export default function UserManagement() {
  const { profile } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.orgId) return undefined
    const q = query(collection(db, 'users'), where('orgId', '==', profile.orgId))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsub
  }, [profile?.orgId])

  const sorted = useMemo(
    () =>
      [...users].sort((a, b) =>
        (a.displayName || '').localeCompare(b.displayName || ''),
      ),
    [users],
  )

  async function changeRole(user, role) {
    try {
      await updateDoc(doc(db, 'users', user.id), {
        role,
        permissions: permissionsForRole(role),
      })
      toast.success(`${user.displayName} is now ${ROLE_META[role].short}`)
    } catch (err) {
      toast.error(err.message || 'Update failed')
    }
  }

  async function togglePerm(user, perm) {
    const next = user.permissions?.includes(perm)
      ? user.permissions.filter((p) => p !== perm)
      : [...(user.permissions || []), perm]
    try {
      await updateDoc(doc(db, 'users', user.id), { permissions: next })
    } catch (err) {
      toast.error(err.message || 'Update failed')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        icon={<HdrIcon d={<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 7a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6" /></>} />}
        title="User Management"
        subtitle="Manage roles and fine-grained permissions for your organization."
      />

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="py-16">
            <Spinner label="Loading users…" />
          </div>
        ) : (
          sorted.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              isSelf={u.id === profile?.id}
              onRole={changeRole}
              onTogglePerm={togglePerm}
            />
          ))
        )}
      </div>
    </div>
  )
}
