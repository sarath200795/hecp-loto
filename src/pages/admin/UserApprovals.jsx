import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import toast from 'react-hot-toast'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import {
  ASSIGNABLE_ROLES,
  ROLE_META,
  USER_STATUS,
  permissionsForRole,
} from '../../constants/roles'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import PageHeader, { HdrIcon } from '../../components/PageHeader'
import EmptyState from '../../components/EmptyState'

export default function UserApprovals() {
  const { profile } = useAuth()
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleChoice, setRoleChoice] = useState({}) // uid -> role
  const [busy, setBusy] = useState({}) // uid -> bool

  useEffect(() => {
    if (!profile?.orgId) return undefined
    const q = query(
      collection(db, 'users'),
      where('orgId', '==', profile.orgId),
      where('status', '==', USER_STATUS.PENDING),
    )
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPending(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsub
  }, [profile?.orgId])

  async function approve(user) {
    const role = roleChoice[user.id] || ASSIGNABLE_ROLES[0]
    setBusy((b) => ({ ...b, [user.id]: true }))
    try {
      await updateDoc(doc(db, 'users', user.id), {
        role,
        permissions: permissionsForRole(role),
        status: USER_STATUS.APPROVED,
        approvedBy: profile.id,
        approvedAt: serverTimestamp(),
      })
      toast.success(`${user.displayName} approved as ${ROLE_META[role].short}`)
    } catch (err) {
      toast.error(err.message || 'Failed to approve')
    } finally {
      setBusy((b) => ({ ...b, [user.id]: false }))
    }
  }

  async function reject(user) {
    setBusy((b) => ({ ...b, [user.id]: true }))
    try {
      await updateDoc(doc(db, 'users', user.id), {
        status: USER_STATUS.REJECTED,
        approvedBy: profile.id,
        approvedAt: serverTimestamp(),
      })
      toast('Request rejected', { icon: '🚫' })
    } catch (err) {
      toast.error(err.message || 'Failed to reject')
    } finally {
      setBusy((b) => ({ ...b, [user.id]: false }))
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        icon={<HdrIcon d={<><rect x="8" y="3" width="8" height="4" rx="1" /><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M9 13l2 2 4-4" /></>} />}
        title="Approvals"
        subtitle="Approve team members and assign their role. Updates in real time."
        actions={
          pending.length > 0 ? (
            <span className="rounded-full bg-hazard px-3 py-1 text-sm font-bold text-ink shadow-clay">
              {pending.length}
            </span>
          ) : null
        }
      />

      <div className="mt-3 text-[11px] font-bold uppercase tracking-widest text-steel-400">
        Pending ({pending.length})
      </div>

      <div className="mt-3 space-y-3">
        {loading ? (
          <div className="py-16">
            <Spinner label="Loading requests…" />
          </div>
        ) : pending.length === 0 ? (
          <EmptyState title="All caught up" subtitle="No submissions waiting for review." />
        ) : (
          <AnimatePresence>
            {pending.map((user) => {
              const selected = roleChoice[user.id] || ASSIGNABLE_ROLES[0]
              return (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                >
                  <Card animate={false} className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-full bg-steel-700 font-bold text-steel-100">
                          {user.displayName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-semibold text-steel-50">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-steel-400">{user.email}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-steel-400">
                        Assign role
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ASSIGNABLE_ROLES.map((r) => {
                          const m = ROLE_META[r]
                          const active = selected === r
                          return (
                            <button
                              key={r}
                              onClick={() =>
                                setRoleChoice((c) => ({ ...c, [user.id]: r }))
                              }
                              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                                active
                                  ? m.accent + ' ring-2 ring-offset-2 ring-offset-steel-900'
                                  : 'border-steel-700 text-steel-300 hover:border-steel-500'
                              }`}
                              style={active ? { boxShadow: `0 0 0 1px ${m.color}` } : {}}
                            >
                              {m.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        loading={busy[user.id]}
                        onClick={() => approve(user)}
                      >
                        Approve as {ROLE_META[selected].short}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy[user.id]}
                        onClick={() => reject(user)}
                      >
                        Reject
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
