import { useAuth, usePB } from '../lib/pocketbase'
import { createSignal, For, onMount } from 'solid-js'
import _ from 'lodash'

export function ProjectFiles({ projectId }: { projectId: string }) {
  const pb = usePB()
  const { user } = useAuth()
  const [files, setFiles] = createSignal([])
  const [selectedFiles, setSelectedFiles] = createSignal([])

  let filesRef
  let inputRef: HTMLInputElement

  async function loadFiles() {
    try {
      const res = await pb.collection('files').getList(1 + Math.round(files().length / 10), 10, {
        filter: `project = "${projectId}"`,
        expand: 'author',
        sort: '-created',
      })
      if (res.items.length === 0) return
      setFiles(_.uniqBy([...files(), ...res.items], 'id'))
    } catch (err) {
      console.error('Error:', err)
    }
  }

  function uploadFile(e: Event) {
    e.preventDefault()
    const file = inputRef.files[0]
    if (!file) return
    pb.collection('files')
      .create({
        file,
        project: projectId,
        author: user().id,
      })
      .then(res => {
        inputRef.value = ''
      })
      .catch(err => {
        console.error('Error:', err)
      })
  }

  onMount(async () => {
    await loadFiles()
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
        <For each={_.reverse(files())}>
          {file => (
            <p class='w-full'>
              <span class='rounded bg-green-100 p-px'>{file.expand.author.name}:</span> {file.file}
            </p>
          )}
        </For>
      </div>
      <form class='flex flex-col gap-2' onSubmit={uploadFile}>
        <input type='file' class='hidden' ref={inputRef} onChange={onFileSelect} multiple />
        <button
          type='button'
          onClick={() => (inputRef.value = null) && inputRef.click()}
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
