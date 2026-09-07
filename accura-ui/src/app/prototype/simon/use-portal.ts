'use client'
import * as React from 'react'

// Returns the simon-portal-root element for redirecting Radix portals
// into the phone frame so dialogs don't escape to document.body
export function useSimonPortal() {
  const [container, setContainer] = React.useState<HTMLElement | null>(null)
  React.useEffect(() => {
    setContainer(document.getElementById('simon-portal-root'))
  }, [])
  return container
}
