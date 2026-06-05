import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { useSites } from '../../hooks/useSites'
import { useOrgProcedures } from '../../hooks/useOrgProcedures'
import { addSite, deleteSite, updateSite } from '../../services/sites'
import PageHeader, { HdrIcon } from '../../components/PageHeader'
import EmptyState from '../../components/EmptyState'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

export default function Sites() {
  const { profile } = useAuth()
  const { sites, loading } = useSites()
  const { procedures } = useOrgProcedures()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  // How many procedures reference each site (by name) — informational.
  const usage = useMemo(() => {
    const map = {}
    procedures.forEach((p) => {
      if (p.site) map[p.site] = (map[p.site] || 0) + 1
    })
    return map
  }, [procedures])

  async function onAdd(e) {
    e.preventDefault()
    const clean = name.trim()
    if (!clean) return toast.error('Site name is required')
    if (sites.some((s) => (s.name || '').toLowerCase() === clean.toLowerCase())) {
      return toast.error('That site already exists')
    }
    setSaving(true)
    try {
      await addSite({ orgId: profile.orgId, name: clean }, profile)
      setName('')
      toast.success('Site added')
    } catch (err) {
      toast.error(err.message || 'Could not add site')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(s) {
    try {
      await updateSite(s.id, { active: s.active === false })
    } catch (err) {
      toast.error(err.message || 'Update failed')
    }
  }

  async function onDelete(s) {
    const inUse = usage[s.name] || 0
    const msg = inUse
      ? `"${s.name}" is used by ${inUse} procedure(s). Removing it won't change those procedures, but it will no longer be selectable. Remove?`
      : `Remove site "${s.name}"?`
    if (!window.confirm(msg)) return
    try {
      await deleteSite(s.id)
      toast.success('Removed')
    } catch (err) {
      toast.error(err.message || 'Could not remove')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        icon={<HdrIcon d={<><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>} />}
        title="Organization Sites"
        subtitle="Manage the sites/locations available when creating LOTO procedures."
      />

      <Card animate={false} className="mt-6 p-5">
        <form onSubmit={onAdd} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <Input
            label="Site name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Plant 2 — Packaging"
          />
          <Button type="submit" loading={saving}>
            Add site
          </Button>
        </form>
      </Card>

      <div className="mt-4">
        {loading ? (
          <div className="py-16">
            <Spinner label="Loading sites…" />
          </div>
        ) : sites.length === 0 ? (
          <EmptyState
            title="No sites yet"
            subtitle="Add your first site above — it will appear in the Create Procedure dropdown."
            icon={<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>}
          />
        ) : (
          <Card animate={false} className="overflow-hidden p-0">
            <ul className="divide-y divide-steel-700/60">
              {sites.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-steel-100">
                      {s.name}
                      {s.active === false && (
                        <span className="ml-2 rounded bg-steel-800 px-1.5 py-0.5 text-[10px] font-bold text-steel-400">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    {usage[s.name] ? (
                      <div className="text-xs text-steel-400">
                        {usage[s.name]} procedure{usage[s.name] === 1 ? '' : 's'}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => toggleActive(s)}
                      className="rounded-lg border border-steel-700 px-2.5 py-1 text-xs font-medium text-steel-300 hover:border-steel-500"
                    >
                      {s.active === false ? 'Activate' : 'Deactivate'}
                    </button>
                    <button
                      onClick={() => onDelete(s)}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-danger hover:bg-danger/10"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  )
}
