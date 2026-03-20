'use client'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CVData, TemplateId } from '@/types'
import { renderTemplate } from './cv-templates/registry'

const A4_WIDTH = 794
const A4_HEIGHT = 1123
const SAFE_PAD_TOP = 0
const SAFE_PAD_BOTTOM = 0
const CONTENT_WINDOW = A4_HEIGHT - SAFE_PAD_TOP - SAFE_PAD_BOTTOM

interface Props {
  templateId: TemplateId
  cv: CVData
  matchedKeywords?: string[]
  className?: string
  shadow?: boolean
}

export default function A4PreviewFrame({ templateId, cv, matchedKeywords, className, shadow = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.26)
  const [pageCount, setPageCount] = useState(1)

  const scaledHeight = A4_HEIGHT * scale
  const scaledWidth = A4_WIDTH * scale

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const compute = () => {
      const width = el.clientWidth || A4_WIDTH
      const next = Math.min(parseFloat((width / A4_WIDTH).toFixed(4)), 1)
      setScale((prev) => (Math.abs(prev - next) > 0.0005 ? next : prev))
    }
    compute()
    const obs = new ResizeObserver(compute)
    obs.observe(el)
    return () => obs.disconnect()
  }, [templateId])

  useLayoutEffect(() => {
    const inner = measureRef.current
    if (!inner) return
    const h = inner.scrollHeight
    const pages = Math.max(1, Math.ceil(h / CONTENT_WINDOW))
    setPageCount(pages)
  }, [templateId, cv])

  const pages = useMemo(() => Array.from({ length: pageCount }, (_, i) => i), [pageCount])

  return (
    <>
      <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', height: 0, overflow: 'hidden' }}>
        <div ref={measureRef} style={{ width: A4_WIDTH }}>
          {renderTemplate(templateId, { cv, matchedKeywords })}
        </div>
      </div>

      <div
        ref={containerRef}
        className={className}
        style={{
          width: '100%',
          height: scaledHeight,
          position: 'relative',
          overflowY: 'auto',
          borderRadius: 10,
          background: '#F7F8FA',
          boxShadow: shadow ? '0 12px 32px rgba(15,23,42,0.18)' : 'none',
        }}
      >
        {pages.map((page) => {
          const offset = page * CONTENT_WINDOW
          return (
            <div
              key={page}
              style={{
                width: scaledWidth,
                height: scaledHeight,
                margin: '0 auto 14px',
                background: '#fff',
                boxShadow: shadow ? '0 10px 26px rgba(17,24,39,0.18)' : 'none',
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: SAFE_PAD_TOP * scale, flexShrink: 0 }} />

              <div
                style={{
                  height: CONTENT_WINDOW * scale,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -offset * scale,
                    left: 0,
                    width: scaledWidth,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {renderTemplate(templateId, { cv, matchedKeywords })}
                </div>
              </div>

              <div style={{ height: SAFE_PAD_BOTTOM * scale, flexShrink: 0 }} />
            </div>
          )
        })}
      </div>
    </>
  )
}
