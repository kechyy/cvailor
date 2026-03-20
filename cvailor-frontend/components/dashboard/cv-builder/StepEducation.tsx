'use client'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { FormField } from '@/components/ui/FormField'
import { SelectField } from '@/components/ui/SelectField'
import { Button } from '@/components/ui/Button'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { educationEntrySchema } from '@/lib/validations'

const schema = z.object({ entries: z.array(educationEntrySchema) })
type FormData = z.infer<typeof schema>

function genId() { return `edu_${Date.now()}_${Math.random().toString(36).slice(2,7)}` }

const degreeOptions = [
  { value: '', label: 'Select degree type' },
  { value: "Bachelor's", label: "Bachelor's Degree (BA/BSc)" },
  { value: "Master's", label: "Master's Degree (MA/MSc)" },
  { value: 'PhD', label: 'PhD / Doctorate' },
  { value: 'HND', label: 'HND' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Certificate', label: 'Certificate' },
  { value: 'Other', label: 'Other' },
]

const yearOptions = [
  { value: '', label: 'Year' },
  ...(Array.from({ length: 30 }, (_, i) => {
    const y = new Date().getFullYear() - i
    return { value: String(y), label: String(y) }
  })),
  { value: 'Expected 2025', label: 'Expected 2025' },
  { value: 'Expected 2026', label: 'Expected 2026' },
]

export default function StepEducation() {
  const { education, loadCVData, nextStep, prevStep, getCVData } = useCVBuilderStore()

  const defaultEntry = { id: genId(), institution: '', degree: '', field: '', year: '' }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      entries: education.length > 0 ? education : [defaultEntry],
    },
    mode: 'onBlur',
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'entries' })

  const onSubmit = (data: FormData) => {
    const current = getCVData()
    loadCVData({ ...current, education: data.entries })
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
        <h2 className="font-display text-2xl text-gray-900 mb-1">Education</h2>
        <p className="text-sm text-gray-400">Most recent first</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div key={field.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50/60 border border-gray-100 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Qualification {index + 1}</h3>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
                )}
              </div>

              <FormField label="Institution name" placeholder="University of the Arts London" error={errors.entries?.[index]?.institution?.message} {...register(`entries.${index}.institution`)} />

              <div className="grid sm:grid-cols-2 gap-4">
                <SelectField label="Degree type" options={degreeOptions} error={errors.entries?.[index]?.degree?.message} {...register(`entries.${index}.degree`)} />
                <FormField label="Field of study" placeholder="Graphic Design" error={errors.entries?.[index]?.field?.message} {...register(`entries.${index}.field`)} />
              </div>

              <div className="w-1/2">
                <SelectField label="Graduation year" options={yearOptions} error={errors.entries?.[index]?.year?.message} {...register(`entries.${index}.year`)} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button type="button"
          onClick={() => append({ ...defaultEntry, id: genId() })}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 font-medium hover:border-brand-purple hover:text-brand-purple transition-all">
          + Add another qualification
        </button>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="ghost" onClick={prevStep}>← Back</Button>
          <Button type="submit" size="lg">Next: Skills →</Button>
        </div>
      </form>
    </motion.div>
  )
}
