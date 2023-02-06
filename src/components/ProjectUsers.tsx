import { Project } from '../lib/types'
import { useCollection, useDocument } from '../lib/firebase'
import { Accessor, createEffect, For, Show } from 'solid-js'
import { where } from 'firebase/firestore'

interface User {
  id: string
  uid: string
  name: string
  email: string
  createdAt: string
}

export function ProjectUsers({
  project,
  updateProject,
}: {
  project: Accessor<Project>
  updateProject: (project: Partial<Project>) => void
}) {
  const { document: owner } = useDocument<User>('users/' + project().owner, false)
  const { documents: members } = useCollection<User>('users', [
    where('uid', 'in', project().members),
  ])

  createEffect(() => {
    console.log('members', members())
  })

  function onClickAdd() {
    const userId = prompt('Enter user id')
    if (userId) {
      updateProject({ members: [...project().members, userId] })
    }
  }

  return (
    <div class='flex w-64 flex-col gap-2 overflow-auto rounded border border-black p-1'>
      <h2 class='text-xl'>Members:</h2>
      <div class='flex flex-col'>
        <span>Owner:</span>
        <pre>
          <span class='bg-green-100 p-1 text-xs'>{project().owner}</span>
        </pre>
        <Show when={!!owner()} fallback='loading....'>
          <span>{owner().name}</span>
          <span>{owner().email}</span>
          <span>{owner().createdAt}</span>
        </Show>
      </div>
      <div>
        <p>Members:</p>
        <Show when={members()}>
          <For each={members()}>
            {user => {
              return (
                <pre>
                  <span class='bg-green-100 p-1 text-xs'>{user.uid}</span>
                  <span>{user.name}</span>
                </pre>
              )
            }}
          </For>
        </Show>
      </div>
      <button
        class='rounded border border-black p-2 transition-all duration-100 
              hover:shadow active:scale-95'
        onClick={onClickAdd}
      >
        Add user
      </button>
    </div>
  )
}
