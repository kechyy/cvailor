import React from 'react'

export type SampleCvData = {
  name: string
  title: string
  summary: string
  contact: { email: string; phone: string; location: string; website?: string }
  skills: { name: string; level: number }[]
  experience: { company: string; role: string; period: string; bullets: string[] }[]
  education: { school: string; degree: string; period: string }[]
  photo?: string
}

export type CvTemplateMeta = {
  id: string
  name: string
  professions: string[]
  stacks: string[]
  tags: string[]
  layout: 'single' | 'double' | 'timeline'
  theme: { primary: string; accent?: string }
  Component: React.FC<{ sample: SampleCvData }>
}

export const sampleCv: SampleCvData = {
  name: 'Amelia Rodriguez',
  title: 'Staff Software Engineer · Payments & Growth',
  summary:
    'Staff-level engineer with 11+ years building reliable payment and growth systems at global-scale consumer companies. Blends product sense with platform rigor: cut checkout latency by 37%, lifted activation by 18 ppts across 5 markets, and led multi-team programs that ship safely on tight timelines.',
  contact: {
    email: 'amelia.rodriguez@hey.com',
    phone: '+1 (415) 889-4418',
    location: 'San Francisco, CA',
    website: 'amelia.codes',
  },
  skills: [
    { name: 'TypeScript', level: 92 },
    { name: 'React / Next.js', level: 90 },
    { name: 'Node.js', level: 88 },
    { name: 'Distributed Systems', level: 82 },
    { name: 'Payments (PCI / SCA)', level: 86 },
    { name: 'System Design', level: 88 },
    { name: 'API Design (REST / GraphQL)', level: 84 },
    { name: 'Data Modeling', level: 80 },
    { name: 'Experimentation & Growth', level: 83 },
    { name: 'Observability (OpenTelemetry)', level: 78 },
    { name: 'Leadership & Mentorship', level: 90 },
    { name: 'Accessibility', level: 76 },
  ],
  experience: [
    {
      company: 'Stripe',
      role: 'Staff Software Engineer · Payments Platform',
      period: '2022 — Present',
      bullets: [
        'Led rebuild of card-present checkout flow; p95 latency dropped from 620ms to 390ms and auth success rose +2.8 ppts.',
        'Designed multi-region idempotency service (Go + Redis + Kafka); eliminated double-charges during failovers.',
        'Drove SCA compliance program across 5 EU markets; chargeback rate reduced 14% while approval held steady.',
        'Mentor to 6 engineers; launched weekly design reviews that cut integration incidents by 21%.',
      ],
    },
    {
      company: 'Airbnb',
      role: 'Senior Software Engineer · Guest Growth',
      period: '2018 — 2022',
      bullets: [
        'Owned search-to-book funnel; shipped ranking + caching changes that increased conversion 9.7% YoY.',
        'Built experimentation platform guardrails (feature flags, CUPED); reduced false positives by 18%.',
        'Co-led SEO landing rebuild in Next.js with edge rendering; organic sign-ups +12% and TTFB -41%.',
        'Partnered with Design on accessibility remediation; Lighthouse accessibility scores improved from 73 to 94.',
      ],
    },
    {
      company: 'Dropbox',
      role: 'Software Engineer · Collaboration',
      period: '2015 — 2018',
      bullets: [
        'Implemented real-time presence and comments in Paper (React + WebSockets); DAU in active docs +8%.',
        'Refactored legacy Backbone UI to React/TypeScript; cut bundle size by 28% and error rate by 30%.',
        'Built abuse-detection signals pipeline (Kafka → Flink); reduced spam shares by 35% in 3 months.',
        'On-call lead for collaboration services; drove MTTR from 47 to 22 minutes with runbooks and SLOs.',
      ],
    },
    {
      company: 'MIT Media Lab',
      role: 'Graduate Research Assistant',
      period: '2013 — 2015',
      bullets: [
        'Researched multi-modal interfaces; published 2 papers (CHI, UIST) on adaptive UIs for low-vision users.',
        'Prototyped wearable navigation aid (Python, OpenCV); 87% task success in pilot with 18 participants.',
        'Taught lab section for “Software Design Studio”; student project pass rate 98%.',
      ],
    },
    {
      company: 'Freelance',
      role: 'Full‑Stack Engineer',
      period: '2011 — 2013',
      bullets: [
        'Built and maintained 7 production Rails apps for SMB clients; average launch-to-revenue window 6 weeks.',
        'Introduced CI/CD (CircleCI) and error monitoring (Sentry) to client stacks, cutting post-launch bugs by 25%.',
      ],
    },
  ],
  education: [
    { school: 'Massachusetts Institute of Technology (MIT)', degree: 'MEng, Electrical Engineering & Computer Science', period: '2013 — 2015' },
    { school: 'University of Texas at Austin', degree: 'BS, Computer Science', period: '2009 — 2013' },
  ],
  photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
}

/* Helper UI atoms (kept here for reuse across template components) */
const SectionTitle = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <div className="uppercase text-[11px] font-semibold tracking-[0.16em]" style={{ color }}>
    {children}
  </div>
)

const SkillBar = ({ label, level, color }: { label: string; level: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[11px] text-gray-600">
      <span>{label}</span>
      <span>{level}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <div className="h-full" style={{ width: `${level}%`, backgroundColor: color }} />
    </div>
  </div>
)

/* Template implementations */

const A4 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={className}
    style={{ width: 794, height: 1123, background: '#fff', boxShadow: '0 15px 40px rgba(0,0,0,0.06)' }}
  >
    {children}
  </div>
)

const DoubleColumn: React.FC<{ sample: SampleCvData }> = ({ sample }) => (
  <A4 className="flex">
    <div className="w-[36%] bg-[#0E1726] text-white p-8 space-y-8">
      <div className="space-y-2">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30">
          <img src={sample.photo} alt={sample.name} className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-semibold leading-tight">{sample.name}</h1>
        <p className="text-sm text-white/70">{sample.title}</p>
      </div>
      <div className="space-y-6">
        <div>
          <SectionTitle color="#8FD6FF">Contact</SectionTitle>
          <div className="text-sm mt-3 space-y-1.5 text-white/80">
            <div>{sample.contact.email}</div>
            <div>{sample.contact.phone}</div>
            <div>{sample.contact.location}</div>
            <div>{sample.contact.website}</div>
          </div>
        </div>
        <div>
          <SectionTitle color="#8FD6FF">Skills</SectionTitle>
          <div className="mt-3 space-y-3">
            {sample.skills.slice(0, 6).map((skill) => (
              <SkillBar key={skill.name} label={skill.name} level={skill.level} color="#8FD6FF" />
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="flex-1 p-10 space-y-8">
      <div>
        <SectionTitle color="#0E1726">Summary</SectionTitle>
        <p className="text-sm text-gray-700 leading-relaxed mt-3">{sample.summary}</p>
      </div>
      <div>
        <SectionTitle color="#0E1726">Experience</SectionTitle>
        <div className="mt-4 space-y-4">
          {sample.experience.map((exp) => (
            <div key={exp.company} className="border-b border-gray-100 pb-3">
              <div className="flex justify-between text-sm font-semibold text-gray-900">
                <span>{exp.role} · {exp.company}</span>
                <span className="text-gray-500 font-normal">{exp.period}</span>
              </div>
              <ul className="list-disc list-outside pl-5 text-sm text-gray-700 mt-2 space-y-1">
                {exp.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle color="#0E1726">Education</SectionTitle>
        {sample.education.map((edu) => (
          <div key={edu.school} className="mt-2 text-sm text-gray-700 flex justify-between">
            <div>
              <div className="font-semibold">{edu.school}</div>
              <div className="text-gray-500">{edu.degree}</div>
            </div>
            <div className="text-gray-500">{edu.period}</div>
          </div>
        ))}
      </div>
    </div>
  </A4>
)

const IvyLeague: React.FC<{ sample: SampleCvData }> = ({ sample }) => (
  <A4 className="px-10 py-12" >
    <div className="border border-gray-200 h-full rounded-2xl overflow-hidden">
      <div className="bg-[#0F172A] text-white px-10 py-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">{sample.name}</h1>
          <p className="text-sm text-white/70">{sample.title}</p>
        </div>
        <div className="text-right text-xs text-white/70 space-y-1">
          <div>{sample.contact.email}</div>
          <div>{sample.contact.phone}</div>
          <div>{sample.contact.location}</div>
        </div>
      </div>
      <div className="px-10 py-8 space-y-8">
        <div>
          <SectionTitle color="#0F172A">Profile</SectionTitle>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">{sample.summary}</p>
        </div>
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-10">
          <div className="space-y-6">
            <SectionTitle color="#0F172A">Experience</SectionTitle>
            {sample.experience.map((exp) => (
              <div key={exp.company} className="pb-4 border-b border-gray-100">
                <div className="flex justify-between text-sm font-semibold text-gray-900">
                  <span>{exp.role}</span>
                  <span className="text-gray-500 font-normal">{exp.period}</span>
                </div>
                <div className="text-sm text-gray-600">{exp.company}</div>
                <ul className="list-disc list-outside pl-5 text-sm text-gray-700 mt-2 space-y-1">
                  {exp.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div>
              <SectionTitle color="#0F172A">Skills</SectionTitle>
              <div className="mt-3 space-y-2">
                {sample.skills.map((s) => (
                  <div key={s.name} className="flex justify-between text-sm text-gray-700">
                    <span>{s.name}</span>
                    <span className="text-gray-500">{s.level}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionTitle color="#0F172A">Education</SectionTitle>
              {sample.education.map((edu) => (
                <div key={edu.school} className="mt-3 text-sm text-gray-700">
                  <div className="font-semibold">{edu.school}</div>
                  <div className="text-gray-500">{edu.degree}</div>
                  <div className="text-gray-400 text-xs">{edu.period}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </A4>
)

const Elegant: React.FC<{ sample: SampleCvData }> = ({ sample }) => (
  <A4 className="p-10" >
    <div className="h-full rounded-3xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-[#FDE4D6] via-white to-[#F3F6FF] px-10 py-12 flex items-center gap-6">
        <div className="w-18 h-18 rounded-full overflow-hidden ring-4 ring-white shadow-md">
          <img src={sample.photo} alt={sample.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{sample.name}</h1>
          <p className="text-sm text-gray-600">{sample.title}</p>
        </div>
      </div>
      <div className="px-10 py-8 grid grid-cols-[1.1fr_0.9fr] gap-10">
        <div className="space-y-6">
          <SectionTitle color="#111827">Summary</SectionTitle>
          <p className="text-sm text-gray-700 leading-relaxed">{sample.summary}</p>
          <SectionTitle color="#111827">Experience</SectionTitle>
          {sample.experience.map((exp) => (
            <div key={exp.company} className="border-l-2 border-orange-200 pl-4 py-2">
              <div className="flex justify-between text-sm font-semibold text-gray-900">
                <span>{exp.role}</span>
                <span className="text-gray-500 font-normal">{exp.period}</span>
              </div>
              <div className="text-sm text-orange-600 font-medium">{exp.company}</div>
              <ul className="list-disc list-outside pl-5 text-sm text-gray-700 mt-2 space-y-1">
                {exp.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div>
            <SectionTitle color="#111827">Skills</SectionTitle>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {sample.skills.map((s) => (
                <SkillBar key={s.name} label={s.name} level={s.level} color="#F59E0B" />
              ))}
            </div>
          </div>
          <div>
            <SectionTitle color="#111827">Education</SectionTitle>
            {sample.education.map((edu) => (
              <div key={edu.school} className="mt-3 text-sm text-gray-700">
                <div className="font-semibold">{edu.school}</div>
                <div className="text-gray-500">{edu.degree}</div>
                <div className="text-gray-400 text-xs">{edu.period}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </A4>
)

const Timeline: React.FC<{ sample: SampleCvData }> = ({ sample }) => (
  <A4 className="p-10 bg-[#0B1220] text-white">
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-semibold">{sample.name}</h1>
        <p className="text-sm text-white/60">{sample.title}</p>
      </div>
      <div className="text-right text-xs text-white/60 space-y-1">
        <div>{sample.contact.email}</div>
        <div>{sample.contact.phone}</div>
        <div>{sample.contact.location}</div>
      </div>
    </div>
    <div className="grid grid-cols-[1fr_0.9fr] gap-10">
      <div className="space-y-6">
        <SectionTitle color="#A5B4FC">Experience</SectionTitle>
        <div className="space-y-6">
          {sample.experience.map((exp, idx) => (
            <div key={exp.company} className="relative pl-6">
              <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-[#A5B4FC]" />
              <div className="absolute left-[5px] top-4 bottom-[-12px] border-l border-white/10" />
              <div className="flex justify-between text-sm font-semibold">
                <span>{exp.role}</span>
                <span className="text-white/60 font-normal">{exp.period}</span>
              </div>
              <div className="text-sm text-[#A5B4FC]">{exp.company}</div>
              <ul className="list-disc list-outside pl-5 text-sm text-white/80 mt-2 space-y-1">
                {exp.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <SectionTitle color="#A5B4FC">Profile</SectionTitle>
          <p className="text-sm text-white/80 leading-relaxed mt-3">{sample.summary}</p>
        </div>
        <div>
          <SectionTitle color="#A5B4FC">Skills</SectionTitle>
          <div className="mt-3 space-y-3">
            {sample.skills.map((s) => (
              <SkillBar key={s.name} label={s.name} level={s.level} color="#A5B4FC" />
            ))}
          </div>
        </div>
        <div>
          <SectionTitle color="#A5B4FC">Education</SectionTitle>
          {sample.education.map((edu) => (
            <div key={edu.school} className="mt-3 text-sm text-white/80">
              <div className="font-semibold">{edu.school}</div>
              <div className="text-white/60">{edu.degree}</div>
              <div className="text-white/50 text-xs">{edu.period}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </A4>
)

const Minimal: React.FC<{ sample: SampleCvData }> = ({ sample }) => (
  <A4 className="p-12">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">{sample.name}</h1>
        <p className="text-sm text-gray-500">{sample.title}</p>
      </div>
      <div className="text-right text-xs text-gray-500 space-y-1">
        <div>{sample.contact.email}</div>
        <div>{sample.contact.phone}</div>
        <div>{sample.contact.location}</div>
      </div>
    </div>
    <div className="space-y-8">
      <div>
        <SectionTitle color="#111827">Summary</SectionTitle>
        <p className="text-sm text-gray-700 leading-relaxed mt-3">{sample.summary}</p>
      </div>
      <div className="grid grid-cols-[1.1fr_0.9fr] gap-8">
        <div className="space-y-4">
          <SectionTitle color="#111827">Experience</SectionTitle>
          {sample.experience.map((exp) => (
            <div key={exp.company}>
              <div className="flex justify-between text-sm font-semibold text-gray-900">
                <span>{exp.role}</span>
                <span className="text-gray-500 font-normal">{exp.period}</span>
              </div>
              <div className="text-sm text-gray-500">{exp.company}</div>
              <ul className="list-disc list-outside pl-5 text-sm text-gray-700 mt-2 space-y-1">
                {exp.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div>
            <SectionTitle color="#111827">Skills</SectionTitle>
            <div className="mt-3 space-y-2">
              {sample.skills.map((s) => (
                <div key={s.name} className="flex justify-between text-sm text-gray-700">
                  <span>{s.name}</span>
                  <span className="text-gray-500">{s.level}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionTitle color="#111827">Education</SectionTitle>
            {sample.education.map((edu) => (
              <div key={edu.school} className="mt-3 text-sm text-gray-700">
                <div className="font-semibold">{edu.school}</div>
                <div className="text-gray-500">{edu.degree}</div>
                <div className="text-gray-400 text-xs">{edu.period}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </A4>
)

const Classic: React.FC<{ sample: SampleCvData }> = ({ sample }) => (
  <A4 className="p-12">
    <div className="text-center mb-8 border-b border-gray-200 pb-6">
      <h1 className="text-3xl font-semibold text-gray-900">{sample.name}</h1>
      <p className="text-sm text-gray-500">{sample.title}</p>
      <div className="text-xs text-gray-400 mt-2 space-x-3">
        <span>{sample.contact.email}</span>
        <span>•</span>
        <span>{sample.contact.phone}</span>
        <span>•</span>
        <span>{sample.contact.location}</span>
      </div>
    </div>
    <div className="space-y-8">
      <div>
        <SectionTitle color="#1F2937">Professional Summary</SectionTitle>
        <p className="text-sm text-gray-700 leading-relaxed mt-3">{sample.summary}</p>
      </div>
      <div>
        <SectionTitle color="#1F2937">Experience</SectionTitle>
        <div className="mt-4 space-y-5">
          {sample.experience.map((exp) => (
            <div key={exp.company}>
              <div className="flex justify-between text-sm font-semibold text-gray-900">
                <span>{exp.role} — {exp.company}</span>
                <span className="text-gray-500 font-normal">{exp.period}</span>
              </div>
              <ul className="list-disc list-outside pl-5 text-sm text-gray-700 mt-2 space-y-1">
                {exp.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <SectionTitle color="#1F2937">Skills</SectionTitle>
          <ul className="mt-3 space-y-1 text-sm text-gray-700 list-disc list-inside">
            {sample.skills.map((s) => <li key={s.name}>{s.name} ({s.level}%)</li>)}
          </ul>
        </div>
        <div>
          <SectionTitle color="#1F2937">Education</SectionTitle>
          {sample.education.map((edu) => (
            <div key={edu.school} className="mt-3 text-sm text-gray-700">
              <div className="font-semibold">{edu.school}</div>
              <div className="text-gray-500">{edu.degree}</div>
              <div className="text-gray-400 text-xs">{edu.period}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </A4>
)

export const templates: CvTemplateMeta[] = [
  {
    id: 'double-column',
    name: 'Double Column',
    professions: ['Tech', 'Engineering'],
    stacks: ['Frontend', 'Backend', 'DevOps'],
    tags: ['ATS', 'Modern'],
    layout: 'double',
    theme: { primary: '#0E1726', accent: '#8FD6FF' },
    Component: DoubleColumn,
  },
  {
    id: 'ivy-league',
    name: 'Ivy League',
    professions: ['Finance', 'Law', 'Academia'],
    stacks: ['Data', 'AI'],
    tags: ['ATS', 'Formal'],
    layout: 'single',
    theme: { primary: '#0F172A', accent: '#E2E8F0' },
    Component: IvyLeague,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    professions: ['Marketing', 'PR', 'Comms'],
    stacks: ['Product', 'Frontend'],
    tags: ['Modern'],
    layout: 'double',
    theme: { primary: '#F59E0B', accent: '#FDE4D6' },
    Component: Elegant,
  },
  {
    id: 'timeline',
    name: 'Timeline',
    professions: ['Design', 'Creative'],
    stacks: ['Frontend', 'AI'],
    tags: ['Modern'],
    layout: 'timeline',
    theme: { primary: '#A5B4FC', accent: '#0B1220' },
    Component: Timeline,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    professions: ['Tech', 'Data'],
    stacks: ['Backend', 'Data', 'AI'],
    tags: ['ATS', 'Minimal'],
    layout: 'single',
    theme: { primary: '#111827', accent: '#E5E7EB' },
    Component: Minimal,
  },
  {
    id: 'classic',
    name: 'Classic',
    professions: ['Accounting', 'Legal', 'Finance'],
    stacks: ['Operations'],
    tags: ['ATS'],
    layout: 'single',
    theme: { primary: '#1F2937', accent: '#E5E7EB' },
    Component: Classic,
  },
]
