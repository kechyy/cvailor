'use client'
import type { CVData } from '@/types'
import { BASE_FONT_SIZE_PX, BASE_LINE_HEIGHT, FONT_SANS_ATS } from './standards'

interface Props { cv: CVData; matchedKeywords?: string[] }

export default function TemplateCreative({ cv }: Props) {
  const { personal, experience = [], education = [], skills = [], certifications = [], languages = [] } = cv

  const section = (title: string) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 5 }}>{title}</div>
      <div style={{ width: 32, height: 2, background: '#FB923C' }} />
    </div>
  )

  return (
    <div style={{ width: 794, minHeight: 1123, boxSizing: 'border-box', background: '#FFFBF5', fontFamily: FONT_SANS_ATS, color: '#0F172A', lineHeight: BASE_LINE_HEIGHT, fontSize: BASE_FONT_SIZE_PX }}>
      {/* Split header */}
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ flex: 1, background: '#FFFBF5', padding: '44px 32px 36px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {personal.photoUrl && (
              <div style={{ width: 62, height: 62, borderRadius: '50%', overflow: 'hidden', border: '2px solid #FB923C', flexShrink: 0 }}>
                <img src={personal.photoUrl} alt="Profile photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0F172A', margin: '0 0 8px', letterSpacing: -0.5, lineHeight: 1.05 }}>{personal.fullName || 'Your Name'}</h1>
              <p style={{ fontSize: 13, color: '#FB923C', margin: 0, fontWeight: 700 }}>{personal.jobTitle || ''}</p>
            </div>
          </div>
        </div>
        <div style={{ width: 230, background: '#FB7185', flexShrink: 0, padding: '44px 24px 36px' }}>
          <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,0.65)', marginBottom: 14 }}>Contact</div>
          {[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).map((v) => (
            <div key={v} style={{ fontSize: 9, color: '#fff', marginBottom: 7, wordBreak: 'break-all', lineHeight: 1.3 }}>{v}</div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '28px 48px 40px' }}>
        {personal.summary && (
          <section style={{ marginBottom: 16 }}>
            {section('About')}
            <p style={{ margin: '8px 0 0', fontSize: 12.5 }}>{personal.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section style={{ marginBottom: 16 }}>
            {section('Work Experience')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ borderLeft: '3px solid #FB7185', paddingLeft: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 800 }}>{exp.role}</div>
                      <div style={{ fontSize: 11.5, color: '#FB7185', fontWeight: 700 }}>{exp.company}</div>
                    </div>
                    <div style={{ fontSize: 10.5, color: '#6B7280', flexShrink: 0 }}>{exp.startDate} – {exp.endDate}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                    {exp.bullets?.filter(Boolean).slice(0, 4).map((b, i) => (
                      <div key={i} style={{ color: '#6B7280', fontSize: 9.5, marginBottom: 3, paddingLeft: 14, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#FB7185' }}>→</span>
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section style={{ marginBottom: 16 }}>
            {section('Selected Skills')}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {skills.map((skill) => (
                <span key={skill} style={{ fontSize: 11, padding: '6px 10px', background: '#FFF1F2', border: '1.5px solid #FB7185', borderRadius: 20, color: '#FB7185', fontWeight: 700 }}>{skill}</span>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section style={{ marginBottom: 14 }}>
            {section('Education')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {education.map((edu) => (
                <div key={edu.id} style={{ fontSize: 11.5, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{edu.degree} · {edu.institution}</span>
                  <span style={{ color: '#6B7280' }}>{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section style={{ marginBottom: 14 }}>
            {section('Certifications')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, fontSize: 11.5 }}>
              {certifications.map((cert) => (
                <span key={cert}>→ {cert}</span>
              ))}
            </div>
          </section>
        )}

        {languages.length > 0 && (
          <section style={{ marginTop: 12 }}>
            {section('Languages')}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8, fontSize: 11.5 }}>
              {languages.map((lang) => <span key={lang}>→ {lang}</span>)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
