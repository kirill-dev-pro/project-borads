import Client from 'pocketbase'
import type { JSX } from 'solid-js'
import { createContext } from 'solid-js'

export const PocketBaseContext = createContext<Client>()

interface PocketBaseProviderProps {
  url: string
  children: JSX.Element
}

export const PocketBaseProvider = (props: PocketBaseProviderProps) => {
  const client = new Client(props.url)
  return <PocketBaseContext.Provider value={client}>{props.children}</PocketBaseContext.Provider>
}
