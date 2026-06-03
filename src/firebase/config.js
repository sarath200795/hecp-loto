import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { browserSessionPersistence, getAuth, setPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Defensive: env values can pick up an invisible BOM / zero-width character or
// stray whitespace (e.g. when set via some CLIs). A BOM on projectId makes
// Firestore hit `projects/%EF%BB%BFhecp-...` -> 503 on every call, and a BOM on
// the apiKey breaks Auth. Strip those before constructing the config.
// Chars: BOM (FEFF), ZWSP (200B), ZWNJ (200C), ZWJ (200D), word-joiner (2060).
const ZERO_WIDTH = /\uFEFF|\u200B|\u200C|\u200D|\u2060/g
const cleanEnv = (v) => (v == null ? v : String(v).replace(ZERO_WIDTH, '').trim())

const firebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID),
}

// Helpful guard during local setup: surface a clear message if env is missing.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

const app = initializeApp(firebaseConfig)

// App Check (reCAPTCHA v3) — abuse protection for Firestore/Auth. Enabled only
// when a site key is provided so local dev and CI never break. To turn it on:
// register the site in Firebase console → App Check, then set
// VITE_FIREBASE_RECAPTCHA_KEY (and enforce App Check on Firestore/Auth).
const recaptchaKey = cleanEnv(import.meta.env.VITE_FIREBASE_RECAPTCHA_KEY)
if (recaptchaKey) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaKey),
      isTokenAutoRefreshEnabled: true,
    })
  } catch {
    // Non-fatal: App Check init failures must not block the app from loading.
  }
}

// The Firebase web SDK connects to the database literally named "(default)".
// If you use a NAMED Firestore database, set VITE_FIREBASE_FIRESTORE_DB to its
// Database ID and the SDK will target it instead.
export const firestoreDbId = cleanEnv(import.meta.env.VITE_FIREBASE_FIRESTORE_DB) || ''

export const auth = getAuth(app)
// Session persistence: the login ends when the browser/tab is closed (does not
// survive a restart). Combined with the in-app idle timeout, this keeps shared
// industrial workstations from staying signed in. Non-fatal if it can't be set.
setPersistence(auth, browserSessionPersistence).catch(() => {})

export const db = firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app)
export default app
