import { Account, Avatars, Client, Databases } from 'appwrite'
import { createContext, JSX, useContext } from 'solid-js'

export const AppwriteContext = createContext<{
  client: Client
  avatars: Avatars
  account: Account
  databases: Databases
}>()

interface AppwriteProviderProps {
  children: JSX.Element
}

export const AppwriteProvider = (props: AppwriteProviderProps) => {
  const client = new Client()
  client.setEndpoint('https://appwrite.strong.devdom.pw/v1').setProject('63cff5e4471da1bfae9e')
  const avatars = new Avatars(client)
  const account = new Account(client)
  const databases = new Databases(client)
  return (
    <AppwriteContext.Provider
      value={{
        client,
        avatars,
        account,
        databases,
      }}
    >
      {props.children}
    </AppwriteContext.Provider>
  )
}

export const useAppwrite = () => useContext(AppwriteContext)
