import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTechnicians } from '../../hooks/useTechnicians'
import { useLocks } from '../../hooks/useLocks'
import { useOrgProcedures } from '../../hooks/useOrgProcedures'
import ProcedureView from '../../components/procedures/ProcedureView'
import PerformPanel from '../../components/procedures/PerformPanel'
import { FullScreenLoader } from '../../components/ui/Spinner'
import LockMcbMark from '../../components/LockMcbMark'
import { PERMISSIONS } from '../../constants/roles'
import { PROCEDURE_STATUS } from '../../constants/procedures'
import { collectInUseLockNos } from '../../utils/lockout'
import { getProcedurePhotos, subscribeProcedure } from '../../services/procedures'

export default function ScanView() {
  const { id } = useParams()
  const location = useLocation()
  const { firebaseUser, profile, can } = useAuth()
  const { technicians } = useTechnicians()
  const { locks } = useLocks()
  const { procedures } = useOrgProcedures()
  const inUseLockNos = useMemo(() => collectInUseLockNos(procedures), [procedures])
  const [procedure, setProcedure] = useState(undefined)
  const [photos, setPhotos] = useState({})

  useEffect(() => {
    const unsub = subscribeProcedure(
      id,
      (p) => setProcedure(p),
      () => setProcedure(null),
    )
    return unsub
  }, [id])

  useEffect(() => {
    let active = true
    getProcedurePhotos(id).then((ph) => active && setPhotos(ph))
    return () => {
      active = false
    }
  }, [id])

  if (procedure === undefined) return <FullScreenLoader label="Loading procedure…" />
  if (procedure === null) {
    return (
      <div className="hecp-grid-bg flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <div className="text-4xl">🔍</div>
          <p className="mt-3 font-semibold text-steel-200">Procedure not found</p>
          <p className="text-sm text-steel-400">
            This QR code does not match an active procedure.
          </p>
        </div>
      </div>
    )
  }

  const sameOrg = profile?.orgId === procedure.orgId
  const isApproved = procedure.status === PROCEDURE_STATUS.APPROVED
  const canPerform = Boolean(
    firebaseUser && sameOrg && can(PERMISSIONS.LOTO_PERFORM) && isApproved,
  )

  return (
    <div className="hecp-grid-bg min-h-screen">
      <header className="border-b border-steel-800 bg-steel-950/70 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-extrabold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-hazard to-hazard-dark text-ink">
              <LockMcbMark size={18} />
            </span>
            HECP <span className="text-amber-600">LOTO</span>
          </span>
          {firebaseUser ? (
            <Link to="/app" className="text-sm text-steel-300 hover:text-amber-600">
              Open app →
            </Link>
          ) : (
            <Link to="/login" className="text-sm text-steel-300 hover:text-amber-600">
              Sign in
            </Link>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Perform banner */}
        {!firebaseUser ? (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hazard/40 bg-hazard/10 p-4">
            <div className="text-sm text-steel-200">
              You're viewing this procedure. <strong>Sign in</strong> to perform LOTO
              actions and lock out isolation points.
            </div>
            <Link
              to="/login"
              state={{ from: location }}
              className="rounded-lg bg-hazard px-4 py-2 text-sm font-semibold text-ink hover:bg-hazard-dark"
            >
              Sign in to perform
            </Link>
          </div>
        ) : !sameOrg ? (
          <div className="mb-5 rounded-2xl border border-steel-700 bg-steel-900/60 p-4 text-sm text-steel-300">
            This procedure belongs to a different organization, so you can view it
            but cannot perform LOTO actions on it.
          </div>
        ) : !can(PERMISSIONS.LOTO_PERFORM) ? (
          <div className="mb-5 rounded-2xl border border-steel-700 bg-steel-900/60 p-4 text-sm text-steel-300">
            Your role can view this procedure but does not have permission to
            perform LOTO actions.
          </div>
        ) : !isApproved ? (
          <div className="mb-5 rounded-2xl border border-hazard/40 bg-hazard/10 p-4 text-sm text-steel-200">
            ⚠️ This procedure is <strong>not yet approved</strong>. LOTO actions are
            disabled until it is fully approved.
          </div>
        ) : (
          <div className="mb-5 rounded-2xl border border-safe/40 bg-safe/10 p-4 text-sm text-safe">
            ✓ You can perform LOTO. Review the isolation steps, then lock out each
            point below.
          </div>
        )}

        {canPerform && (
          <div className="mb-5">
            <PerformPanel
              procedure={procedure}
              technicians={technicians}
              locks={locks}
              inUseLockNos={inUseLockNos}
              user={profile}
            />
          </div>
        )}

        <ProcedureView procedure={procedure} photos={photos} />
      </div>
    </div>
  )
}
