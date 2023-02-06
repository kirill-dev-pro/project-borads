import { useFirebaseApp } from '../FirebaseContext'
import { createContext, createEffect, createSignal, Match, Switch, useContext } from 'solid-js'
import type { Accessor, Setter } from 'solid-js'
import {
  signInWithEmailAndPassword,
  User,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  Auth,
} from 'firebase/auth'
import { useLocation } from '@solidjs/router'

interface AuthProviderValue {
  auth: Auth
  user: Accessor<User | null>
  error: Accessor<Error | null>
  loading: Accessor<boolean>
  setUser: Setter<User | null>
  loginAsGuest: () => void
  loginWithEmail: (email: string, password: string) => void
  loginWithGoogle: () => void
  logout: () => void
}

const AuthContext = createContext<AuthProviderValue>()

export function AuthProvider(props) {
  const app = useFirebaseApp()
  const auth = getAuth(app)
  const [user, setUser] = createSignal<User | null | undefined>(undefined)
  const [error, setError] = createSignal<Error | null>(null)
  const [loading, setLoading] = createSignal(true)

  const { pathname } = useLocation()

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

  const value: AuthProviderValue = {
    auth,
    user,
    error,
    loading,
    setUser,
    loginWithEmail,
    loginWithGoogle,
    logout,
    loginAsGuest,
  }

  createEffect(() => {
    if (!loading() && user() && pathname === '/login') window.location.href = '/'
    if (!loading() && !user() && pathname !== '/login') window.location.href = '/login'
  })

  return (
    <AuthContext.Provider value={value}>
      <Switch fallback='Loading...'>
        <Match when={pathname === '/login'}>{props.children}</Match>
        <Match when={user()}>{props.children}</Match>
      </Switch>
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return value
}

export const useFirebaseAuth = () => {
  const { auth } = useContext(AuthContext)
  return auth
}
