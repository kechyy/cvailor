'use client'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { FormField } from '@/components/ui/FormField'
import { TextareaField } from '@/components/ui/TextareaField'
import { Button } from '@/components/ui/Button'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { experienceEntrySchema } from '@/lib/validations'

const schema = z.object({
  entries: z.array(experienceEntrySchema).min(1, 'Add at least one work experience'),
})
type FormData = z.infer<typeof schema>

function genId() { return `exp_${Date.now()}_${Math.random().toString(36).slice(2,7)}` }

export default function StepExperience() {
  const { experience, loadCVData, nextStep, prevStep, getCVData } = useCVBuilderStore()

  const defaultEntry = { id: genId(), company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''] }

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      entries: experience.length > 0
        ? experience
        : [defaultEntry],
    },
    mode: 'onBlur',
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'entries' })

  const onSubmit = (data: FormData) => {
    const current = getCVData()
    loadCVData({ ...current, experience: data.entries })
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
        <h2 className="font-display text-2xl text-gray-900 mb-1">Work experience</h2>
        <p className="text-sm text-gray-400">Most recent first. AI will rewrite your bullets to match the job.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <AnimatePresence>
          {fields.map((field, index) => {
            const isCurrent = watch(`entries.${index}.current`)
            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50/60 border border-gray-100 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-700">Role {index + 1}</h3>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors">
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Company name" placeholder="Spotify" error={errors.entries?.[index]?.company?.message} {...register(`entries.${index}.company`)} />
                  <FormField label="Your job title" placeholder="Senior Designer" error={errors.entries?.[index]?.role?.message} {...register(`entries.${index}.role`)} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Start date" placeholder="Mar 2022" error={errors.entries?.[index]?.startDate?.message} {...register(`entries.${index}.startDate`)} />
                  <div>
                    <FormField
                      label="End date"
                      placeholder="Present"
                      disabled={isCurrent}
                      error={errors.entries?.[index]?.endDate?.message}
                      {...register(`entries.${index}.endDate`)}
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" {...register(`entries.${index}.current`)}
                        onChange={(e) => {
                          setValue(`entries.${index}.current`, e.target.checked)
                          if (e.target.checked) setValue(`entries.${index}.endDate`, 'Present')
                          else setValue(`entries.${index}.endDate`, '')
                        }}
                        className="w-3.5 h-3.5 accent-brand-purple" />
                      <span className="text-xs text-gray-500">I currently work here</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Key responsibilities
                    <span className="ml-1.5 text-xs font-normal text-gray-400">— use action verbs</span>
                  </label>
                  {[0, 1, 2].map((bi) => (
                    <div key={bi} className="mb-2">
                      <FormField
                        label=""
                        placeholder={bi === 0 ? "Led redesign of mobile onboarding, increasing activation by 34%" : bi === 1 ? "Collaborated with engineering to ship 12 major features" : "Built design system used across 5 product teams"}
                        error={errors.entries?.[index]?.bullets?.[bi]?.message}
                        {...register(`entries.${index}.bullets.${bi}`)}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        <button type="button"
          onClick={() => append({ ...defaultEntry, id: genId() })}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 font-medium hover:border-brand-purple hover:text-brand-purple transition-all">
          + Add another role
        </button>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="ghost" onClick={prevStep}>← Back</Button>
          <Button type="submit" size="lg">Next: Education →</Button>
        </div>
      </form>
    </motion.div>
  )
}
