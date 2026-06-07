// Vercel Serverless Function — AI fallback for the HECP Safety Bot ("Sam").
// The API key stays server-side (set GEMINI_API_KEY in Vercel env, NOT a VITE_*
// var, so it is never shipped to the browser). The client posts a question + a
// compact, data-only snapshot of the org's LOTO figures; we ask the LLM to
// answer briefly using ONLY that data. If no key is configured or the upstream
// fails, we return a non-200 so the client cleanly falls back to its rules.
//
// Default provider: Google Gemini (free tier). To use OpenAI instead, set
// OPENAI_API_KEY and swap the call in `askOpenAI` below (template provided).

const GEMINI_MODEL = 'gemini-1.5-flash'

function systemPrompt(context) {
  return [
    'You are Sam, a friendly workplace-safety assistant inside HECP — a Hazardous',
    'Energy Control Procedures (Lockout/Tagout, LOTO) app. Answer the user briefly',
    'and concretely (2–5 sentences, plain text, no markdown headings).',
    "Use ONLY the JSON data provided below — it is the live state of the user's",
    'organization (procedures, isolation points, lock status, sites, technicians,',
    'lock inventory, recent activity). If the answer is not in the data, say so',
    'plainly and suggest what they could record or check. Never invent numbers,',
    'names, or facts.',
    'LOTO terms: a procedure is "Approved" before it can be performed; equipment is',
    '"Unlocked", "Partially locked" (some isolation points locked), or "Equipment',
    'locked" (all points locked); a "group lock" adds extra technicians; multi-point',
    'equipment must use Department locks (one unique lock per point).',
    'If the question is general LOTO / energy-control / safety guidance (not about the',
    "user's specific data), give a brief, practical, correct answer AND cite OSHA",
    '29 CFR 1910.147 with the URL',
    'https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147.',
    'This tool assists with documentation; it does not verify physical isolation —',
    'remind the user to verify a zero-energy state when relevant.',
    '',
    'DATA (JSON):',
    JSON.stringify(context || {}),
  ].join('\n')
}

async function askGemini(key, question, context) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`
  const body = {
    system_instruction: { parts: [{ text: systemPrompt(context) }] },
    contents: [{ role: 'user', parts: [{ text: question }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
  }
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`gemini ${r.status}`)
  const d = await r.json()
  const text = d?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim()
  if (!text) throw new Error('gemini empty')
  return text
}

// Optional OpenAI alternative — uncomment + set OPENAI_API_KEY to use:
// async function askOpenAI(key, question, context) {
//   const r = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
//     body: JSON.stringify({
//       model: 'gpt-4o-mini',
//       temperature: 0.3,
//       max_tokens: 400,
//       messages: [
//         { role: 'system', content: systemPrompt(context) },
//         { role: 'user', content: question },
//       ],
//     }),
//   })
//   if (!r.ok) throw new Error(`openai ${r.status}`)
//   const d = await r.json()
//   const text = d?.choices?.[0]?.message?.content?.trim()
//   if (!text) throw new Error('openai empty')
//   return text
// }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }
  const geminiKey = process.env.GEMINI_API_KEY
  // const openaiKey = process.env.OPENAI_API_KEY
  if (!geminiKey /* && !openaiKey */) {
    res.status(501).json({ error: 'unconfigured' })
    return
  }

  try {
    // Vercel parses JSON bodies automatically; guard for string bodies too.
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const question = String(payload.question || '').slice(0, 1000).trim()
    const context = payload.context || {}
    if (!question) {
      res.status(400).json({ error: 'no_question' })
      return
    }
    const answer = await askGemini(geminiKey, question, context)
    res.status(200).json({ answer })
  } catch (err) {
    res.status(502).json({ error: 'upstream_failed', detail: String(err?.message || err) })
  }
}
