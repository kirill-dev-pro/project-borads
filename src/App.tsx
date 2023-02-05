import Nav from './components/Nav'
import { Component, lazy } from 'solid-js'
import { Route, Routes } from '@solidjs/router'
import { SupabaseProvider } from 'lib/supabase'

const Home = lazy(() => import('./views/Home'))
const About = lazy(() => import('./views/About'))
const Project = lazy(() => import('./views/Project'))
const NotFound = lazy(() => import('./views/NotFound'))

const App: Component = () => {
  return (
    <SupabaseProvider
      url='https://omngvqqzmwcoebcqehnm.supabase.co'
      key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbmd2cXF6bXdjb2ViY3FlaG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU0NjAwNDgsImV4cCI6MTk5MTAzNjA0OH0.y5ig087cieSIJX1CEu6AweiSSaEwYwL5FuugbH7pbas'
    >
      <Nav />
      <Routes>
        <Route path='/' component={Home} />
        <Route path='/about' component={About} />
        <Route path='/project/:id' component={Project} />
        <Route path='*all' component={NotFound} />
      </Routes>
    </SupabaseProvider>
  )
}

export default App
