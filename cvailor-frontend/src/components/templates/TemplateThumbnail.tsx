'use client'
import React, { useLayoutEffect, useRef, useState } from 'react'
import type { CvTemplateMeta, SampleCvData } from '@/src/templates/registry'

type Props = {
  template: CvTemplateMeta
  sample: SampleCvData
}

// Responsive outer viewport that keeps A4 ratio and scales to full card width
export function TemplateThumbnail({ template, sample }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.26)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const compute = () => {
      const width = el.clientWidth || 210
      setScale(width / 794)
    }
    compute()
    const handle = () => compute()
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        aspectRatio: '794 / 1123',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#F3F4F6',
        border: '1px solid #E5E7EB',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 794,
          height: 1123,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      >
        <template.Component sample={sample} />
      </div>
    </div>
  )
}
