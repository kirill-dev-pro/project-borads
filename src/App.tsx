import Nav from './components/Nav'
import { AppwriteProvider } from './lib/appwrite'
import { Component, lazy } from 'solid-js'
import { Route, Router, Routes } from '@solidjs/router'
import { AuthProvider } from 'lib/appwrite'

const Home = lazy(() => import('./views/Home'))
const About = lazy(() => import('./views/About'))
const Project = lazy(() => import('./views/Project'))
const NotFound = lazy(() => import('./views/NotFound'))
const Login = lazy(() => import('./views/Login'))

const App: Component = () => {
  return (
    <AppwriteProvider>
      <AuthProvider>
        <Router>
          <Nav />
          <Routes>
            <Route path='/' component={Home} />
            <Route path='/about' component={About} />
            <Route path='/login' component={Login} />
            <Route path='/project/:id' component={Project} />
            <Route path='*all' component={NotFound} />
          </Routes>
        </Router>
      </AuthProvider>
    </AppwriteProvider>
  )
}

export default App
