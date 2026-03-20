'use client'
import type { CVData } from '@/types'
import { BASE_FONT_SIZE_PX, BASE_LINE_HEIGHT, FONT_SANS_ATS } from './standards'

interface Props { cv: CVData; matchedKeywords?: string[] }

const sectionLabel = (text: string) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
    <div style={{ width: 3, height: 18, background: '#0D9488' }} />
    <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.8, color: '#0D9488' }}>{text}</span>
  </div>
)

export default function TemplateHealthcare({ cv }: Props) {
  const { personal, experience = [], education = [], skills = [], languages = [], certifications = [] } = cv

  return (
    <div style={{ width: 794, minHeight: 1123, boxSizing: 'border-box', background: '#FFFFFF', fontFamily: FONT_SANS_ATS, color: '#0F172A', lineHeight: BASE_LINE_HEIGHT, fontSize: BASE_FONT_SIZE_PX }}>
      {/* Header */}
      <div style={{ background: '#0D9488', color: '#FFFFFF', padding: '36px 48px 28px' }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{personal.fullName || 'Your Name'}</div>
        {personal.jobTitle && <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 4 }}>{personal.jobTitle}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 10.5, marginTop: 12 }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 46px 34px', boxSizing: 'border-box' }}>
        {personal.summary && (
          <section style={{ marginBottom: 16 }}>
            {sectionLabel('Professional Profile')}
            <p style={{ margin: 0, fontSize: 12, color: '#1F2937' }}>{personal.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section style={{ marginBottom: 16 }}>
            {sectionLabel('Experience')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{exp.role}</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>{exp.startDate} – {exp.endDate}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#0D9488', fontWeight: 700 }}>{exp.company}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {exp.bullets?.filter(Boolean).slice(0, 4).map((b, i) => (
                      <div key={i} style={{ fontSize: 10.2, color: '#374151' }}>• {b}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section style={{ marginBottom: 16 }}>
            {sectionLabel('Certifications & Registrations')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {certifications.map((c) => (
                <div key={c} style={{ fontSize: 10.5, color: '#0F172A', paddingLeft: 10, borderLeft: '3px solid #0D9488' }}>{c}</div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section style={{ marginBottom: 16 }}>
            {sectionLabel('Education')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {education.map((edu) => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{edu.degree} in {edu.field}</div>
                    <div style={{ color: '#6B7280' }}>{edu.institution}</div>
                  </div>
                  <div style={{ color: '#9CA3AF' }}>{edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section style={{ marginBottom: languages.length > 0 ? 12 : 0 }}>
            {sectionLabel('Skills')}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map((skill) => (
                <span key={skill} style={{ fontSize: 10.5, padding: '6px 10px', borderRadius: 6, background: '#F0FDFA', border: '1px solid #99F6E4', color: '#0F172A' }}>{skill}</span>
              ))}
            </div>
          </section>
        )}

        {languages.length > 0 && (
          <section>
            {sectionLabel('Languages')}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 10.5, color: '#0F172A' }}>
              {languages.map((lang) => <span key={lang}>{lang}</span>)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
