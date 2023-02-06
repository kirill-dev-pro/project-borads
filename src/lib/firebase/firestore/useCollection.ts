import { useFirestore } from './useFirestore'
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
  addDoc,
  updateDoc,
  doc,
  AddPrefixToKeys,
  deleteDoc,
  FieldValue,
} from 'firebase/firestore'
import { createEffect, createSignal } from 'solid-js'

export function useCollection<T extends { id: string }>(
  path: string,
  q: QueryConstraint[] = [],
  realtime = true,
) {
  const firestore = useFirestore()
  const collectionRef = collection(firestore, path)
  const queryRef = query(collectionRef, ...q)
  const [documents, setDocuments] = createSignal<T[]>([])
  const [error, setError] = createSignal<Error | null>(null)
  const [loading, setLoading] = createSignal(true)

  createEffect(() => {
    const unsubscribe = onSnapshot(
      queryRef,
      snapshot => {
        if (loading()) {
          const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as T[]
          setDocuments(docs)
          setLoading(false)
        } else if (realtime) {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              // place doc at change.newIndex
              const docs = [...documents()]
              docs.splice(change.newIndex, 0, change.doc.data() as T)
              setDocuments(docs)
            }
            if (change.type === 'modified') {
              const docs = documents()
              const index = docs.findIndex(doc => doc.id === change.doc.id)
              docs[index] = change.doc.data() as T
              setDocuments(docs)
            }
            if (change.type === 'removed') {
              const docs = documents()
              const index = docs.findIndex(doc => doc.id === change.doc.id)
              docs.splice(index, 1)
              setDocuments(docs)
            }
          })
        }
      },
      error => setError(error),
    )
    return () => unsubscribe()
  })

  function addDocument(data: Omit<T, 'id'> | { created?: FieldValue }) {
    return addDoc(collectionRef, data)
  }

  function updateDocument(id: string, data: Partial<T> & AddPrefixToKeys<string, any>) {
    const docRef = doc(collectionRef, id)
    return updateDoc(docRef, data)
  }

  function removeDocument(id) {
    return deleteDoc(doc(collectionRef, id))
  }

  return { documents, error, loading, addDocument, updateDocument, removeDocument }
}
