import { useSupabase } from './SupabaseContext'
import { SupabaseEventTypes, SupabaseRealtimePayload } from '@supabase/supabase-js'
import { createEffect } from 'solid-js'

export type UseSubscriptionConfig = {
  event?: SupabaseEventTypes
  table?: string
}

export function useSubscription<Data = any>(
  callback: (payload: SupabaseRealtimePayload<Data>) => void,
  config: UseSubscriptionConfig = { event: '*', table: '*' },
) {
  const { client } = useSupabase()

  createEffect(() => {
    const subscription = client
      .from<Data, any>(config.table ?? '*')
      .on(config.event ?? '*', callback)
      .subscribe()
    return () => {
      subscription.unsubscribe()
    }
  })
}
