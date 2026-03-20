// REPLACE WITH: POST /api/cv/tailor
import type { CVData, ScoreBreakdown, CoverLetter } from '@/types'

export const mockAtsScore = 87

export const mockScoreBreakdown: ScoreBreakdown = {
  keywordsMatch: 84,
  experienceFit: 91,
  skillsAlignment: 72,
  summaryStrength: 80,
}

export const mockMatchedKeywords = ['UX Design', 'Figma', 'Design Systems', 'User Research', 'Prototyping', 'Usability Testing']
export const mockMissingKeywords = ['TypeScript', 'WCAG', 'Accessibility', 'Stakeholder Management']

export const mockAtsTips = [
  'Add "TypeScript" to your skills section — mentioned 3x in job description (+8 pts)',
  'Include WCAG or accessibility experience in your summary (+6 pts)',
  'Quantify your Monzo impact with user numbers or revenue figures (+5 pts)',
]

export const mockTailoredCV: CVData = {
  personal: {
    fullName: 'Sarah Mitchell',
    jobTitle: 'Senior UX Designer',
    email: 'sarah.mitchell@email.com',
    phone: '+44 7700 900123',
    location: 'London, UK',
    linkedin: 'https://linkedin.com/in/sarahmitchell',
    summary: 'Senior UX Designer with 5+ years delivering exceptional user experiences at scale. Proven track record building design systems and leading end-to-end product design at Spotify and Monzo. Deep expertise in Figma, user research, and cross-functional collaboration with engineering teams.',
  },
  experience: [
    {
      id: 'exp_01',
      company: 'Spotify',
      role: 'Senior UX Designer',
      startDate: '2022-03',
      endDate: 'Present',
      current: true,
      bullets: [
        'Led end-to-end UX design of mobile onboarding, increasing activation by 34% across 10M+ users',
        'Built and maintained design system adopted by 5 product teams, reducing design-to-dev handoff time by 40%',
        'Facilitated 30+ usability testing sessions and translated findings into actionable design improvements',
      ],
    },
    {
      id: 'exp_02',
      company: 'Monzo Bank',
      role: 'Product Designer',
      startDate: '2020-06',
      endDate: '2022-02',
      current: false,
      bullets: [
        'Designed Monzo Plus subscription flow from concept to launch, contributing to 150k+ subscriber milestone',
        'Partnered with stakeholders across product, engineering, and compliance to deliver accessible, WCAG-compliant interfaces',
      ],
    },
  ],
  education: [
    { id: 'edu_01', institution: 'University of the Arts London', degree: 'Bachelor of Arts', field: 'Graphic Design', year: '2020' },
  ],
  skills: ['Figma', 'UX Research', 'Design Systems', 'Prototyping', 'Usability Testing', 'Accessibility (WCAG)', 'Framer', 'Stakeholder Management'],
  languages: ['English (Native)', 'French (Conversational)'],
  certifications: ['Google UX Design Certificate'],
}

export const mockCoverLetter: CoverLetter = {
  greeting: 'Dear Hiring Manager,',
  paragraph1: "I'm excited to apply for the Senior UX Designer role at Google. Having spent the last 5 years designing at scale for Spotify and Monzo, I deeply admire Google's commitment to building products that are both powerful and intuitive — and I'm eager to contribute to that mission.",
  paragraph2: "At Spotify, I led the redesign of the mobile onboarding experience — a project that touched millions of users and resulted in a 34% improvement in activation. I built design systems adopted across five product teams and ran extensive usability research programmes that directly shaped product direction. At Monzo, I delivered WCAG-compliant interfaces in a regulated environment, sharpening my ability to balance user needs with business constraints.",
  paragraph3: "I would love the opportunity to bring this experience to Google and help shape the next generation of user experiences. I am available for a conversation at your earliest convenience.",
  signOff: 'Kind regards,\nSarah Mitchell',
}
