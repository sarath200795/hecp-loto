import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Detects a redirect/navigation loop — the cause of Chrome's "Throttling
// navigation to prevent the browser from hanging" warning — and logs the
// offending route cycle, which the browser warning itself never reveals.
// Purely observational: it never navigates or mutates routing.
const WINDOW_MS = 2000
const THRESHOLD = 25

export default function NavigationLoopMonitor() {
  const location = useLocation()
  const historyRef = useRef([])
  const reportedRef = useRef(false)

  useEffect(() => {
    const now = Date.now()
    const hist = historyRef.current
    hist.push({ path: location.pathname + location.search, t: now })
    while (hist.length && now - hist[0].t > WINDOW_MS) hist.shift()

    if (hist.length >= THRESHOLD) {
      if (!reportedRef.current) {
        reportedRef.current = true
        const recent = hist.slice(-14).map((h) => h.path)
        console.error(
          `[HECP] Navigation loop detected — ${hist.length} navigations in ${WINDOW_MS}ms.\n` +
            `Recent route sequence (newest last):\n  ${recent.join('\n  → ')}\n` +
            'This is what trips Chrome’s navigation-throttling guard. Share this list to pinpoint the loop.',
        )
      }
    } else if (hist.length <= 2) {
      // Settled down — re-arm so a later, distinct loop is still reported.
      reportedRef.current = false
    }
  }, [location.pathname, location.search])

  return null
}
