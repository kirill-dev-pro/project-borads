import { useRecord } from '../lib/pocketbase'
import { ProjectChat } from '../components/ProjectChat'
import { ProjectUsers } from '../components/ProjectUsers'
import { ProjectFiles } from '../components/ProjectFiles'
import { useParams } from '@solidjs/router'
import { createEffect, Show } from 'solid-js'

export default function Project() {
  const { id: projectId } = useParams()

  const { value: project, error } = useRecord('projects', projectId, true, 'members, owner')

  createEffect(() => {
    console.log('Project', projectId, project())
  })

  return (
    <div class='flex flex-wrap gap-2 p-1'>
      <Show when={error()}>
        <div>{error().message}</div>
      </Show>
      <Show when={project()}>
        <div class='flex w-64 flex-col gap-2 rounded border border-black p-1'>
          <h2 class='text-xl'>Project:</h2>
          <span class='rounded bg-red-100 p-1'>{project().id}</span>
          <span class='underline'>{project().title}</span>
          <span>{project().description}</span>
          <span>
            Created:
            <br />
            {project().created}
          </span>
          <div class='flex gap-2'>
            <button
              class='rounded border border-black p-2 transition-all duration-100 
              hover:shadow active:scale-95'
            >
              Edit
            </button>
            <button
              class='rounded border border-black p-2 transition-all duration-100 
              hover:shadow active:scale-95'
            >
              Remove
            </button>
          </div>
        </div>
        <ProjectChat projectId={projectId} />
        <ProjectUsers project={project} />
        <ProjectFiles projectId={projectId} />
      </Show>
    </div>
  )
}
