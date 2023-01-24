import { useRecord } from './useRecord'
import {
  JSX,
  useContext,
  createContext,
  Show,
  Accessor,
  createEffect,
  createSignal,
} from 'solid-js'
import { Record } from 'pocketbase'

export const ProjectContext = createContext<{
  projectId: string
  project: Accessor<Record>
}>()

interface ProjectProviderProps {
  children: JSX.Element
  projectId: string
}

export const ProjectProvider = ({ children, projectId }: ProjectProviderProps) => {
  if (!projectId) throw new Error('ProjectProvider requires a projectId prop')
  const { value: asd, error } = useRecord('projects', projectId)
  const [project, setProject] = createSignal<Record>(null)

  createEffect(() => {
    if (asd) {
      setProject(asd)
    }
  })

  console.log('project', project)
  const value = {
    projectId,
    project,
  }
  createEffect(() => {
    console.log('ProjectProvider', projectId, project())
  })
  return (
    <ProjectContext.Provider value={value}>
      {/* <Show
        when={!error()}
        fallback={
          <div>
            <h1>Project not found</h1>
          </div>
        }
      >
        <Show when={project()} fallback={<h1>loading...</h1>}> */}
      {children}
      {/* </Show>
      </Show> */}
    </ProjectContext.Provider>
  )
}

export const useProject = () => useContext(ProjectContext)
