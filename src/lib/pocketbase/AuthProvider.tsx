import { usePB } from './usePB'
import { createEffect, createSignal, JSX, onMount, createContext, Accessor } from 'solid-js'
import { Admin, Record } from 'pocketbase'

export const AuthContext = createContext<{
  user: Accessor<Record | Admin>
  avatarUrl: Accessor<string>
  error: Accessor<string>
  loginWithPassword: (email: string, password: string) => void
  logout: () => void
}>()

interface AuthProviderProps {
  children: JSX.Element
}

export const AuthProvider = (props: AuthProviderProps) => {
  const client = usePB()

  if (!client) {
    throw new Error('useAuth must be used within a <PocketBaseProvider>')
  }

  onMount(() => {
    const authData = sessionStorage.getItem('auth')
    client.authStore.loadFromCookie(authData)
  })

  createEffect(() => {
    client.authStore.onChange(token => {
      if (token) {
        setUser(client.authStore.model)
        setAvatarUrl(
          client.getFileUrl(client.authStore.model as Record, client.authStore.model.avatar),
        )
        sessionStorage.setItem('auth', client.authStore.exportToCookie())
      } else {
        setUser(null)
        sessionStorage.removeItem('auth')
      }
    })
  })

  const [user, setUser] = createSignal(client.authStore.model)
  const [avatarUrl, setAvatarUrl] = createSignal('')
  const [error, setError] = createSignal<string>(null)

  function loginWithPassword(email: string, password: string) {
    client
      .collection('users')
      .authWithPassword(email, password)
      .catch(err => {
        console.log('login error:', err.message)
        setError(err.message)
      })
  }

  function logout() {
    client.authStore.clear()
  }

  return (
    <AuthContext.Provider value={{ user, avatarUrl, error, loginWithPassword, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}
