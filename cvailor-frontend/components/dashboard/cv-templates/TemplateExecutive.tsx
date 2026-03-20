'use client'
import type { CVData } from '@/types'
import { BASE_FONT_SIZE_PX, BASE_LINE_HEIGHT, FONT_SERIF_ATS } from './standards'
interface Props { cv: CVData; matchedKeywords?: string[] }

export default function TemplateExecutive({ cv }: Props) {
  const { personal, experience, education, skills, languages = [], certifications = [] } = cv

  const GoldHeader = ({ title }: { title: string }) => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const,
          letterSpacing: 2, color: '#C9A84C', whiteSpace: 'nowrap' as const
        }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: '#E2D9C5' }} />
      </div>
      <div style={{ height: 1, background: '#E2E8F0', margin: '8px 0 10px' }} />
    </div>
  )

  return (
    <div style={{
      fontFamily: FONT_SERIF_ATS,
      background: '#ffffff', width: 794, minHeight: 1123,
      boxSizing: 'border-box' as const, fontSize: BASE_FONT_SIZE_PX, lineHeight: BASE_LINE_HEIGHT,
    }}>

      {/* ── NAVY HEADER BAND ── */}
      <div style={{ background: '#0F2044', padding: '36px 52px 28px' }}>
        <div style={{ borderBottom: '1px solid rgba(201,168,76,0.4)', paddingBottom: 14, marginBottom: 12 }}>
          <h1 style={{
            fontSize: 27, fontWeight: 700, color: '#FFFFFF',
            margin: '0 0 5px', letterSpacing: 0.5
          }}>
            {personal.fullName || 'Your Name'}
          </h1>
          <p style={{ color: '#C9A84C', fontSize: 12, margin: 0, fontWeight: 600, letterSpacing: 0.5 }}>
            {personal.jobTitle || ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 9.5, color: 'rgba(255,255,255,0.5)', flexWrap: 'wrap' as const }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin]
            .filter(Boolean).map(v => <span key={v}>{v}</span>)}
        </div>
      </div>

      {/* ── TWO-PANEL BODY ── */}
      <div style={{ display: 'flex', minHeight: 895 }}>

        {/* LEFT — Career History — 56% */}
        <div style={{
          flex: '0 0 56%', padding: '28px 24px 32px 52px',
          borderRight: '1px solid #E9EAEC',
          alignSelf: 'stretch',
        }}>

          {experience.length > 0 && (
            <div>
              <GoldHeader title="Career History" />
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: 11.5, color: '#0F2044' }}>{exp.role}</span>
                    <span style={{ fontSize: 9, color: '#9CA3AF', flexShrink: 0, marginLeft: 8 }}>
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <div style={{ color: '#C9A84C', fontSize: 10.5, fontStyle: 'italic', marginBottom: 5, fontWeight: 600 }}>
                    {exp.company}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {exp.bullets.filter(Boolean).slice(0, 3).map((b, i) => (
                      <li key={i} style={{ color: '#374151', marginBottom: 3, lineHeight: 1.55, fontSize: 9.5 }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Credentials — 44% on light grey */}
        <div style={{
          flex: '0 0 44%', padding: '28px 28px 32px',
          background: '#F1F5F9',
          borderLeft: '2px solid #E5E7EB',
          alignSelf: 'stretch',
        }}>

          {/* Executive Summary */}
          {personal.summary && (
            <div style={{ marginBottom: 20 }}>
              <GoldHeader title="Executive Summary" />
              <p style={{ color: '#374151', lineHeight: 1.7, margin: 0, fontStyle: 'italic', fontSize: 10 }}>
                {personal.summary}
              </p>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <GoldHeader title="Education" />
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 10, color: '#0F2044' }}>{edu.degree} in {edu.field}</div>
                  <div style={{ color: '#6B7280', fontSize: 9.5, fontStyle: 'italic' }}>{edu.institution}</div>
                  <div style={{ color: '#9CA3AF', fontSize: 9 }}>{edu.year}</div>
                </div>
              ))}
            </div>
          )}

          {/* Core Competencies */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <GoldHeader title="Core Competencies" />
              <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, fontSize: 9.5 }}>
                {skills.join('  ·  ')}
              </p>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <GoldHeader title="Certifications" />
              {certifications.map(c => (
                <div key={c} style={{
                  fontSize: 9.5, color: '#374151', marginBottom: 6,
                  paddingLeft: 10, borderLeft: '2px solid #C9A84C', lineHeight: 1.4
                }}>
                  {c}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <GoldHeader title="Languages" />
              <p style={{ color: '#374151', lineHeight: 1.8, margin: 0, fontSize: 9.5 }}>
                {languages.join('  ·  ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
