'use client'

import * as React from 'react'

// SIMON Mobile Worker App — Mobile Shell Layout
// The phone frame uses transform+isolation to trap position:fixed overlays
// (AlertDialog, Popover, Sheet) inside the 390px container.
// Radix portals are redirected to #simon-portal-root inside the frame.

export default function SimonLayout({ children }: { children: React.ReactNode }) {
  const frameRef = React.useRef<HTMLDivElement>(null)
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    // Give Radix portal container ref after mount
    const el = document.getElementById('simon-portal-root')
    if (el) setPortalContainer(el)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-background-muted)] flex items-start justify-center py-8 px-4">
      {/* Phone frame */}
      <div
        ref={frameRef}
        className="relative bg-[var(--color-background-default)] overflow-hidden flex flex-col"
        style={{
          width: 390,
          minHeight: 844,
          borderRadius: 44,
          boxShadow: '0 0 0 8px #1c1c1e, 0 20px 60px rgba(0,0,0,0.3)',
          transform: 'translateZ(0)',
          isolation: 'isolate',
        }}
      >
        {/* Status bar */}
        <div className="shrink-0 flex items-center justify-between px-6 pt-4 pb-1">
          <span className="text-xs font-semibold text-[var(--color-background-default-foreground)]">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5 items-end h-3">
              {[2,3,4,5].map(h => (
                <div key={h} className="w-1 bg-[var(--color-background-default-foreground)] rounded-sm" style={{ height: h * 2.5 }} />
              ))}
            </div>
            <svg className="w-4 h-3 fill-current text-[var(--color-background-default-foreground)]" viewBox="0 0 24 12">
              <rect x="0" y="3" width="21" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="22" y="5" width="2" height="5" rx="1" fill="currentColor" opacity="0.4"/>
              <rect x="1" y="4" width="16" height="7" rx="1" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>

        {/* Portal root — Radix overlays render here, staying inside the frame */}
        <div id="simon-portal-root" />
      </div>
    </div>
  )
}
