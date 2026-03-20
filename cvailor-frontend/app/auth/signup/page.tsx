'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import AuthLayout from '@/components/auth/AuthLayout'
import OAuthButtons from '@/components/auth/OAuthButtons'
import Divider from '@/components/auth/Divider'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { signUpSchema, type SignUpFormData } from '@/lib/validations'
import { registerUser } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'

export default function SignUpPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: SignUpFormData) => {
    setServerError(null)

    try {
      // 1. Create the account on the backend
      await registerUser({
        email: data.email,
        password: data.password,
        full_name: `${data.firstName} ${data.lastName}`,
      })
    } catch (err) {
      if (err instanceof ApiError && err.isConflict) {
        setServerError('An account with this email already exists.')
      } else {
        setServerError('Something went wrong. Please try again.')
      }
      return
    }

    // 2. Sign in immediately so the user lands on the dashboard with a valid session
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      // Account was created but sign-in failed — send them to sign-in page
      router.push('/auth/signin')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start tailoring CVs with AI — free forever">
      <OAuthButtons mode="signup" />
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="First name" placeholder="Alex" error={errors.firstName?.message}
            autoComplete="given-name" {...register('firstName')} />
          <FormField label="Last name" placeholder="Johnson" error={errors.lastName?.message}
            autoComplete="family-name" {...register('lastName')} />
        </div>
        <FormField label="Email address" type="email" placeholder="you@example.com"
          error={errors.email?.message} autoComplete="email" {...register('email')} />
        <FormField label="Password" type="password" placeholder="Min. 8 characters"
          error={errors.password?.message} autoComplete="new-password" {...register('password')} />
        <FormField label="Confirm password" type="password" placeholder="Repeat your password"
          error={errors.confirmPassword?.message} autoComplete="new-password" {...register('confirmPassword')} />
        <div className="flex items-start gap-2.5">
          <input type="checkbox" id="terms" className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-brand-purple flex-shrink-0" {...register('terms')} />
          <div>
            <label htmlFor="terms" className="text-sm text-gray-500 leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-brand-purple hover:underline font-medium">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-brand-purple hover:underline font-medium">Privacy Policy</Link>
            </label>
            {errors.terms && (
              <p className="text-xs text-red-500 font-medium mt-0.5">{errors.terms.message}</p>
            )}
          </div>
        </div>
        {serverError && (
          <p className="text-sm text-red-600 font-medium text-center">{serverError}</p>
        )}
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full justify-center">
          Create account →
        </Button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{' '}
        <Link href="/auth/signin" className="text-brand-purple font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
