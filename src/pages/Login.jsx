import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthShell from '../components/AuthShell'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { friendlyAuthError } from '../utils/authErrors'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/app'

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back')
      navigate(from, { replace: true })
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your organization's LOTO operations."
      footer={
        <>
          New team member?{' '}
          <Link to="/signup" className="font-semibold text-amber-600 hover:underline">
            Join your organization
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={update('email')}
          placeholder="you@company.com"
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={update('password')}
          placeholder="••••••••"
        />
        {error && (
          <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Sign in
        </Button>
      </form>

      <div className="mt-6 rounded-lg border border-steel-800 bg-steel-900/40 p-3 text-center text-xs text-steel-400">
        Setting up a new company?{' '}
        <Link to="/register-org" className="font-semibold text-steel-200 hover:text-amber-600">
          Register an organization →
        </Link>
      </div>
    </AuthShell>
  )
}
