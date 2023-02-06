import { useFirebaseApp } from './FirebaseContext'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

export function useStorage() {
  const app = useFirebaseApp()
  const storage = getStorage(app)

  const uploadFile = async (path: string, file: Blob | Uint8Array | ArrayBuffer) => {
    const snapshot = await uploadBytes(ref(storage, `uploads/${path}`), file)
    const url = await getDownloadURL(snapshot.ref)
    return url
  }

  return { storage, uploadFile }
}
