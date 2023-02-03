import { useAppwrite } from './AppwriteContext'
import type { Models, RealtimeResponseEvent } from 'appwrite'
import { createEffect, createSignal, onCleanup } from 'solid-js'

export function useDocument<T extends Models.Document>(
  databaseId: string,
  collection: string,
  documentId: string,
  realtime = true,
) {
  const { databases, client } = useAppwrite()
  const [document, setDocument] = createSignal<Models.Document | null | undefined>()

  createEffect(() => {
    if (documentId === undefined) return
    if (documentId !== null) {
      databases.getDocument(databaseId, collection, documentId).then(setDocument)
      // .catch(() => setDocument(null))
    } else {
      setDocument(null)
    }
    if (realtime) {
      const unsubscribe = client.subscribe(
        `databases.${databaseId}.collections.${collection}.documents.${documentId}`,
        (data: RealtimeResponseEvent<T>) => {
          console.log('document subscriber:', data)
          setDocument(() => data.payload)
        },
      )

      onCleanup(() => {
        unsubscribe()
      })
    }
  })

  return document
}
