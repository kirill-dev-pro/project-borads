import { useFirebaseApp } from '../FirebaseContext'
import { getFirestore } from 'firebase/firestore'

export function useFirestore() {
  const app = useFirebaseApp()
  const firestore = getFirestore(app)
  return firestore
}
