'use client'
import { AnimatePresence } from 'framer-motion'
import TopBar from '@/components/dashboard/TopBar'
import StepIndicator from '@/components/dashboard/cv-builder/StepIndicator'
import StepPersonal from '@/components/dashboard/cv-builder/StepPersonal'
import StepExperience from '@/components/dashboard/cv-builder/StepExperience'
import StepEducation from '@/components/dashboard/cv-builder/StepEducation'
import StepSkills from '@/components/dashboard/cv-builder/StepSkills'
import StepJobDesc from '@/components/dashboard/cv-builder/StepJobDesc'
import { useCVBuilderStore } from '@/store/cvBuilderStore'

const STEP_LABELS = ['Personal', 'Experience', 'Education', 'Skills', 'Job']
const TOTAL_STEPS = 5

export default function CVBuilderPage() {
  const { currentStep } = useCVBuilderStore()

  return (
    <>
      <TopBar
        title="Build your CV"
        subtitle="Complete each step — AI does the hard work"
      />

      <div className="max-w-2xl mx-auto">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          labels={STEP_LABELS}
        />

        <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <StepPersonal key="personal" />}
            {currentStep === 2 && <StepExperience key="experience" />}
            {currentStep === 3 && <StepEducation key="education" />}
            {currentStep === 4 && <StepSkills key="skills" />}
            {currentStep === 5 && <StepJobDesc key="jobdesc" />}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
