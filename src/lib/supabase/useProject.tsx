import { useSupabase } from './SupabaseContext'
import { createEffect, createSignal } from 'solid-js'

export function useProject(id: string, realtime = true) {
  const [project, setProject] = createSignal(null)
  const { client } = useSupabase()

  createEffect(async () => {
    const { data, error } = await client.from('projects').select('*').eq('id', id).single()
    console.log('got data from query', data)
    if (error) throw error
    setProject(data)

    if (realtime) {
      const projectChannel = client
        .channel(`realtime:*`)
        .on('postgres_changes', {}, payload => {
          console.log('got data from subscribe', payload)
        })
        .on('presence', { event: 'sync' }, payload => {
          console.log('got data from subscribe', payload)
          setProject(payload.new)
        })
        .subscribe()
      return () => {
        projectChannel.unsubscribe()
      }
    }
  })

  return project
}
