'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { FormField } from '@/components/ui/FormField'
import { TextareaField } from '@/components/ui/TextareaField'
import { Button } from '@/components/ui/Button'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { personalInfoSchema, type PersonalInfoFormData } from '@/lib/validations'

export default function StepPersonal() {
  const { personal, updatePersonal, nextStep } = useCVBuilderStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personal,
    mode: 'onBlur',
  })

  const summaryValue = watch('summary') ?? ''

  const onSubmit = (data: PersonalInfoFormData) => {
    updatePersonal(data)
    nextStep()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="font-display text-2xl text-gray-900 mb-1">Personal information</h2>
        <p className="text-sm text-gray-400">This appears at the top of your CV</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            label="Full name"
            placeholder="Sarah Mitchell"
            error={errors.fullName?.message}
            autoComplete="name"
            {...register('fullName')}
          />
          <FormField
            label="Target job title"
            placeholder="Senior Product Designer"
            error={errors.jobTitle?.message}
            {...register('jobTitle')}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            autoComplete="email"
            {...register('email')}
          />
          <FormField
            label="Phone number"
            type="tel"
            placeholder="+44 7700 900123"
            error={errors.phone?.message}
            autoComplete="tel"
            {...register('phone')}
          />
        </div>

        <FormField
          label="Location"
          placeholder="London, UK"
          error={errors.location?.message}
          autoComplete="address-level2"
          {...register('location')}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/yourname"
            error={errors.linkedin?.message}
            optional
            {...register('linkedin')}
          />
          <FormField
            label="Personal website"
            placeholder="https://yoursite.com"
            error={errors.website?.message}
            optional
            {...register('website')}
          />
        </div>

        <TextareaField
          label="Professional summary"
          placeholder="A brief overview of your experience and what you bring to the role…"
          hint="Leave blank — AI will write this for you"
          optional
          rows={4}
          charCount={summaryValue.length}
          maxChars={500}
          error={errors.summary?.message}
          {...register('summary')}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg">
            Next: Work Experience →
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
