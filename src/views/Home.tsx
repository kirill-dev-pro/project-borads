import Header from '../components/Header'
import { useAuth, useCollection } from '../lib/firebase'
import { Component, createEffect, For, Show } from 'solid-js'
import { serverTimestamp, where } from 'firebase/firestore'

const Home: Component = () => {
  const { user, logout } = useAuth()

  const { documents: projects, addDocument } = useCollection('projects', [
    // where('members', 'array-contains', loading() ? '' : user().uid),
    where('owner', '==', user().uid),
  ])

  const onClickCreateNew = () => {
    addDocument({
      title: 'New project',
      description: 'New project description',
      created: serverTimestamp(),
      owner: user().uid,
      members: [user().uid],
    })
    // .then(res => {
    //   console.log('res', res)
    // })
  }

  createEffect(() => {
    console.log('projects', projects())
  })

  return (
    <>
      <Header title='Home' />
      <main>
        <div class='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
          {/* Replace with your content */}

          <div>
            <h1>User Dashboard</h1>
            <p>Here you can see your profile and manage your workshops.</p>

            <Show when={user()} fallback='No user found'>
              <p>
                Logged in as <span class='rounded bg-green-200 p-1'>{user().uid}</span>
              </p>
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
