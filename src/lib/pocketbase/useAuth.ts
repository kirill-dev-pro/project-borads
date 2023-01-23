import { AuthContext } from './AuthProvider'
import { useContext } from 'solid-js'

export const useAuth = () => {
  return useContext(AuthContext)
}
