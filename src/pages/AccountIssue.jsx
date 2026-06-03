import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AuthShell from '../components/AuthShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { friendlyAuthError } from '../utils/authErrors'

const selectCls =
  'w-full rounded-xl bg-clay px-3.5 py-2.5 text-steel-100 shadow-clay-inset outline-none ring-2 ring-transparent transition-all focus:ring-hazard/50'

export default function AccountIssue() {
  const {
    firebaseUser,
    profileStatus,
    profileError,
    logout,
    completeOrgRegistration,
    completeJoin,
    listOrganizations,
  } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('choose') // 'choose' | 'register' | 'join'
  const [orgName, setOrgName] = useState('')
  const [address, setAddress] = useState('')
  const [orgId, setOrgId] = useState('')
  const [orgs, setOrgs] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const isError = profileStatus === 'error'

  useEffect(() => {
    let active = true
    listOrganizations()
      .then((list) => active && setOrgs(list))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [listOrganizations])

  // Not signed in → nothing to recover; go to login.
  if (!firebaseUser && profileStatus !== 'loading') {
    return <Navigate to="/login" replace />
  }

  async function handleSignOut() {
    await logout()
    toast.success('Signed out')
    navigate('/login', { replace: true })
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (!orgName.trim()) return setError('Organization name is required')
    setBusy(true)
    setError('')
    try {
      await completeOrgRegistration({ orgName, address })
      toast.success('Organization created')
      navigate('/app', { replace: true })
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  async function handleJoin(e) {
    e.preventDefault()
    if (!orgId) return setError('Please select your organization')
    setBusy(true)
    setError('')
    try {
      const { orgName: name } = await completeJoin({ orgId })
      toast.success(`Request sent to ${name}`)
      navigate('/pending', { replace: true })
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  // Connection/permission error — offer retry, not setup.
  if (isError) {
    return (
      <AuthShell title="Couldn't load your account">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-5 text-sm text-danger">
            {profileError?.code === 'hecp/timeout' ? (
              <>
                Couldn't reach the Firestore database. Confirm a{' '}
                <strong>(default)</strong> database exists in this project (Native
                mode) — or set <code>VITE_FIREBASE_FIRESTORE_DB</code> to your
                named database's ID — and that <code>firestore.rules</code> are
                published to it.
              </>
            ) : (
              <>
                We couldn't read your profile. This is usually a temporary
                connection issue, or the Firestore rules haven't been published.
              </>
            )}
            {profileError?.code && (
              <div className="mt-2 font-mono text-xs opacity-80">{profileError.code}</div>
            )}
          </div>
          <Button className="w-full" onClick={() => window.location.reload()}>
            Try again
          </Button>
          <Button variant="ghost" className="w-full" onClick={handleSignOut}>
            Sign out
          </Button>
        </motion.div>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Finish setting up your account">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <div className="rounded-xl border border-hazard/40 bg-hazard/10 p-4 text-sm text-steel-200">
          You're signed in
          {firebaseUser?.email ? (
            <>
              {' '}
              as <strong className="text-steel-50">{firebaseUser.email}</strong>
            </>
          ) : null}
          , but this account isn't linked to an organization yet (a previous
          sign-up didn't finish). Complete it below using this same account — no
          need to create a new one.
        </div>

        {mode === 'choose' && (
          <div className="grid gap-2">
            <Button className="w-full" onClick={() => { setError(''); setMode('register') }}>
              Register a new organization
            </Button>
            <Button variant="steel" className="w-full" onClick={() => { setError(''); setMode('join') }}>
              Join an organization with a code
            </Button>
          </div>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <Input
              label="Organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Acme Manufacturing"
            />
            <Input
              label="Address / location (optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Plant 2, Houston, TX"
            />
            {error && (
              <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </div>
            )}
            <Button type="submit" loading={busy} className="w-full">
              Create organization
            </Button>
            <button
              type="button"
              onClick={() => setMode('choose')}
              className="w-full text-center text-sm text-steel-400 hover:text-amber-600"
            >
              ← Back
            </button>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoin} className="space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-steel-200">
                Organization
              </span>
              <select value={orgId} onChange={(e) => setOrgId(e.target.value)} className={selectCls}>
                <option value="">Select your organization…</option>
                {orgs.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </label>
            {error && (
              <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </div>
            )}
            <Button type="submit" loading={busy} className="w-full">
              Request access
            </Button>
            <button
              type="button"
              onClick={() => setMode('choose')}
              className="w-full text-center text-sm text-steel-400 hover:text-amber-600"
            >
              ← Back
            </button>
          </form>
        )}

        <div className="border-t border-steel-800 pt-3 text-center">
          <button
            onClick={handleSignOut}
            className="text-sm text-steel-400 hover:text-danger"
          >
            Sign out instead
          </button>
        </div>
      </motion.div>
    </AuthShell>
  )
}
