import { useAuth, useCollection } from '../lib/firebase'
import { createEffect, createSignal, For } from 'solid-js'
import { endAt, orderBy } from 'firebase/firestore'

interface Message {
  id: string
  text: string
  author: string
  created: number
}

export function ProjectChat({ projectId }: { projectId: string }) {
  const { user } = useAuth()
  const [endAtDate, setEndAtDate] = createSignal(Date.now() - 1000 * 60 * 60 * 24)
  const {
    documents: messages,
    loading,
    addDocument,
  } = useCollection<Message>('projects/' + projectId + '/messages', [
    orderBy('created', 'desc'),
    endAt(Date.now() - 1000 * 60 * 60 * 24),
  ])

  let textareaRef
  let messagesRef

  function sendMessage(e: Event) {
    e.preventDefault()
    const text = textareaRef.value
    if (text === '') return
    addDocument({ text, author: user().uid, created: Date.now() })
    textareaRef.value = ''
  }

  createEffect(() => {
    if (!loading() && messages()) {
      console.log('messages', messages())
      const timeout = setTimeout(() => {
        if (messages().length === 0) {
          console.log('call', endAtDate() - 1000 * 60 * 60 * 24)
          setEndAtDate(endAtDate() - 1000 * 60 * 60 * 24)
        }
      }, 100)
      return () => clearTimeout(timeout)
    }
  })

  createEffect(() => {
    if (!loading() && messages().length) {
      messagesRef.scrollTop = messagesRef.scrollHeight
    }
  })

  return (
    <div class='flex w-64 flex-col gap-2 rounded border border-black p-1'>
      <h2 class='text-xl'>Messages:</h2>
      <div
        class='flex h-36 flex-col gap-1 overflow-x-hidden overflow-y-scroll rounded border border-black p-1'
        ref={messagesRef}
      >
        <For each={[...messages()].reverse()}>
          {message => <MessageBubble message={message} isOwn={message.author === user().uid} />}
        </For>
      </div>
      <form onSubmit={sendMessage} class='flex flex-col gap-2'>
        <textarea class='rounded border border-black' ref={textareaRef} />
        <button
          type='submit'
          class='rounded border border-black p-1 hover:shadow active:translate-y-px active:scale-95'
        >
          Send!
        </button>
      </form>
    </div>
  )
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <p class='flex flex-col rounded border border-black p-2'>
      <span class='text-sm'>{new Date(message.created).toLocaleString('ru')}</span>
      <span>
        <span class='rounded bg-green-100 p-px text-xs'>{message.author}</span>:
      </span>
      <span>{message.text}</span>
    </p>
  )
}
