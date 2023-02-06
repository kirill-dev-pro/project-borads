import { useAuth } from '../lib/firebase/auth/useAuth'
import { Show } from 'solid-js'

export function LoginForm() {
  const { error, loading, loginWithEmail, loginAsGuest } = useAuth()

  let emailRef
  let passwordRef

  function login(event: Event) {
    event.preventDefault()
    loginWithEmail(emailRef.value, passwordRef.value)
  }

  return (
    <div class='rounded border border-black p-2'>
      <p class='my-1 text-center text-xl'>Login</p>
      <Show when={error()}>
        <p class='my-1 bg-red-900 p-1 text-white'>{error()?.message}</p>
      </Show>
      <form class='flex flex-col gap-2' onSubmit={login}>
        <input
          type='text'
          placeholder='email'
          name='email'
          ref={emailRef}
          class='rounded border border-black p-1 hover:shadow'
        />
        <input
          type='password'
          placeholder='password'
          name='password'
          ref={passwordRef}
          class='rounded border border-black p-1 hover:shadow'
        />
        <button
          type='submit'
          class='rounded border border-black p-2 transition-all duration-100 hover:shadow active:scale-95'
          disabled={loading()}
        >
          <Show when={!loading()} fallback='Loading...'>
            Log in
          </Show>
        </button>

        <button
          type='button'
          class='rounded border border-black p-2 transition-all duration-100 hover:shadow active:scale-95'
          onClick={loginAsGuest}
        >
          Login as guest
        </button>
      </form>
    </div>
  )
}
