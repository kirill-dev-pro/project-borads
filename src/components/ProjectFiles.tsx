import { useAuth, useCollection } from '../lib/firebase'
import { useStorage } from '../lib/firebase/useStorage'
import { createSignal, For, onMount } from 'solid-js'
import { orderBy } from 'firebase/firestore'

interface File {
  id: string
  name: string
  fileUrl: string
  author: string
  created: number
}

export function ProjectFiles({ projectId }: { projectId: string }) {
  const { user } = useAuth()
  const { uploadFile } = useStorage()
  // const [files, setFiles] = createSignal([])
  const [selectedFiles, setSelectedFiles] = createSignal([])
  const {
    documents: files,
    addDocument,
    loading,
  } = useCollection<File>('project/' + projectId + '/files', [orderBy('created', 'desc')])

  let filesRef
  let inputRef: HTMLInputElement

  // async function loadFiles() {
  //   try {
  //     const res = await pb.collection('files').getList(1 + Math.round(files().length / 10), 10, {
  //       filter: `project = "${projectId}"`,
  //       expand: 'author',
  //       sort: '-created',
  //     })
  //     if (res.items.length === 0) return
  //     setFiles(_.uniqBy([...files(), ...res.items], 'id'))
  //   } catch (err) {
  //     console.error('Error:', err)
  //   }
  // }

  async function onUploadFile(e: Event) {
    e.preventDefault()
    const file = inputRef.files[0]
    if (!file) return
    try {
      const id = Math.random().toString(36).substring(2)
      const fileUrl = await uploadFile(id, file)
      await addDocument({
        name: file.name,
        fileUrl,
        author: user().uid,
        created: Date.now(),
      })
      inputRef.value = ''
    } catch (error) {
      console.error('Error:', error)
    }
  }

  onMount(() => {
    if (loading()) return
    filesRef.scrollTop = filesRef.scrollHeight
  })

  function onFileSelect(e: Event) {
    setSelectedFiles([...inputRef.files])
  }

  return (
    <div class='flex w-64 flex-col gap-2 rounded border border-black p-1'>
      <h2 class='text-xl'>Files:</h2>
      <div
        class='h-36 overflow-x-hidden overflow-y-scroll rounded border border-black p-1'
        ref={filesRef}
      >
        <For each={[...files()].reverse()}>
          {file => (
            <p class='w-full rounded border border-black p-1'>
              <span class='rounded bg-green-100 p-px text-xs'>{file.author}:</span>
              <br />
              <a
                href={file.fileUrl}
                target='_blank'
                rel='noreferrer'
                class='text-blue-500 underline'
              >
                {file.name || file.id}
              </a>
              <img src={file.fileUrl} />
            </p>
          )}
        </For>
      </div>
      <form class='flex flex-col gap-2' onSubmit={onUploadFile}>
        <input type='file' class='hidden' ref={inputRef} onChange={onFileSelect} multiple />
        <button
          type='button'
          onClick={() => inputRef.click()}
          class='rounded border border-black p-1 hover:shadow active:translate-y-px active:scale-95'
        >
          Select file
        </button>
        <div class='h-8'>
          <For each={selectedFiles()}>{file => <p>{file.name}</p>}</For>
        </div>
        <button
          type='submit'
          class='rounded border border-black p-1 hover:shadow active:translate-y-px active:scale-95'
        >
          Upload
        </button>
      </form>
    </div>
  )
}
