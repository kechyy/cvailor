// ================================================================
// CVAILOR — ZOD VALIDATION SCHEMAS
// Single source of truth for all form validation rules.
// Used by react-hook-form via @hookform/resolvers/zod
// ================================================================
import { z } from 'zod'

// ── Reusable field rules ───────────────────────────────────────
const requiredString = (label: string) =>
  z.string().min(1, `${label} is required`)

// ── Auth schemas ───────────────────────────────────────────────
export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

export const signUpSchema = z
  .object({
    firstName: requiredString('First name').max(50, 'Too long'),
    lastName: requiredString('Last name').max(50, 'Too long'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9!@#$%^&*]/, 'Must contain a number or symbol'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms to continue' }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const resetPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
})

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9!@#$%^&*]/, 'Must contain a number or symbol'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// ── CV Builder schemas ─────────────────────────────────────────
export const personalInfoSchema = z.object({
  fullName: requiredString('Full name').max(100),
  jobTitle: requiredString('Job title').max(100),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+\d\s\-()]{7,20}$/, 'Enter a valid phone number'),
  location: requiredString('Location').max(100),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  summary: z.string().max(500, 'Summary must be under 500 characters').optional().or(z.literal('')),
})

export const experienceEntrySchema = z.object({
  id: z.string(),
  company: requiredString('Company name').max(100),
  role: requiredString('Job title').max(100),
  startDate: requiredString('Start date'),
  endDate: z.string(),
  current: z.boolean(),
  bullets: z
    .array(z.string().max(300, 'Keep each bullet under 300 characters'))
    .min(1, 'Add at least one responsibility'),
})

export const educationEntrySchema = z.object({
  id: z.string(),
  institution: requiredString('Institution name').max(150),
  degree: requiredString('Degree type').max(100),
  field: requiredString('Field of study').max(100),
  year: requiredString('Graduation year'),
})

export const skillsSchema = z.object({
  skills: z.array(z.string()).min(1, 'Add at least one skill'),
  languages: z.array(z.string()).min(1, 'Add at least one language'),
  certifications: z.array(z.string()).optional(),
})

export const jobDescriptionSchema = z.object({
  jobDescription: z
    .string()
    .min(100, 'Paste the full job description (min 100 characters)')
    .max(10000, 'Job description too long (max 10,000 characters)'),
})

// ── Inferred Types ─────────────────────────────────────────────
export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
export type ExperienceEntryFormData = z.infer<typeof experienceEntrySchema>
export type EducationEntryFormData = z.infer<typeof educationEntrySchema>
export type SkillsFormData = z.infer<typeof skillsSchema>
export type JobDescriptionFormData = z.infer<typeof jobDescriptionSchema>
