import { PocketBaseContext } from './PocketbaseProvider'
import { useContext } from 'solid-js'
import type Client from 'pocketbase'

export const usePB = () => {
  return useContext<Client>(PocketBaseContext)
}
