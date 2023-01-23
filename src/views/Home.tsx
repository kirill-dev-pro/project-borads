import Header from '../components/Header'
import { LoginForm } from '../components/LoginForm'
import { useAuth, usePB } from '../lib/pocketbase'
import { Component, createEffect, createSignal, For, Show } from 'solid-js'
import { Record } from 'pocketbase'

const Home: Component = () => {
  const { user, logout } = useAuth()
  const pb = usePB()
  const [projects, setProjects] = createSignal<Record[]>([])

  createEffect(() => {
    pb.collection('projects')
      .getList(1, 10, {
        filter: `owner.id = "${user().id}" || members.id = "${user().id}"`,
      })
      .then(res => {
        setProjects(res.items)
        console.log('res', res)
      })
      .catch(err => {
        console.error(err)
      })
  })

  const onClickCreateNew = () => {
    pb.collection('projects')
      .create({
        title: 'New project',
        description: 'New project description',
        owner: user().id,
      })
      .then(res => {
        console.log('res', res)
        setProjects([...projects(), res])
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <>
      <Header title='Home' />
      <main>
        <div class='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
          {/* Replace with your content */}

          <div>
            <h1>User Dashboard</h1>
            <p>Here you can see your profile and manage your workshops.</p>

            <Show when={user()} fallback={<LoginForm />}>
              <p>Logged in as {user().email}</p>
              <button onClick={logout} class='rounded border-2 border-black bg-white p-2'>
                Logout
              </button>
            </Show>
            <h1>Available projects</h1>
            <div class='flex gap-2'>
              <For each={projects()}>
                {project => (
                  <a href={'/project/' + project.id}>
                    <div class='rounded border-2 p-2 transition-all duration-100 hover:shadow active:scale-95'>
                      <h2 class='text-xl'>{project.title}</h2>
                      <pre>{project.id}</pre>
                      <p>{project.description}</p>
                    </div>
                  </a>
                )}
              </For>
              <div
                class='rounded border-2 p-2 transition-all duration-100 hover:shadow active:scale-95'
                onClick={onClickCreateNew}
              >
                <h2 class='text-xl'>+</h2>
                <p>Create new</p>
              </div>
            </div>
          </div>
          {/* /End replace */}
        </div>
      </main>
    </>
  )
}

export default Home
