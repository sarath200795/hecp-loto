import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthShell from '../components/AuthShell'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { friendlyAuthError } from '../utils/authErrors'

const selectCls =
  'w-full rounded-xl bg-clay px-3.5 py-2.5 text-steel-100 shadow-clay-inset outline-none ring-2 ring-transparent transition-all focus:ring-hazard/50'

export default function Signup() {
  const { signupMember, listOrganizations } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    orgId: '',
  })
  const [consent, setConsent] = useState(false)
  const [orgs, setOrgs] = useState([])
  const [orgsLoading, setOrgsLoading] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    listOrganizations()
      .then((list) => active && setOrgs(list))
      .catch(() => active && setError('Could not load organizations.'))
      .finally(() => active && setOrgsLoading(false))
    return () => {
      active = false
    }
  }, [listOrganizations])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.orgId) return setError('Please select your organization.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (!consent) return setError('Please accept the Terms and Privacy Policy to continue.')
    setLoading(true)
    try {
      const { orgName } = await signupMember(form)
      toast.success(`Request sent to ${orgName}`)
      navigate('/pending', { replace: true })
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Join your organization"
      subtitle="Select your organization and submit your details for approval."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-amber-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-steel-200">Organization</span>
          <select
            value={form.orgId}
            onChange={update('orgId')}
            required
            className={selectCls}
            disabled={orgsLoading}
          >
            <option value="">
              {orgsLoading ? 'Loading organizations…' : 'Select your organization…'}
            </option>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          {!orgsLoading && orgs.length === 0 && (
            <span className="mt-1 block text-xs text-steel-400">
              No organizations yet —{' '}
              <Link to="/register-org" className="text-amber-600">
                register one
              </Link>
              .
            </span>
          )}
        </label>

        <Input
          label="Full name"
          required
          value={form.name}
          onChange={update('name')}
          placeholder="Jordan Mills"
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={update('email')}
          placeholder="you@company.com"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={update('password')}
            placeholder="••••••••"
          />
          <Input
            label="Confirm"
            type="password"
            autoComplete="new-password"
            required
            value={form.confirm}
            onChange={update('confirm')}
            placeholder="••••••••"
          />
        </div>
        <label className="flex items-start gap-2 text-xs text-steel-300">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-hazard"
          />
          <span>
            I agree to the{' '}
            <Link to="/terms" target="_blank" className="font-semibold text-amber-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" target="_blank" className="font-semibold text-amber-600">
              Privacy Policy
            </Link>
            , and understand this tool does not replace a compliant LOTO program.
          </span>
        </label>
        {error && (
          <div className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
        )}
        <Button type="submit" loading={loading} className="w-full" size="lg" disabled={!consent}>
          Request access
        </Button>
      </form>
    </AuthShell>
  )
}
