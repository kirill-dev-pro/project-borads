import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useContext, createContext } from 'solid-js'
import type { Component, JSX } from 'solid-js'

interface SupabaseContextValue {
  client: SupabaseClient
}

export const SupabaseContext = createContext<SupabaseContextValue>()

interface SupabaseContextProps {
  client?: SupabaseClient
  key?: string
  url?: string
  children?: JSX.Element
}

export const SupabaseProvider: Component<SupabaseContextProps> = props => {
  if (!props.client || (!props.key && !props.url)) {
    throw new Error('SupabaseProvider requires a client or a key and url as props')
  }
  if (!props.client && (!props.key || !props.url)) {
    throw new Error('SupabaseProvider requires either a key and url')
  }
  const client = props.client || createClient(props.url, props.key)
  // const auth = client.auth
  // const storage = client.storage
  // const from = client.from

  return <SupabaseContext.Provider value={{ client }}>{props.children}</SupabaseContext.Provider>
}

export const useSupabase = () => {
  const ctx = useContext(SupabaseContext)
  if (!ctx) throw new Error('useSupabase must be used within a SupabaseContext.Provider')
  return ctx
}
