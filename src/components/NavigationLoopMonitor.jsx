import { useEffect } from 'react'

// Detects a redirect/navigation loop — the cause of Chrome's "Throttling
// navigation to prevent the browser from hanging" warning. It hooks the
// History API directly (rather than watching React Router's location) so it
// also catches the common case of repeated navigation to the SAME url, which
// never changes `location` and is otherwise invisible. On a burst it logs the
// offending urls and a stack trace pointing at the caller. Purely
// observational: it always delegates to the native history methods.
const WINDOW_MS = 2000
const THRESHOLD = 30
const REARM_MS = 5000

export default function NavigationLoopMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.history) return undefined

    const calls = []
    let reported = false
    const original = {
      push: window.history.pushState,
      replace: window.history.replaceState,
    }

    const record = (kind, url) => {
      const now = Date.now()
      calls.push({ kind, url: String(url), t: now })
      while (calls.length && now - calls[0].t > WINDOW_MS) calls.shift()
      if (calls.length >= THRESHOLD && !reported) {
        reported = true
        const recent = calls.slice(-12).map((c) => `${c.kind} → ${c.url}`)
        console.error(
          `[HECP] Navigation loop detected — ${calls.length} history updates in ${WINDOW_MS}ms.\n` +
            `Targets (newest last):\n  ${recent.join('\n  ')}\n\n` +
            `Caller stack (look for the component/guard below react-router internals):\n` +
            `${new Error('navigation-loop').stack}`,
        )
        setTimeout(() => {
          reported = false
        }, REARM_MS)
      }
    }

    window.history.pushState = function patchedPushState(...args) {
      record('push', args[2])
      return original.push.apply(this, args)
    }
    window.history.replaceState = function patchedReplaceState(...args) {
      record('replace', args[2])
      return original.replace.apply(this, args)
    }

    return () => {
      window.history.pushState = original.push
      window.history.replaceState = original.replace
    }
  }, [])

  return null
}
