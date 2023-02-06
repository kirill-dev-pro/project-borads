import { ProjectChat } from '../components/ProjectChat'
import { ProjectUsers } from '../components/ProjectUsers'
import { ProjectFiles } from '../components/ProjectFiles'
import { useDocument } from '../lib/firebase'
import type { Project } from '../lib/types'
import { useParams } from '@solidjs/router'
import { Show } from 'solid-js'

export default function ProjectPage() {
  const { id: projectId } = useParams()

  const {
    document: project,
    error,
    loading,
    removeDocument,
    updateDocument,
  } = useDocument<Project>('projects/' + projectId)

  function onClickEdit() {
    const title = window.prompt('New title', project().title)
    updateDocument({ title })
  }

  function onClickRemove() {
    if (window.confirm('Are you sure?')) {
      removeDocument().then(() => {
        window.location.href = '/'
      })
    }
  }

  return (
    <div class='flex flex-wrap gap-2 p-1'>
      <Show when={error()}>
        <div>{error().message}</div>
      </Show>
      <Show when={loading()}>
        <div class='flex w-full justify-center'>
          <div class='flex flex-col gap-2'>Loading...</div>
        </div>
      </Show>
      <Show when={project() === null}>
        <div class='flex w-full justify-center'>
          <div class='flex flex-col gap-2'>
            Project not found ☹️
            <a
              href='/'
              class='rounded border border-black p-2 text-center transition-all 
              duration-100 hover:shadow active:scale-95'
            >
              To main page
            </a>
          </div>
        </div>
      </Show>
      <Show when={project()}>
        <div class='flex w-64 flex-col gap-2 rounded border border-black p-1'>
          <h2 class='text-xl'>Project:</h2>
          <pre>
            <span class='rounded bg-red-100 p-1 text-xs'>{project().id}</span>
          </pre>
          <span class='underline'>{project().title}</span>
          <span>{project().description}</span>
          <span>
            Created:
            <br />
            {new Date(project().created.seconds * 1000).toLocaleString('ru')}
          </span>
          <div class='flex gap-2'>
            <button
              class='rounded border border-black p-2 transition-all duration-100 
              hover:shadow active:scale-95'
              onClick={onClickEdit}
            >
              Edit
            </button>
            <button
              class='rounded border border-black p-2 transition-all duration-100 
              hover:shadow active:scale-95'
              onClick={onClickRemove}
            >
              Remove
            </button>
          </div>
        </div>
        <ProjectChat projectId={projectId} />
        <ProjectUsers project={project} updateProject={updateDocument} />
        <ProjectFiles projectId={projectId} />
      </Show>
    </div>
  )
}
