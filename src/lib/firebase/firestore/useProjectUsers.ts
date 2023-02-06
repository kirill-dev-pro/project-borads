import { useFirestore } from './useFirestore'
import { Project, User } from '../../types'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { Accessor, createEffect, createSignal } from 'solid-js'

export function useProjectUsers(project: Accessor<Project>) {
  const firestore = useFirestore()

  const [users, setUsers] = createSignal<User[]>([])

  createEffect(() => {
    const usersCollectionRef = collection(firestore, 'users')
    const queryRef = query(usersCollectionRef, where('uid', 'in', project().members))
    const unsubscribe = onSnapshot(queryRef, snapshot => {
      const docs = snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id })) as User[]
      setUsers(docs)
    })

    return () => unsubscribe()
  })

  return users
}
