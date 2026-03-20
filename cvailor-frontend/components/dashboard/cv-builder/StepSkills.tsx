'use client'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { TagInput } from '@/components/ui/TagInput'
import { Button } from '@/components/ui/Button'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { skillsSchema, type SkillsFormData } from '@/lib/validations'

export default function StepSkills() {
  const { skills, languages, certifications, setSkills, setLanguages, setCertifications, nextStep, prevStep } = useCVBuilderStore()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: { skills, languages, certifications },
    mode: 'onBlur',
  })

  const onSubmit = (data: SkillsFormData) => {
    setSkills(data.skills)
    setLanguages(data.languages)
    setCertifications(data.certifications ?? [])
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
        <h2 className="font-display text-2xl text-gray-900 mb-1">Skills & languages</h2>
        <p className="text-sm text-gray-400">AI will reorder these to match the job description</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-5 space-y-5">
          <Controller
            control={control}
            name="skills"
            render={({ field }) => (
              <TagInput
                label="Skills"
                value={field.value}
                onChange={field.onChange}
                placeholder="Figma, UX Research, Prototyping…"
                error={errors.skills?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="languages"
            render={({ field }) => (
              <TagInput
                label="Languages"
                value={field.value}
                onChange={field.onChange}
                placeholder="English (Native), French…"
                error={errors.languages?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="certifications"
            render={({ field }) => (
              <TagInput
                label="Certifications"
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="Google UX Design Certificate…"
                optional
                error={errors.certifications?.message}
              />
            )}
          />
        </div>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="ghost" onClick={prevStep}>← Back</Button>
          <Button type="submit" size="lg">Next: Job Description →</Button>
        </div>
      </form>
    </motion.div>
  )
}
