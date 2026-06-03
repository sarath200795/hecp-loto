import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AuthShell from '../components/AuthShell'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { friendlyAuthError } from '../utils/authErrors'

export default function RegisterOrg() {
  const { registerOrganization } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    orgName: '',
    address: '',
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [joinCode, setJoinCode] = useState(null)

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const { joinCode: code } = await registerOrganization(form)
      setJoinCode(code)
      toast.success('Organization created')
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  if (joinCode) {
    return (
      <AuthShell title="You're all set" subtitle="Your organization is ready.">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-5"
        >
          <div className="rounded-xl bg-safe/10 p-4 text-sm text-safe shadow-clay">
            You are the administrator of <strong>{form.orgName}</strong>. Your team
            can now <strong>select your organization from the dropdown</strong> when
            signing up — you'll approve each request in the Approvals queue.
          </div>
          <Button className="w-full" size="lg" onClick={() => navigate('/app', { replace: true })}>
            Go to dashboard →
          </Button>
        </motion.div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Register your organization"
      subtitle="You'll become the admin and approve everyone who joins."
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-amber-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Organization name"
          required
          value={form.orgName}
          onChange={update('orgName')}
          placeholder="Acme Manufacturing"
        />
        <Input
          label="Address / location"
          value={form.address}
          onChange={update('address')}
          placeholder="Plant 2, Houston, TX (optional)"
        />
        <div className="my-2 border-t border-steel-800 pt-2 text-xs font-semibold uppercase tracking-wider text-steel-500">
          Admin account
        </div>
        <Input
          label="Your name"
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
        {error && (
          <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create organization
        </Button>
      </form>
    </AuthShell>
  )
}
