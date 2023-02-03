import { useAppwrite } from '.'
import {
  createSignal,
  JSX,
  createContext,
  Accessor,
  useContext,
  createEffect,
  onMount,
} from 'solid-js'
import type { Models } from 'appwrite'

export const AuthContext = createContext<{
  user: Accessor<Models.Account<Models.Preferences> | null | undefined>
  session: Accessor<Models.Session | null | undefined>
  error: Accessor<string>
  loginWithPassword: (email: string, password: string) => void
  logout: () => void
  continueAsGuest: () => void
  getGoogleAuthLink: (success: string, failure: string, scopes?: string[]) => URL | void
}>()

interface AuthProviderProps {
  children: JSX.Element
}

export const AuthProvider = (props: AuthProviderProps) => {
  const { account } = useAppwrite()

  const [user, setUser] = createSignal<Models.Account<Models.Preferences> | null | undefined>()
  const [session, setSession] = createSignal<Models.Session | null | undefined>()
  const [error, setError] = createSignal<string>(null)

  onMount(async () => {
    account
      .getSession('current')
      .then(setSession)
      .catch(() => setSession(null))
  })

  createEffect(() => {
    if (session() === undefined) return
    if (session() !== null) {
      account
        .get()
        .then(setUser)
        .catch(() => setUser(null))
    } else {
      setUser(null)
    }
  })

  function loginWithPassword(email: string, password: string) {
    account
      .createEmailSession(email, password)
      .then(setSession)
      .catch(err => setError(String(err)))
  }

  function continueAsGuest() {
    account
      .createAnonymousSession()
      .then(setSession)
      .catch(err => setError(String(err)))
  }

  function getGoogleAuthLink(success: string, failure: string, scopes: string[] = []) {
    return account.createOAuth2Session('google', success, failure, scopes)
  }

  function logout() {
    account
      .deleteSessions()
      .then(() => setSession(null))
      .catch(setError)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        error,
        loginWithPassword,
        continueAsGuest,
        logout,
        getGoogleAuthLink,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = ({ redirect } = { redirect: false }) => {
  const { user } = useContext(AuthContext)
  createEffect(() => {
    if (!redirect || user() === undefined) return
    if (window.location.pathname === '/login') {
      if (user()) {
        window.location.pathname = '/'
      }
    } else {
      if (user() === null) {
        window.location.pathname = '/login'
      }
    }
  })
  return useContext(AuthContext)
}
