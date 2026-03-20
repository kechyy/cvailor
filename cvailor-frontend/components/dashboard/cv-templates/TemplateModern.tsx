'use client'
import type { CVData } from '@/types'
import { BASE_FONT_SIZE_PX, FONT_SANS_ATS, BASE_LINE_HEIGHT } from './standards'

interface Props { cv: CVData; matchedKeywords?: string[] }

const headerRow = (title: string, accent = '#2563EB') => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: accent, whiteSpace: 'nowrap' }}>{title}</span>
    <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
  </div>
)

export default function TemplateModern({ cv }: Props) {
  const { personal, experience = [], education = [], skills = [], languages = [], certifications = [] } = cv

  return (
    <div style={{
      width: 794,
      minHeight: 1123,
      boxSizing: 'border-box',
      padding: '46px 54px 50px',
      background: '#FFFFFF',
      fontFamily: FONT_SANS_ATS,
      color: '#111827',
      lineHeight: BASE_LINE_HEIGHT,
      fontSize: BASE_FONT_SIZE_PX,
    }}>
      <header style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {personal.photoUrl && (
              <div style={{ width: 58, height: 58, borderRadius: '50%', overflow: 'hidden', border: '2px solid #E5E7EB', flexShrink: 0 }}>
                <img src={personal.photoUrl} alt="Profile photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A' }}>{personal.fullName || 'Your Name'}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#2563EB', marginTop: 4 }}>{personal.jobTitle || ''}</div>
            </div>
          </div>
          <div style={{ width: 44, height: 3, background: '#2563EB', borderRadius: 999 }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 10, color: '#6B7280', marginTop: 12 }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((item, i, arr) => (
            <span key={item}>
              {item}{i < arr.length - 1 && <span style={{ margin: '0 6px', color: '#E5E7EB' }}>|</span>}
            </span>
          ))}
        </div>
      </header>

      {personal.summary && (
        <section style={{ marginBottom: 18 }}>
          {headerRow('Summary')}
          <p style={{ margin: 0, fontSize: 12, color: '#1F2937' }}>{personal.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          {headerRow('Experience')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {experience.map((exp) => (
              <div key={exp.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{exp.role}</div>
                  <div style={{ fontSize: 10, color: '#6B7280', flexShrink: 0 }}>{exp.startDate} – {exp.endDate}</div>
                </div>
                <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>{exp.company}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
                  {exp.bullets?.filter(Boolean).slice(0, 4).map((b, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 10.2, color: '#374151' }}>
                      <span style={{ color: '#2563EB', fontWeight: 700 }}>▸</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          {headerRow('Education')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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

      {certifications.length > 0 && (
        <section style={{ marginBottom: 14 }}>
          {headerRow('Certifications')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10.5, color: '#374151' }}>
            {certifications.map((c) => <span key={c}>{c}</span>)}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section style={{ marginBottom: languages.length > 0 ? 12 : 0 }}>
          {headerRow('Skills')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {skills.map((skill) => (
              <span key={skill} style={{
                fontSize: 10.5,
                padding: '6px 10px',
                borderRadius: 4,
                border: '1px solid #BFDBFE',
                background: '#EFF6FF',
                color: '#1D4ED8',
              }}>{skill}</span>
            ))}
          </div>
        </section>
      )}

      {languages.length > 0 && (
        <section>
          {headerRow('Languages')}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 10.5, color: '#111827' }}>
            {languages.map((lang) => <span key={lang}>{lang}</span>)}
          </div>
        </section>
      )}
    </div>
  )
}
