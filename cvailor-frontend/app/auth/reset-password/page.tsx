'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import AuthLayout from '@/components/auth/AuthLayout'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations'

export default function ResetPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    // REPLACE WITH: POST /api/auth/reset-password
    await new Promise(r => setTimeout(r, 1000))
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send a reset link">
      <div className="w-14 h-14 bg-brand-purple/8 border border-brand-purple/15 rounded-2xl flex items-center justify-center mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B4FCF" strokeWidth="1.8">
          <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 8l10 6 10-6"/>
        </svg>
      </div>
      {isSubmitSuccessful ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
          <p className="text-sm font-semibold text-emerald-700 mb-1">Check your inbox</p>
          <p className="text-xs text-emerald-600">We sent a reset link. Check your spam if you don&apos;t see it.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <FormField label="Email address" type="email" placeholder="you@example.com"
            error={errors.email?.message} autoComplete="email" {...register('email')} />
          <Button type="submit" size="lg" loading={isSubmitting} className="w-full justify-center">
            Send reset link →
          </Button>
        </form>
      )}
      <p className="text-center text-sm text-gray-400 mt-6">
        <Link href="/auth/signin" className="text-brand-purple font-semibold hover:underline">← Back to sign in</Link>
      </p>
    </AuthLayout>
  )
}
