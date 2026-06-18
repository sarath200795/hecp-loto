import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'

// Shown when NavigationLoopMonitor trips: the router was caught in a redirect
// loop (e.g. an account stuck between /pending and /login while auth state
// flickers). Rendering this INSTEAD of <Routes> unmounts the looping routes,
// which hard-stops the loop and gives the user a way out.
export default function NavLoopRecovery({ routes = [] }) {
  const { logout } = useAuth()

  async function handleSignOut() {
    try {
      await logout()
    } finally {
      // Full reload from a clean, signed-out state — the surest way to clear
      // whatever transient auth flicker caused the bounce.
      window.location.assign('/login')
    }
  }

  return (
    <div className="hecp-grid-bg flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-hazard/40 bg-steel-900/70 p-8 text-center">
        <div className="text-4xl">🔁</div>
        <h1 className="mt-3 text-xl font-bold text-steel-50">The app got stuck redirecting</h1>
        <p className="mt-2 text-sm text-steel-300">
          We detected a redirect loop and stopped it so your browser wouldn’t hang.
          This usually happens when an account is awaiting approval or in an unusual
          state. Signing out and back in clears it.
        </p>
        {routes.length > 0 && (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-steel-800/70 p-3 text-left text-xs text-steel-400">
            {routes.join('\n→ ')}
          </pre>
        )}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={handleSignOut}>Sign out</Button>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    </div>
  )
}
