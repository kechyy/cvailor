'use client'
import type { CVData } from '@/types'
import { BASE_FONT_SIZE_PX, BASE_LINE_HEIGHT, FONT_SERIF_ATS } from './standards'
interface Props { cv: CVData; matchedKeywords?: string[] }

export default function TemplateAcademic({ cv }: Props) {
  const { personal, experience, education, skills, languages = [], certifications = [] } = cv

  const SectionHeader = ({ title }: { title: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <span style={{
        fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase' as const,
        letterSpacing: 2, color: '#374151', whiteSpace: 'nowrap' as const
      }}>
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: '#D1D5DB' }} />
    </div>
  )

  return (
    <div style={{
      fontFamily: FONT_SERIF_ATS,
      color: '#111827', background: '#FFFFFF',
      width: 794, minHeight: 1123,
      boxSizing: 'border-box' as const, fontSize: BASE_FONT_SIZE_PX, lineHeight: BASE_LINE_HEIGHT,
    }}>

      {/* ── HEADER — left-border identity mark ── */}
      <div style={{ background: '#FFFFFF', padding: '40px 52px 28px', borderBottom: '1px solid #E5E7EB' }}>
        {/* The 4px left border is Academic's visual signature */}
        <div style={{ borderLeft: '4px solid #374151', paddingLeft: 16, marginBottom: 16 }}>
          <h1 style={{
            fontSize: 26, fontWeight: 800, margin: '0 0 5px',
            letterSpacing: -0.3, color: '#111827', lineHeight: 1.1
          }}>
            {personal.fullName || 'Your Name'}
          </h1>
          <p style={{ fontSize: 11.5, color: '#374151', margin: '0 0 2px', fontWeight: 500 }}>
            {personal.jobTitle || ''}
          </p>
        </div>
        {/* Dark contact bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap' as const, gap: 0,
          background: '#374151', borderRadius: 4,
          padding: '8px 14px',
        }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin]
            .filter(Boolean).map((v, i, arr) => (
              <span key={v} style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>
                {v}{i < arr.length - 1 && <span style={{ margin: '0 10px', opacity: 0.35 }}>|</span>}
              </span>
            ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: '24px 52px 40px' }}>

        {/* Research Profile */}
        {personal.summary && (
          <div style={{ marginBottom: 18 }}>
            <SectionHeader title="Research Profile" />
            <p style={{ color: '#4B5563', lineHeight: 1.7, margin: 0, fontSize: 10 }}>
              {personal.summary}
            </p>
          </div>
        )}

        {/* EDUCATION — first, before experience (academic convention) */}
        {education.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <SectionHeader title="Education & Qualifications" />
            {education.map(edu => (
              <div key={edu.id} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: 10,
                paddingBottom: 10, borderBottom: '1px solid #E5E7EB'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 11, color: '#111827' }}>
                    {edu.degree} in {edu.field}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: 10, marginTop: 2 }}>{edu.institution}</div>
                </div>
                <span style={{ fontSize: 9.5, color: '#9CA3AF', flexShrink: 0, marginLeft: 16, marginTop: 2 }}>
                  {edu.year}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Research & Professional Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <SectionHeader title="Research & Professional Experience" />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: 11, color: '#111827' }}>{exp.role}</span>
                  <span style={{ fontSize: 9, color: '#9CA3AF', flexShrink: 0, marginLeft: 8 }}>
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <div style={{ color: '#374151', fontSize: 10, fontWeight: 600, marginBottom: 4 }}>
                  {exp.company}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {exp.bullets.filter(Boolean).slice(0, 3).map((b, i) => (
                    <li key={i} style={{ color: '#4B5563', marginBottom: 3, lineHeight: 1.55, fontSize: 9.5 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Skills & Technical Expertise */}
        {skills.length > 0 && (
          <div style={{ marginBottom: certifications.length > 0 || languages.length > 0 ? 18 : 0 }}>
            <SectionHeader title="Skills & Technical Expertise" />
            <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, fontSize: 10 }}>
              {skills.join('   ·   ')}
            </p>
          </div>
        )}

        {/* Certifications & Awards */}
        {certifications.length > 0 && (
          <div style={{ marginBottom: languages.length > 0 ? 18 : 0 }}>
            <SectionHeader title="Certifications & Awards" />
            <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, fontSize: 10 }}>
              {certifications.join('   ·   ')}
            </p>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <SectionHeader title="Languages" />
            <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, fontSize: 10 }}>
              {languages.join('   ·   ')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
