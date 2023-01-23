import { useRecord } from '../lib/pocketbase'
import { ProjectChat } from '../components/ProjectChat'
import { useParams } from '@solidjs/router'
import { For, Show } from 'solid-js'

export default function Project() {
  const params = useParams()
  const { value: project, error } = useRecord('projects', params.id)

  return (
    <div class='flex gap-2 p-1'>
      <Show when={error()}>
        <div>{error().message}</div>
      </Show>
      <Show when={project()}>
        <div class='flex flex-col gap-2 rounded border border-black p-1'>
          <h1 class='text-xl'>Project: {project().title}</h1>
          <span>{project().description}</span>
          <h2>Members:</h2>
          <For each={project().members}>
            {member => (
              <div>
                <span>{member}</span>
              </div>
            )}
          </For>
        </div>
        <ProjectChat projectId={params.id} />
      </Show>
    </div>
  )
}
