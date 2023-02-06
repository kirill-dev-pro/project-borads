import Nav from './components/Nav'
import { FirebaseProvider } from './lib/firebase'
import { AuthProvider } from './lib/firebase/auth/AuthContext'
import { Component, lazy } from 'solid-js'
import { Route, Routes } from '@solidjs/router'

const Home = lazy(() => import('./views/Home'))
const Login = lazy(() => import('./views/Login'))
const About = lazy(() => import('./views/About'))
const Project = lazy(() => import('./views/Project'))
const NotFound = lazy(() => import('./views/NotFound'))

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)

const App: Component = () => {
  return (
    <FirebaseProvider configuration={firebaseConfig}>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path='/login' component={Login} />
          <Route path='/project/:id' component={Project} />
          <Route path='/about' component={About} />
          <Route path='*all' component={NotFound} />
          <Route path='/' component={Home} />
        </Routes>
      </AuthProvider>
    </FirebaseProvider>
  )
}

export default App
