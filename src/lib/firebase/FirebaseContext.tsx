import { FirebaseOptions, FirebaseApp, initializeApp } from 'firebase/app'
import { useContext, createContext } from 'solid-js'
import type { Component, JSX } from 'solid-js'
import { Auth, getAuth } from 'firebase/auth'
import { Database, getDatabase } from 'firebase/database'
import { Firestore, getFirestore } from 'firebase/firestore'

interface FirebaseContextValue {
  app: FirebaseApp
  auth: Auth
  db: Database
  firestore: Firestore
}

export const FirebaseContext = createContext<FirebaseContextValue>()

interface FirebaseContextProps {
  app?: FirebaseApp
  configuration?: FirebaseOptions
  children?: JSX.Element
}

export const FirebaseProvider: Component<FirebaseContextProps> = props => {
  if (!props.app && !props.configuration) {
    throw new Error('FirebaseProvider requires a firebase application or a configuration as props')
  }
  const app = props.app || initializeApp(props.configuration)
  const auth = getAuth(app)
  const db = getDatabase(app)
  const firestore = getFirestore(app)

  return (
    <FirebaseContext.Provider
      value={{
        app,
        auth,
        db,
        firestore,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  )
}

export const useFirebaseApp = () => {
  const { app } = useContext(FirebaseContext)
  if (!app) throw new Error('useFirebase must be used within a FirebaseContext.Provider')
  return app
}

export const useFirebase = () => {
  const ctx = useContext(FirebaseContext)
  if (!ctx) throw new Error('useFirebase must be used within a FirebaseContext.Provider')
  return ctx
}
