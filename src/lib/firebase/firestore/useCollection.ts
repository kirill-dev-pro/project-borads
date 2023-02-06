import { useFirestore } from './useFirestore'
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  QueryConstraint,
  addDoc,
  updateDoc,
  doc,
  AddPrefixToKeys,
  deleteDoc,
} from 'firebase/firestore'
import { createEffect, createSignal } from 'solid-js'

export function useCollection<T = Record<string, any>>(
  path: string,
  q?: QueryConstraint[],
  realtime = true,
) {
  const firestore = useFirestore()
  const collectionRef = collection(firestore, path)
  const queryRef = query(collectionRef, ...q)
  const [documents, setDocuments] = createSignal<T[]>([])
  const [error, setError] = createSignal<Error | null>(null)

  createEffect(() => {
    if (!realtime) {
      getDocs(queryRef).then(snapshot => {
        const docs = snapshot.docs.map(doc => doc.data()) as T[]
        setDocuments(docs)
      })
      return
    }
    onSnapshot(
      queryRef,
      snapshot => {
        const docs = snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id })) as T[]
        setDocuments(docs)
      },
      error => {
        setError(error)
      },
    )
  })

  function addDocument(data: T) {
    return addDoc(collectionRef, data)
  }

  function updateDocument(id: string, data: Partial<T> & AddPrefixToKeys<string, any>) {
    const docRef = doc(collectionRef, id)
    return updateDoc(docRef, data)
  }

  function removeDocument(id) {
    return deleteDoc(doc(collectionRef, id))
  }

  return { documents, error, addDocument, updateDocument, removeDocument }
}
