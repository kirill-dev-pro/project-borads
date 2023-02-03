import { useAppwrite } from './AppwriteContext'
import type { Models } from 'appwrite'
import { createEffect, createSignal, onCleanup } from 'solid-js'

export function useCollection(databaseId: string, collectionId: string, realtime = true) {
  const { databases, client } = useAppwrite()
  const [documents, setDocuments] = createSignal<Models.Document[]>([])

  createEffect(() => {
    if (!collectionId) return
    databases.listDocuments(databaseId, collectionId).then(docs => {
      setDocuments(docs.documents)
    })
    // .catch(() => setDocument(null))
    if (realtime) {
      const unsubscribe = client.subscribe(
        `databases.${databaseId}.collections.${collectionId}.documents`,
        data => {
          // console.log('document subscriber:', data)
          const changedDocument = data.payload as Models.Document
          setDocuments(prev => {
            if (!prev) return [changedDocument]
            const index = prev.findIndex(doc => doc.$id === changedDocument.$id)
            if (index === -1) {
              return [...prev, changedDocument]
            } else {
              return [...prev.slice(0, index), changedDocument, ...prev.slice(index + 1)]
            }
          })
        },
      )

      onCleanup(() => {
        unsubscribe()
      })
    }
  })

  return documents
}
