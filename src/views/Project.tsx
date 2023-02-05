import { useParams } from '@solidjs/router'
import { useSupabase } from 'lib/supabase'
import { useProject } from 'lib/supabase/useProject'
import { createEffect, Show } from 'solid-js'

export default function Project() {
  const { id: projectId } = useParams()

  const supabase = useSupabase()
  const project = useProject(projectId)
  // const appwrite = useAppwrite()
  // const { value: project, error } = useRecord('projects', projectId, true, 'members, owner')
  // const project = useDocument('63cff7158acef9bab932', '63cffb35c7f043d1d3fa', projectId)

  createEffect(() => {
    if (project()) {
      console.log('project', project())
    }
  })

  createEffect(() => {
    console.log('Project', projectId, project())
  })

  // const weavy = new WeavyClient({
  //   url: 'https://project-board.weavy.io',
  //   tokenFactory: async refresh => 'wyu_uISUMjouV97AiPavU8GEh3QCVtVC1p43urRM',
  // })

  // const messenger = weavy.app({
  //   uid: 'messenger-demo',
  //   type: 'messenger',
  //   container: '#messenger',
  // })

  // let textarea

  // createEffect(() => {
  //   if (project()) {
  //     const onMessage = (...args) => {
  //       console.log('message', args)
  //     }
  //     weavy.subscribe('/', 'message', onMessage)
  //     console.log('subscribed')
  //     return () => weavy.unsubscribe('/', 'message', onMessage)
  //   }
  // })

  return (
    <div class='flex flex-wrap gap-2 p-1'>
      <div class='flex w-64 flex-col gap-2 rounded border border-black p-1'>
        <script>
          {`const weavy = new Weavy({
            url: "https://project-board.weavy.io",
            tokenFactory: async (refresh) => "wyu_uISUMjouV97AiPavU8GEh3QCVtVC1p43urRM"
          });

          const messenger = weavy.app({
            uid: "messenger-demo",
            type: "messenger",    
            container: "#messenger"
          });`}
        </script>

        <div id='messenger' class='h-64 rounded border border-black' />
      </div>
      {/* <Show when={error()}>
        <div>{error().message}</div>
      </Show> */}
      <Show when={project()} fallback='Loading...'>
        <div class='flex w-64 flex-col gap-2 rounded border border-black p-1'>
          <h2 class='text-xl'>Project:</h2>
          <span class='rounded bg-red-100 p-1'>{project().$id}</span>
          <span class='underline'>{project().title}</span>
          <span>{project().description}</span>
          <span>
            Created:
            <br />
            {new Date(project().$createdAt).toLocaleString('ru-RU')}
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
        {/* <ProjectChat projectId={projectId} /> */}
        {/* <ProjectUsers project={project} /> */}
        {/* <ProjectFiles projectId={projectId} /> */}
      </Show>
    </div>
  )
}
