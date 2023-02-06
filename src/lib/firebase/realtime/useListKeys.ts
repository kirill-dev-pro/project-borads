import { useFirebase } from '../FirebaseContext'
import { DataSnapshot, get, onChildAdded, ref } from 'firebase/database'
import { createEffect, createMemo, createSignal } from 'solid-js'

const addChild = function (
  currentState: string[],
  snapshot: DataSnapshot,
  previousKey: string | null | undefined,
) {
  if (!snapshot.key) {
    return currentState
  }
  if (!previousKey) {
    // The child has been added to the start of the list
    return [snapshot.key].concat(currentState)
  }
  // Establish the index for the previous child in the list
  const index = currentState.indexOf(previousKey)
  // Insert the item after the previous child
  return currentState.slice(0, index + 1).concat([snapshot.key], currentState.slice(index + 1))
}

const removeChild = function (currentState: string[], snapshot: DataSnapshot) {
  if (!snapshot.key) {
    return currentState
  }
  const index = currentState.indexOf(snapshot.key)
  return currentState.slice(0, index).concat(currentState.slice(index + 1))
}

export function useListKeys(path: string) {
  const [keys, setKeys] = createSignal<string[]>([])
  const { db } = useFirebase()

  const boardRef = createMemo(() => {
    if (!path) return null
    return ref(db, path)
  }, [path])

  function onChildAddedCb(snapshot: DataSnapshot, previousKey: string | null | undefined) {
    setKeys(currentState => addChild(currentState, snapshot, previousKey))
  }

  function onChildRemovedCb(snapshot: DataSnapshot) {
    setKeys(currentState => removeChild(currentState, snapshot))
  }

  createEffect(() => {
    if (!boardRef) return
    let childAddedUnsubscribe: () => void
    const onInitialLoad = function (snapshot: DataSnapshot) {
      const snapshotVal = snapshot.val()
      let childrenToProcess = snapshotVal ? Object.keys(snapshot.val()).length : 0
      // If the list is empty then initialize the hook and use the default `onChildAdded` behavior
      if (childrenToProcess === 0) {
        childAddedUnsubscribe = onChildAdded(boardRef(), onChildAddedCb)
        setKeys([])
      } else {
        // Otherwise, we load the first batch of children all to reduce re-renders
        const firstChild: string[] = []
        const onChildAddedWithoutInitialLoad = function (
          addedChild: DataSnapshot,
          previousKey: string | null | undefined,
        ) {
          if (childrenToProcess > 0) {
            childrenToProcess--
            if (addedChild.key) {
              firstChild.push(addedChild.key)
              if (childrenToProcess === 0) {
                setKeys(firstChild)
              }
            }
            return
          }
          onChildAddedCb(addedChild, previousKey)
        }
        childAddedUnsubscribe = onChildAdded(boardRef(), onChildAddedWithoutInitialLoad)
      }
    }

    get(boardRef()).then(onInitialLoad)

    const childRemovedUnsubscribe = onChildAdded(boardRef(), onChildRemovedCb)
    return () => {
      childAddedUnsubscribe()
      childRemovedUnsubscribe()
    }
  })

  return { keys }
}
