import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Helpful guard during local setup: surface a clear message if env is missing.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
)

const app = initializeApp(firebaseConfig)

// App Check (reCAPTCHA v3) — abuse protection for Firestore/Auth. Enabled only
// when a site key is provided so local dev and CI never break. To turn it on:
// register the site in Firebase console → App Check, then set
// VITE_FIREBASE_RECAPTCHA_KEY (and enforce App Check on Firestore/Auth).
const recaptchaKey = import.meta.env.VITE_FIREBASE_RECAPTCHA_KEY
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
export const firestoreDbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DB || ''

export const auth = getAuth(app)
export const db = firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app)
export default app
