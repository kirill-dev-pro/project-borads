import { useFirestore } from './useFirestore'
import { onSnapshot, updateDoc, doc, AddPrefixToKeys, deleteDoc, getDoc } from 'firebase/firestore'
import { createEffect, createSignal } from 'solid-js'

export function useDocument<T = Record<string, any>>(path: string, realtime = true) {
  const firestore = useFirestore()
  const docRef = doc(firestore, path)
  const [document, setDocument] = createSignal<T | null>()
  const [error, setError] = createSignal<Error | null>(null)
  const [loading, setLoading] = createSignal(true)

  createEffect(() => {
    if (!realtime) {
      getDoc(docRef).then(snapshot => {
        const doc = snapshot.data() as T
        setDocument(prev => doc)
        setLoading(false)
      })
      return
    }
    onSnapshot(
      docRef,
      snapshot => {
        setLoading(false)
        if (!snapshot.exists()) return setDocument(null)
        const doc = Object.assign(snapshot.data(), { id: snapshot.id }) as T
        setDocument(prev => doc)
      },
      error => {
        setError(error)
      },
    )
  })

  function updateDocument(data: Partial<T> & AddPrefixToKeys<string, any>) {
    return updateDoc(docRef, data)
  }

  function removeDocument() {
    return deleteDoc(docRef)
  }

  return { document, error, loading, updateDocument, removeDocument }
}
