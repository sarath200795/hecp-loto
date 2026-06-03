import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthShell from '../components/AuthShell'
import Button from '../components/ui/Button'
import { FullScreenLoader } from '../components/ui/Spinner'
import { useAuth } from '../context/AuthContext'
import { USER_STATUS } from '../constants/roles'

export default function PendingApproval() {
  const { firebaseUser, profile, profileStatus, org, loading, logout } = useAuth()
  const navigate = useNavigate()

  // Auto-advance the moment an admin approves (profile updates in real time).
  useEffect(() => {
    if (profile?.status === USER_STATUS.APPROVED) {
      navigate('/app', { replace: true })
    }
  }, [profile?.status, navigate])

  if (loading || profileStatus === 'loading') return <FullScreenLoader />
  if (!firebaseUser) return <Navigate to="/login" replace />
  // Authenticated but no organization profile → recovery screen, not a loader.
  if (profileStatus !== 'ready' || !profile) {
    return <Navigate to="/account-issue" replace />
  }

  const rejected = profile?.status === USER_STATUS.REJECTED

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <AuthShell title={rejected ? 'Access not granted' : 'Awaiting approval'}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        {rejected ? (
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-5 text-sm text-danger">
            Your request to join <strong>{org?.name || 'this organization'}</strong>{' '}
            was not approved. Contact your administrator if you believe this is a
            mistake.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 rounded-xl border border-hazard/40 bg-hazard/10 p-5">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hazard opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-hazard" />
              </span>
              <div className="text-sm text-steel-200">
                Your request to join{' '}
                <strong className="text-steel-50">{org?.name || 'the organization'}</strong>{' '}
                is pending. An administrator will assign your role shortly. This
                page updates automatically once you're approved.
              </div>
            </div>
            <div className="rounded-xl border border-steel-800 bg-steel-900/40 p-4 text-sm text-steel-400">
              Signed in as{' '}
              <span className="font-semibold text-steel-200">{profile?.email}</span>
            </div>
          </>
        )}
        <Button variant="ghost" className="w-full" onClick={handleLogout}>
          Sign out
        </Button>
      </motion.div>
    </AuthShell>
  )
}
