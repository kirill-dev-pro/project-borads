import { useSupabase } from './SupabaseContext'
import type { AuthChangeEvent, AuthSession, SupabaseClient } from '@supabase/supabase-js'
import { createEffect, onCleanup } from 'solid-js'

type AuthChangeHandler = (event: AuthChangeEvent, session: AuthSession | null) => void

interface CreateOnAuthStateChangeOptions {
  autoDispose?: boolean
}

export function createOnAuthStateChange(
  authChangeHandler: AuthChangeHandler,
  options: CreateOnAuthStateChangeOptions = { autoDispose: true },
): void {
  const client = useSupabase()

  const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
    authChangeHandler(event, session)
  })

  createEffect(async () => {
    const { data } = await client.auth.getSession()
    if (data.session) authChangeHandler('SIGNED_IN', data.session)
  })

  onCleanup(() => {
    if (options.autoDispose) authListener.subscription.unsubscribe()
  })
}
