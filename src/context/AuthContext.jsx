import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import {
  PERMISSIONS,
  ROLES,
  USER_STATUS,
  hasPermission as listHasPermission,
  permissionsForRole,
} from '../constants/roles'
import { clearSessionExpiredFlag, logActivity } from '../utils/session'

const AuthContext = createContext(null)

// Generates a short, human-friendly, ambiguity-free join code (e.g. "K7P-3QX").
function generateJoinCode() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let raw = ''
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  for (let i = 0; i < 6; i++) raw += alphabet[bytes[i] % alphabet.length]
  return `${raw.slice(0, 3)}-${raw.slice(3)}`
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [profile, setProfile] = useState(null) // Firestore users/{uid} doc
  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(true) // auth-state resolution only
  // True once Firebase has reported the auth state at least once. Unlike
  // `loading` (which re-toggles while the profile listener (re)subscribes),
  // this latches to true and never flips back — so route guards can rely on it
  // to avoid redirecting on a transient, mid-resolution state (which is what
  // lets pages like /pending and /login bounce off each other).
  const [authReady, setAuthReady] = useState(false)
  // 'loading' | 'ready' | 'missing' | 'error' — resolution of the profile doc.
  const [profileStatus, setProfileStatus] = useState('loading')
  const [profileError, setProfileError] = useState(null)

  // Track the authenticated firebase user.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u)
      setAuthReady(true)
      if (!u) {
        setProfile(null)
        setOrg(null)
        setProfileStatus('missing')
        setProfileError(null)
        setLoading(false)
      }
    })
    return unsub
  }, [])

  // Subscribe to the user's profile document in real time.
  useEffect(() => {
    if (!firebaseUser) return undefined
    setLoading(true)
    setProfileStatus('loading')
    setProfileError(null)

    // Watchdog: if the Firestore listen stream stalls (network/blocked), don't
    // hang on a spinner forever — resolve to an error state after 8s.
    const watchdog = setTimeout(() => {
      console.error(
        '[HECP] Profile load TIMED OUT after 8s — the Firestore listener never responded for users/' +
          firebaseUser.uid +
          '. Most common cause: the database is in DATASTORE mode (the web SDK needs NATIVE mode), the database does not exist in this project, or a network/adblock issue. Check Firebase Console → Firestore Database.',
      )
      setProfileError({ code: 'hecp/timeout' })
      setProfileStatus((s) => (s === 'loading' ? 'error' : s))
      setLoading(false)
    }, 8000)

    const ref = doc(db, 'users', firebaseUser.uid)
    const unsub = onSnapshot(
      ref,
      (snap) => {
        clearTimeout(watchdog)
        if (snap.exists()) {
          setProfile({ id: snap.id, ...snap.data() })
          setProfileStatus('ready')
        } else {
          setProfile(null)
          setProfileStatus('missing')
        }
        setLoading(false)
      },
      (err) => {
        clearTimeout(watchdog)
        console.error('[HECP] Profile read FAILED:', err?.code, err?.message)
        setProfile(null)
        setProfileError(err)
        setProfileStatus('error')
        setLoading(false)
      },
    )
    return () => {
      clearTimeout(watchdog)
      unsub()
    }
  }, [firebaseUser])

  // Subscribe to the org document once the profile resolves.
  useEffect(() => {
    if (!profile?.orgId) {
      setOrg(null)
      return undefined
    }
    const ref = doc(db, 'organizations', profile.orgId)
    const unsub = onSnapshot(ref, (snap) => {
      setOrg(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
    return unsub
  }, [profile?.orgId])

  // ----- Actions -------------------------------------------------------------

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
    // Pre-arm the loading state the moment sign-in succeeds. Without this there
    // is a brief window where context still holds `loading: false` / no user
    // (onAuthStateChanged hasn't fired yet), so a navigate('/app') would bounce
    // off ProtectedRoute back to /login and ping-pong until auth settles. Now
    // the guards show a loader during that window instead.
    setLoading(true)
    setProfileStatus('loading')
    // Fresh session: clear any stale "expired" flag and start the idle clock.
    clearSessionExpiredFlag()
    logActivity()
    return cred.user
  }

  async function logout() {
    try {
      await signOut(auth)
    } finally {
      // Hard-redirect to a clean login page. A full reload guarantees a fresh
      // mount on /login instead of a client-side, animated-route redirect that
      // can stall into a blank page on the way out, and it clears all
      // in-memory app state on sign-out.
      window.location.assign('/login')
    }
  }

  /** Send a password-reset email to the given address. */
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email.trim())
  }

  /** List all organizations (id + name) for the join dropdown. */
  async function listOrganizations() {
    const snap = await getDocs(collection(db, 'organizations'))
    return snap.docs
      .map((d) => ({ id: d.id, name: d.data().name || '(unnamed)' }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  /** Resolve an org by its join code. Returns the org doc or null. */
  async function findOrgByJoinCode(code) {
    const normalized = code.trim().toUpperCase()
    const q = query(
      collection(db, 'organizations'),
      where('joinCode', '==', normalized),
      limit(1),
    )
    const snap = await getDocs(q)
    if (snap.empty) return null
    const d = snap.docs[0]
    return { id: d.id, ...d.data() }
  }

  /**
   * Register a brand-new organization. The creator becomes the approved admin.
   * Uses a transaction to ensure the join code is unique at write time.
   */
  async function registerOrganization({ orgName, address, name, email, password }) {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
    const uid = cred.user.uid
    await updateProfile(cred.user, { displayName: name })

    const orgRef = doc(collection(db, 'organizations'))
    const userRef = doc(db, 'users', uid)

    // Try a few times in the (very unlikely) event of a join-code collision.
    let joinCode = generateJoinCode()
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await findOrgByJoinCode(joinCode)
      if (!existing) break
      joinCode = generateJoinCode()
    }

    await runTransaction(db, async (tx) => {
      tx.set(orgRef, {
        name: orgName.trim(),
        address: (address || '').trim(),
        joinCode,
        sites: [],
        createdBy: uid,
        createdAt: serverTimestamp(),
      })
      tx.set(userRef, {
        email: email.trim(),
        displayName: name.trim(),
        orgId: orgRef.id,
        role: ROLES.ADMIN,
        status: USER_STATUS.APPROVED,
        permissions: permissionsForRole(ROLES.ADMIN),
        createdAt: serverTimestamp(),
        approvedAt: serverTimestamp(),
        approvedBy: uid,
      })
    })

    return { orgId: orgRef.id, joinCode }
  }

  /**
   * Sign up a member into an existing org via join code. Created as pending,
   * with no role/permissions until an admin approves.
   */
  async function signupMember({ name, email, password, orgId }) {
    if (!orgId) {
      const err = new Error('Please select your organization.')
      err.code = 'hecp/no-org'
      throw err
    }
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
    const uid = cred.user.uid

    // Confirm the chosen org exists; clean up the auth account if not.
    let orgSnap
    try {
      orgSnap = await getDoc(doc(db, 'organizations', orgId))
    } catch (lookupErr) {
      await deleteUser(cred.user).catch(() => {})
      throw lookupErr
    }
    if (!orgSnap.exists()) {
      await deleteUser(cred.user).catch(() => {})
      const err = new Error('That organization no longer exists.')
      err.code = 'hecp/no-org'
      throw err
    }

    await updateProfile(cred.user, { displayName: name })

    await setDoc(doc(db, 'users', uid), {
      email: email.trim(),
      displayName: name.trim(),
      orgId,
      role: null,
      status: USER_STATUS.PENDING,
      permissions: [],
      createdAt: serverTimestamp(),
      approvedAt: null,
      approvedBy: null,
    })

    return { orgId, orgName: orgSnap.data().name }
  }

  // ----- Recovery for orphaned sessions --------------------------------------
  // An account can exist in Firebase Auth without its Firestore profile (e.g. a
  // sign-up whose profile write was blocked). These complete the setup for the
  // *currently signed-in* user WITHOUT creating a new auth account — so they
  // avoid the EMAIL_EXISTS error you'd hit by re-registering the same email.

  async function completeOrgRegistration({ orgName, address }) {
    const user = auth.currentUser
    if (!user) throw new Error('You are not signed in.')
    const uid = user.uid
    const name = user.displayName || user.email

    const orgRef = doc(collection(db, 'organizations'))
    const userRef = doc(db, 'users', uid)

    let joinCode = generateJoinCode()
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await findOrgByJoinCode(joinCode)
      if (!existing) break
      joinCode = generateJoinCode()
    }

    await runTransaction(db, async (tx) => {
      tx.set(orgRef, {
        name: orgName.trim(),
        address: (address || '').trim(),
        joinCode,
        sites: [],
        createdBy: uid,
        createdAt: serverTimestamp(),
      })
      tx.set(userRef, {
        email: user.email,
        displayName: name,
        orgId: orgRef.id,
        role: ROLES.ADMIN,
        status: USER_STATUS.APPROVED,
        permissions: permissionsForRole(ROLES.ADMIN),
        createdAt: serverTimestamp(),
        approvedAt: serverTimestamp(),
        approvedBy: uid,
      })
    })

    return { orgId: orgRef.id, joinCode }
  }

  async function completeJoin({ orgId }) {
    const user = auth.currentUser
    if (!user) throw new Error('You are not signed in.')
    if (!orgId) {
      const err = new Error('Please select your organization.')
      err.code = 'hecp/no-org'
      throw err
    }
    const orgSnap = await getDoc(doc(db, 'organizations', orgId))
    if (!orgSnap.exists()) {
      const err = new Error('That organization no longer exists.')
      err.code = 'hecp/no-org'
      throw err
    }
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName || user.email,
      orgId,
      role: null,
      status: USER_STATUS.PENDING,
      permissions: [],
      createdAt: serverTimestamp(),
      approvedAt: null,
      approvedBy: null,
    })
    return { orgId, orgName: orgSnap.data().name }
  }

  // ----- Derived helpers ------------------------------------------------------

  const can = (permission) => listHasPermission(profile?.permissions, permission)
  const isAdmin = profile?.role === ROLES.ADMIN
  const isApproved = profile?.status === USER_STATUS.APPROVED

  const value = useMemo(
    () => ({
      firebaseUser,
      profile,
      profileStatus,
      profileError,
      org,
      loading,
      authReady,
      isAdmin,
      isApproved,
      can,
      PERMISSIONS,
      login,
      logout,
      resetPassword,
      registerOrganization,
      signupMember,
      completeOrgRegistration,
      completeJoin,
      listOrganizations,
      findOrgByJoinCode,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [firebaseUser, profile, profileStatus, profileError, org, loading, authReady],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext
