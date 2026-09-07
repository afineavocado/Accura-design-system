'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [keepLoggedIn, setKeepLoggedIn] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [loginFailed, setLoginFailed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!email) e.email = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email address.'
    if (!password) e.password = 'Please enter your password.'
    return e
  }

  const handleLogin = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    // Mock: only devon@simon.com / password works
    if (email === 'devon@simon.com' && password === 'password') {
      router.push('/prototype/simon/action-centre')
    } else {
      setLoginFailed(true)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 px-6 pt-10 pb-8 gap-8">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-14 w-14 rounded-2xl bg-[var(--color-brand-primary)] flex items-center justify-center">
          <span className="text-xl font-bold text-white">S</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">
            Login to your account
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Enter your details to login.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        {loginFailed && (
          <Alert variant="destructive">
            Email or password is incorrect.
          </Alert>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setLoginFailed(false) }}
            aria-invalid={!!errors.email || undefined}
          />
          {errors.email && <p className="text-xs text-[var(--color-text-invalid)]">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginFailed(false) }}
              aria-invalid={!!errors.password || undefined}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-icon-default)]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-[var(--color-text-invalid)]">{errors.password}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="keep"
            checked={keepLoggedIn}
            onCheckedChange={v => setKeepLoggedIn(!!v)}
          />
          <Label htmlFor="keep" className="font-normal text-sm cursor-pointer">Keep me logged in</Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-auto">
        <Button className="w-full h-12 text-base" onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </Button>
        <button
          className="text-sm text-center text-[var(--color-text-link)] hover:text-[var(--color-text-link-hover)]"
          onClick={() => alert('Password reset flow not in scope for this prototype.')}
        >
          Forgot Password?
        </button>
      </div>

      <p className="text-center text-xs text-[var(--color-text-secondary)]">
        Hint: use <strong>devon@simon.com</strong> / <strong>password</strong>
      </p>
    </div>
  )
}
