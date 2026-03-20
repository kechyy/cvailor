'use client'
import type { CVData } from '@/types'
import { BASE_FONT_SIZE_PX, BASE_LINE_HEIGHT, FONT_SANS_ATS } from './standards'
interface Props { cv: CVData; matchedKeywords?: string[] }

export default function TemplateProfessional({ cv }: Props) {
  const { personal, experience, education, skills, languages = [], certifications = [] } = cv

  const MainHeader = ({ title }: { title: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <span style={{
        fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const,
        letterSpacing: 2, color: '#1E293B', whiteSpace: 'nowrap' as const
      }}>
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
    </div>
  )

  return (
    <div style={{
      fontFamily: FONT_SANS_ATS,
      display: 'flex', width: 794, minHeight: 1123,
      boxSizing: 'border-box' as const, fontSize: BASE_FONT_SIZE_PX, lineHeight: BASE_LINE_HEIGHT,
    }}>

      {/* ── SIDEBAR — dark slate ── */}
      <div style={{
        width: 218, background: '#1E293B', color: '#fff',
        padding: '36px 20px 36px 24px',
        flexShrink: 0, minHeight: 1123,
        display: 'flex', flexDirection: 'column' as const, gap: 0,
      }}>

        {/* Name & Title */}
        <div style={{ marginBottom: 20, paddingBottom: 18, borderBottom: '2px solid #F59E0B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {personal.photoUrl && (
              <div style={{ width: 54, height: 54, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.25)', flexShrink: 0 }}>
                <img src={personal.photoUrl} alt="Profile photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25, marginBottom: 5 }}>
                {personal.fullName || 'Your Name'}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 500, lineHeight: 1.35 }}>
                {personal.jobTitle || ''}
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const,
            letterSpacing: 2, color: '#F59E0B', marginBottom: 10
          }}>
            Contact
          </div>
          {[personal.email, personal.phone, personal.location, personal.linkedin]
            .filter(Boolean).map(v => (
              <div key={v} style={{
                fontSize: 10, color: 'rgba(255,255,255,0.78)',
                marginBottom: 8, wordBreak: 'break-all' as const, lineHeight: 1.55
              }}>
                {v}
              </div>
            ))}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const,
              letterSpacing: 2, color: '#F59E0B', marginBottom: 10
            }}>
              Expertise
            </div>
            {skills.slice(0, 10).map(s => (
              <div key={s} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                marginBottom: 6
              }}>
                <span style={{ color: '#F59E0B', fontSize: 10, flexShrink: 0 }}>▸</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.82)', lineHeight: 1.55 }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const,
              letterSpacing: 2, color: '#F59E0B', marginBottom: 10
            }}>
              Languages
            </div>
            {languages.slice(0, 3).map(l => (
              <div key={l} style={{ fontSize: 10, color: 'rgba(255,255,255,0.78)', marginBottom: 8, lineHeight: 1.55 }}>
                {l}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const,
              letterSpacing: 2, color: '#F59E0B', marginBottom: 10
            }}>
              Certifications
            </div>
            {certifications.slice(0, 3).map(c => (
              <div key={c} style={{ fontSize: 10, color: 'rgba(255,255,255,0.78)', marginBottom: 8, lineHeight: 1.55 }}>
                {c}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MAIN COLUMN ── */}
      <div style={{ flex: 1, padding: '36px 40px 36px 32px' }}>

        {/* Summary */}
        {personal.summary && (
          <div style={{ marginBottom: 20 }}>
            <MainHeader title="Profile" />
            <p style={{ color: '#4B5563', lineHeight: 1.7, margin: 0, fontSize: 10 }}>
              {personal.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <MainHeader title="Experience" />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: 11, color: '#111827' }}>{exp.role}</span>
                  <span style={{ fontSize: 9, color: '#9CA3AF', flexShrink: 0, marginLeft: 8 }}>
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <div style={{ color: '#F59E0B', fontSize: 10, fontWeight: 600, marginBottom: 5 }}>
                  {exp.company}
                </div>
                <div style={{ paddingLeft: 0 }}>
                  {exp.bullets.filter(Boolean).slice(0, 4).map((b, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 7, marginBottom: 3, alignItems: 'flex-start'
                    }}>
                      <span style={{ color: '#F59E0B', fontSize: 10, flexShrink: 0, marginTop: 1 }}>▸</span>
                      <span style={{ color: '#4B5563', fontSize: 9.5, lineHeight: 1.55 }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <MainHeader title="Education" />
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 10.5, color: '#111827' }}>
                    {edu.degree} in {edu.field}
                  </span>
                  <span style={{ fontSize: 9, color: '#9CA3AF', flexShrink: 0 }}>{edu.year}</span>
                </div>
                <div style={{ color: '#6B7280', fontSize: 10 }}>{edu.institution}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
