import { useAuth, usePB } from '../lib/pocketbase'
import _ from 'lodash'
import { createEffect, createSignal, For, onCleanup, onMount } from 'solid-js'

export function ProjectChat({ projectId }: { projectId: string }) {
  const [messages, setMessages] = createSignal([])
  const pb = usePB()
  const { user } = useAuth()

  let textareaRef
  let messagesRef

  async function loadMessages() {
    try {
      console.log('get messages page', 1 + Math.round(messages().length / 10))
      const res = await pb
        .collection('messages')
        .getList(1 + Math.round(messages().length / 10), 10, {
          filter: `project = "${projectId}"`,
          expand: 'author',
          sort: '-created',
        })
      if (res.items.length === 0) return
      console.log('res', res)
      setMessages(_.uniqBy([...messages(), ...res.items], 'id'))
    } catch (err) {
      console.error('Error:', err)
    }
  }

  function sendMessage(e: Event) {
    e.preventDefault()
    const text = textareaRef.value
    if (text === '') return
    pb.collection('messages')
      .create({
        text,
        project: projectId,
        author: user().id,
      })
      .then(res => {
        console.log('res', res)
        textareaRef.value = ''
        // loadMessages()
      })
      .catch(err => {
        console.error('Error:', err)
      })
  }

  // createEffect(loadMessages)
  onMount(async () => {
    await loadMessages()
    messagesRef.scrollTop = messagesRef.scrollHeight
  })

  createEffect(async () => {
    const unsubscribe = await pb.realtime.subscribe('messages', async event => {
      if (event.action === 'create' && event.record.project === projectId) {
        // get full message with author
        const record = await pb.collection('messages').getOne(event.record.id, {
          expand: 'author',
        })
        setMessages(_.uniqBy([record, ...messages()], 'id'))
        if (record.author.id !== user().id) {
          messagesRef.scrollTop = messagesRef.scrollHeight
        }
      }
    })
    onCleanup(unsubscribe)
  })

  return (
    <div class='flex w-64 flex-col gap-2 rounded border border-black p-1'>
      <h2>Messages:</h2>
      <div
        class='h-36 overflow-x-hidden overflow-y-scroll rounded border border-black p-1'
        ref={messagesRef}
      >
        <For each={_.reverse(messages())}>
          {message => (
            <p class='w-full'>
              <span class='rounded bg-green-100 p-px'>{message.expand.author.name}:</span>{' '}
              {message.text}
            </p>
          )}
        </For>
      </div>
      <form onSubmit={sendMessage} class='flex flex-col gap-2'>
        <textarea class='rounded border border-black' ref={textareaRef} />
        <button
          type='submit'
          class='rounded border border-black p-1 shadow active:translate-y-px active:scale-95'
        >
          Send!
        </button>
      </form>
    </div>
  )
}
