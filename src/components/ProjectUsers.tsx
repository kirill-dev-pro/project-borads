import { Record } from 'pocketbase'
import { Accessor, For } from 'solid-js'

export function ProjectUsers({ project }: { project: Accessor<Record> }) {
  return (
    <div class='flex w-64 flex-col gap-2 rounded border border-black p-1'>
      <h2 class='text-xl'>Members:</h2>
      <div>
        <span>{project().owner}</span>
        <pre>{JSON.stringify((project().expand.owner as Record).name)}</pre>
        {/* <Show when={project().expand}></Show> */}
      </div>
      <For each={project().members}>
        {id => {
          const user = project().expand.members.find(user => user.id === id)
          return (
            <div>
              <span>{id}</span>
              <pre>{JSON.stringify(user.name)}</pre>
              {/* <Show when={project().expand}></Show> */}
            </div>
          )
        }}
      </For>
    </div>
  )
}
