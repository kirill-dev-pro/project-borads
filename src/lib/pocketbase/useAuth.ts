import { AuthContext } from './AuthProvider'
import { useContext } from 'solid-js'

export const useAuth = () => {
  const { user, error, loginWithPassword, logout } = useContext(AuthContext)
  return { user, error, loginWithPassword, logout }
}
