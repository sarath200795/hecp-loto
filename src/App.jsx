import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import SessionTimeout from './components/SessionTimeout'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { isFirebaseConfigured } from './firebase/config'
import { PERMISSIONS, USER_STATUS } from './constants/roles'
import { FullScreenLoader } from './components/ui/Spinner'

// Lazy-loaded route chunks — show the lock-on-MCB loader while they load.
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const RegisterOrg = lazy(() => import('./pages/RegisterOrg'))
const PendingApproval = lazy(() => import('./pages/PendingApproval'))
const Home = lazy(() => import('./pages/Home'))
const AccountIssue = lazy(() => import('./pages/AccountIssue'))
const UserApprovals = lazy(() => import('./pages/admin/UserApprovals'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const CreateProcedure = lazy(() => import('./pages/procedures/CreateProcedure'))
const ProcedureDetail = lazy(() => import('./pages/procedures/ProcedureDetail'))
const Inventory = lazy(() => import('./pages/procedures/Inventory'))
const Register = lazy(() => import('./pages/procedures/Register'))
const ScanView = lazy(() => import('./pages/scan/ScanView'))
const Operations = lazy(() => import('./pages/operations/Operations'))
const OperateProcedure = lazy(() => import('./pages/operations/OperateProcedure'))
const Technicians = lazy(() => import('./pages/admin/Technicians'))
const LockInventory = lazy(() => import('./pages/admin/LockInventory'))
const Sites = lazy(() => import('./pages/admin/Sites'))
const Privacy = lazy(() => import('./pages/legal/Privacy'))
const Terms = lazy(() => import('./pages/legal/Terms'))
const DataRetention = lazy(() => import('./pages/legal/DataRetention'))
const Cookies = lazy(() => import('./pages/legal/Cookies'))

// Wraps each route in a subtle enter animation.
function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  )
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-clay">
      <SessionTimeout />
      <Sidebar />
      <main className="lg:ml-64">
        <Outlet />
        <Footer />
      </main>
    </div>
  )
}

// Sends an already-authenticated user away from the auth pages. An
// authenticated session without a profile is left on the auth page so the
// user can finish registering/joining (no bounce into a loader).
function PublicOnly({ children }) {
  const { firebaseUser, profile, profileStatus, loading } = useAuth()
  if (loading || profileStatus === 'loading') return <FullScreenLoader />
  if (firebaseUser && profileStatus === 'ready' && profile) {
    return (
      <Navigate
        to={profile.status === USER_STATUS.APPROVED ? '/app' : '/pending'}
        replace
      />
    )
  }
  return children
}

function ConfigMissing() {
  return (
    <div className="hecp-grid-bg flex min-h-screen items-center justify-center p-6">
      <div className="max-w-lg rounded-2xl border border-hazard/40 bg-steel-900/70 p-8 text-center">
        <div className="text-4xl">⚙️</div>
        <h1 className="mt-3 text-xl font-bold text-steel-50">Firebase not configured</h1>
        <p className="mt-2 text-sm text-steel-300">
          Copy <code className="rounded bg-steel-800 px-1.5 py-0.5">.env.example</code> to{' '}
          <code className="rounded bg-steel-800 px-1.5 py-0.5">.env.local</code> and add your
          Firebase project keys, then restart the dev server. See the README for setup steps.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  if (!isFirebaseConfigured) return <ConfigMissing />

  return (
    <Suspense fallback={<FullScreenLoader label="Loading…" />}>
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Page>
                <Login />
              </Page>
            </PublicOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnly>
              <Page>
                <Signup />
              </Page>
            </PublicOnly>
          }
        />
        <Route
          path="/register-org"
          element={
            <PublicOnly>
              <Page>
                <RegisterOrg />
              </Page>
            </PublicOnly>
          }
        />
        <Route
          path="/pending"
          element={
            <Page>
              <PendingApproval />
            </Page>
          }
        />
        <Route
          path="/account-issue"
          element={
            <Page>
              <AccountIssue />
            </Page>
          }
        />

        {/* Public QR scan landing — viewable without login */}
        <Route
          path="/p/:id"
          element={
            <Page>
              <ScanView />
            </Page>
          }
        />

        {/* Public legal pages */}
        <Route
          path="/privacy"
          element={
            <Page>
              <Privacy />
            </Page>
          }
        />
        <Route
          path="/terms"
          element={
            <Page>
              <Terms />
            </Page>
          }
        />
        <Route
          path="/data-retention"
          element={
            <Page>
              <DataRetention />
            </Page>
          }
        />
        <Route
          path="/cookies"
          element={
            <Page>
              <Cookies />
            </Page>
          }
        />

        {/* Authenticated app shell */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />

          {/* LOTO procedure modules */}
          <Route
            path="inventory"
            element={
              <ProtectedRoute permission={PERMISSIONS.PROCEDURE_VIEW}>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="register"
            element={
              <ProtectedRoute permission={PERMISSIONS.PROCEDURE_VIEW}>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="operations"
            element={
              <ProtectedRoute permission={PERMISSIONS.LOTO_PERFORM}>
                <Operations />
              </ProtectedRoute>
            }
          />
          <Route
            path="operations/:id"
            element={
              <ProtectedRoute permission={PERMISSIONS.LOTO_PERFORM}>
                <OperateProcedure />
              </ProtectedRoute>
            }
          />
          <Route
            path="technicians"
            element={
              <ProtectedRoute permission={PERMISSIONS.USERS_MANAGE}>
                <Technicians />
              </ProtectedRoute>
            }
          />
          <Route
            path="locks"
            element={
              <ProtectedRoute permission={PERMISSIONS.USERS_MANAGE}>
                <LockInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="sites"
            element={
              <ProtectedRoute permission={PERMISSIONS.USERS_MANAGE}>
                <Sites />
              </ProtectedRoute>
            }
          />
          <Route
            path="procedures/new"
            element={
              <ProtectedRoute permission={PERMISSIONS.PROCEDURE_CREATE}>
                <CreateProcedure />
              </ProtectedRoute>
            }
          />
          <Route
            path="procedures/:id/revise"
            element={
              <ProtectedRoute permission={PERMISSIONS.PROCEDURE_REVISE}>
                <CreateProcedure />
              </ProtectedRoute>
            }
          />
          <Route
            path="procedures/:id"
            element={
              <ProtectedRoute permission={PERMISSIONS.PROCEDURE_VIEW}>
                <ProcedureDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="approvals"
            element={
              <ProtectedRoute permission={PERMISSIONS.USERS_MANAGE}>
                <UserApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute permission={PERMISSIONS.USERS_MANAGE}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AnimatePresence>
    </Suspense>
  )
}
