import { useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useIdleTimeout } from '../hooks/useIdleTimeout'
import Modal from './ui/Modal'
import Button from './ui/Button'

// Inactivity watchdog UI. Armed only for a fully signed-in user; shows a
// countdown warning before auto sign-out, with a "Stay signed in" escape hatch.
export default function SessionTimeout() {
  const { firebaseUser, profileStatus, logout } = useAuth()
  const enabled = Boolean(firebaseUser) && profileStatus === 'ready'

  const onExpire = useCallback(() => {
    // The SESSION_EXPIRED flag is set by the hook; logout triggers the
    // ProtectedRoute redirect to /login, where the notice is shown.
    logout()
  }, [logout])

  const { warningOpen, secondsLeft, stayActive } = useIdleTimeout({ enabled, onExpire })

  return (
    <Modal open={warningOpen} onClose={stayActive} title="Still there?" maxW="max-w-sm">
      <p className="text-sm text-steel-300">
        You&apos;ve been inactive. For security you&apos;ll be signed out in{' '}
        <span className="font-bold text-steel-50">{secondsLeft}s</span>.
      </p>
      <div className="mt-5 flex gap-2">
        <Button className="flex-1" onClick={stayActive}>
          Stay signed in
        </Button>
        <Button variant="ghost" onClick={() => logout()}>
          Log out now
        </Button>
      </div>
    </Modal>
  )
}
