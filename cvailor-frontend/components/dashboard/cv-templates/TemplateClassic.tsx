'use client'
import type { CVData } from '@/types'
import { BASE_FONT_SIZE_PX, BASE_LINE_HEIGHT, FONT_SERIF_ATS } from './standards'

interface Props { cv: CVData; matchedKeywords?: string[] }

const sectionHeader = (title: string) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, marginTop: 2 }}>
    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#111827', whiteSpace: 'nowrap' }}>{title}</span>
    <div style={{ flex: 1, height: 1, background: '#D1D5DB' }} />
  </div>
)

export default function TemplateClassic({ cv }: Props) {
  const { personal, experience = [], education = [], skills = [], languages = [], certifications = [] } = cv

  return (
    <div style={{
      fontFamily: FONT_SERIF_ATS,
      color: '#111827',
      background: '#FFFFFF',
      width: 794,
      minHeight: 1123,
      padding: '52px 60px',
      boxSizing: 'border-box',
      fontSize: BASE_FONT_SIZE_PX,
      lineHeight: BASE_LINE_HEIGHT,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 22, paddingBottom: 16, borderBottom: '2px solid #111827' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 5px', letterSpacing: 1.5, textTransform: 'uppercase' }}>{personal.fullName || 'Your Name'}</h1>
        {personal.jobTitle && <p style={{ fontSize: 11, color: '#4B5563', margin: '0 0 10px', fontStyle: 'italic' }}>{personal.jobTitle}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4, fontSize: 9.5, color: '#6B7280' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((v, i, arr) => (
            <span key={v}>
              {v}
              {i < arr.length - 1 && <span style={{ margin: '0 8px', color: '#D1D5DB' }}>|</span>}
            </span>
          ))}
        </div>
      </div>

      {personal.summary && (
        <div style={{ marginBottom: 20 }}>
          {sectionHeader('Professional Summary')}
          <p style={{ color: '#374151', lineHeight: 1.7, margin: 0, fontStyle: 'italic', fontSize: 10.5 }}>{personal.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {sectionHeader('Professional Experience')}
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 1 }}>
                <span style={{ fontWeight: 700, fontSize: 11.5 }}>{exp.role}</span>
                <span style={{ fontSize: 9.5, color: '#6B7280', flexShrink: 0, marginLeft: 8 }}>{exp.startDate} – {exp.endDate}</span>
              </div>
              <div style={{ fontStyle: 'italic', color: '#4B5563', fontSize: 10.5, marginBottom: 5 }}>{exp.company}</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {exp.bullets?.filter(Boolean).slice(0, 4).map((b, i) => (
                  <li key={i} style={{ color: '#374151', marginBottom: 3, lineHeight: 1.55, fontSize: 10 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {sectionHeader('Education')}
          {education.map((edu) => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 10.5 }}>{edu.degree} in {edu.field}</span>
                <span style={{ color: '#6B7280', fontSize: 10, marginLeft: 8, fontStyle: 'italic' }}>{edu.institution}</span>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: 9.5, flexShrink: 0 }}>{edu.year}</span>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: certifications.length > 0 || languages.length > 0 ? 20 : 0 }}>
          {sectionHeader('Skills & Expertise')}
          <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, fontSize: 10 }}>{skills.join('   ·   ')}</p>
        </div>
      )}

      {certifications.length > 0 && (
        <div style={{ marginBottom: languages.length > 0 ? 20 : 0 }}>
          {sectionHeader('Certifications')}
          <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, fontSize: 10 }}>{certifications.join('   ·   ')}</p>
        </div>
      )}

      {languages.length > 0 && (
        <div>
          {sectionHeader('Languages')}
          <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, fontSize: 10 }}>{languages.join('   ·   ')}</p>
        </div>
      )}
    </div>
  )
}
