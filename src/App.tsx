import Nav from './components/Nav'
import { AuthProvider, PocketBaseProvider } from './lib/pocketbase'
import { Component, lazy } from 'solid-js'
import { Route, Routes } from '@solidjs/router'

const Home = lazy(() => import('./views/Home'))
const About = lazy(() => import('./views/About'))
const Project = lazy(() => import('./views/Project'))
const NotFound = lazy(() => import('./views/NotFound'))

const App: Component = () => {
  return (
    <PocketBaseProvider url='https://pocketbase.devdom.pw'>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/project/:id' component={Project} />
          <Route path='*all' component={NotFound} />
        </Routes>
      </AuthProvider>
    </PocketBaseProvider>
  )
}

export default App
