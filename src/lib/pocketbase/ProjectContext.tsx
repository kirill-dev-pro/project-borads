import { useRecord } from './useRecord'
import { JSX, useContext, createContext, Accessor } from 'solid-js'
import { Record } from 'pocketbase'

export const ProjectContext = createContext<{
  projectId: string
  project: Accessor<Record>
  error: Accessor<Error>
}>()

interface ProjectProviderProps {
  children: JSX.Element
  projectId: string
}

export const ProjectProvider = ({ children, projectId }: ProjectProviderProps) => {
  if (!projectId) throw new Error('ProjectProvider requires a projectId prop')
  const { value: project, error } = useRecord('projects', projectId)

  return (
    <ProjectContext.Provider
      value={{
        projectId,
        project,
        error,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => useContext(ProjectContext)
