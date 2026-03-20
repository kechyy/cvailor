'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthLayout from '@/components/auth/AuthLayout'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { newPasswordSchema, type NewPasswordFormData } from '@/lib/validations'

const checks = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number or symbol', test: (p: string) => /[0-9!@#$%^&*]/.test(p) },
]

export default function NewPasswordPage() {
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
  })

  const pw = watch('password') ?? ''
  const metCount = checks.filter(c => c.test(pw)).length

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 1000))
    router.push('/auth/signin')
  }

  return (
    <AuthLayout title="Set new password" subtitle="Must be at least 8 characters">
      <div className="mb-5">
        <div className="flex gap-1.5 mb-1.5">
          {[0,1,2,3].map(i => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
              i < metCount ? (metCount === 3 ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-gray-200'
            }`} />
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Strength:{' '}
          <span className={metCount === 3 ? 'text-emerald-600 font-semibold' : metCount >= 2 ? 'text-amber-500 font-semibold' : 'text-gray-400'}>
            {metCount === 3 ? 'Strong' : metCount === 2 ? 'Fair' : metCount === 1 ? 'Weak' : 'Enter password'}
          </span>
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField label="New password" type="password" placeholder="Min. 8 characters"
          error={errors.password?.message} autoComplete="new-password" {...register('password')} />
        <FormField label="Confirm new password" type="password" placeholder="Repeat new password"
          error={errors.confirmPassword?.message} autoComplete="new-password" {...register('confirmPassword')} />
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
          {checks.map(c => (
            <div key={c.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${c.test(pw) ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                {c.test(pw) && <svg width="8" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className={`text-xs ${c.test(pw) ? 'text-gray-700' : 'text-gray-400'}`}>{c.label}</span>
            </div>
          ))}
        </div>
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full justify-center">
          Update password →
        </Button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-6">
        <Link href="/auth/signin" className="text-brand-purple font-semibold hover:underline">← Back to sign in</Link>
      </p>
    </AuthLayout>
  )
}
