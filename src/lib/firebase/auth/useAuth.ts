import { useFirebaseApp } from '../FirebaseContext'
import { createEffect, createSignal } from 'solid-js'
import type { Accessor, Setter } from 'solid-js'
import {
  signInWithEmailAndPassword,
  User,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
} from 'firebase/auth'

export interface UseFirebaseAuthReturn {
  user: Accessor<User | null>
  error: Accessor<Error | null>
  loading: Accessor<boolean>
  setUser: Setter<User | null>
  loginAsGuest: () => void
  loginWithEmail: (email: string, password: string) => void
  loginWithGoogle: () => void
  logout: () => void
}

/**
 * Reactive Firebase Auth binding
 */
export function useAuth(): UseFirebaseAuthReturn {
  const app = useFirebaseApp()
  const auth = getAuth(app)
  const [user, setUser] = createSignal<User | null | undefined>(undefined)
  const [error, setError] = createSignal<Error | null>(null)
  const [loading, setLoading] = createSignal(true)

  auth.onIdTokenChanged(
    authUser => {
      setUser(authUser)
      setLoading(false)
    },
    error => {
      setError(error)
      setLoading(false)
    },
  )

  // createEffect(() => console.log('current user', user()))

  function loginAsGuest() {
    setLoading(true)
    setError(null)
    signInAnonymously(auth)
      .catch(error => setError(error))
      .finally(() => setLoading(false))
  }

  async function loginWithEmail(email: string, password: string) {
    try {
      setError(null)
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  function loginWithGoogle() {
    setLoading(true)
    setError(null)
    signInWithPopup(auth, new GoogleAuthProvider())
      .catch(error => setError(error))
      .finally(() => setLoading(false))
  }

  function logout() {
    auth.signOut()
  }

  return {
    user,
    error,
    loading,
    setUser,
    loginWithEmail,
    loginWithGoogle,
    logout,
    loginAsGuest,
  }
}
