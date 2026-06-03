import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { USER_STATUS } from '../constants/roles'
import { FullScreenLoader } from './ui/Spinner'

/**
 * Gates a route on authentication, approval status, and (optionally) a
 * required permission. Redirects appropriately when checks fail.
 */
export default function ProtectedRoute({ children, permission, adminOnly = false }) {
  const { firebaseUser, profile, profileStatus, loading, can, isAdmin } = useAuth()
  const location = useLocation()

  if (loading || profileStatus === 'loading') {
    return <FullScreenLoader label="Verifying access…" />
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Authenticated, but the profile document is missing or unreadable. Never
  // hang on a spinner — send the user to a recovery screen with a way out.
  if (profileStatus !== 'ready' || !profile) {
    return <Navigate to="/account-issue" replace />
  }

  if (profile.status !== USER_STATUS.APPROVED) {
    return <Navigate to="/pending" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/app" replace />
  }

  if (permission && !can(permission)) {
    return <Navigate to="/app" replace />
  }

  return children
}
