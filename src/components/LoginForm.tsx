import { useAuth } from 'lib/appwrite'

export function LoginForm() {
  const { error, loginWithPassword, continueAsGuest } = useAuth()

  let emailRef
  let passwordRef

  function login(event: Event) {
    event.preventDefault()
    loginWithPassword(emailRef.value, passwordRef.value)
  }

  return (
    <div>
      <p>Login</p>
      <p class='text-red-300'>{error()}</p>
      <form class='flex flex-col gap-2' onSubmit={login}>
        <input type='text' placeholder='email' name='email' ref={emailRef} />
        <input type='password' placeholder='password' name='password' ref={passwordRef} />
        <button type='submit' class='rounded border-2 border-black bg-white p-2'>
          Login
        </button>
      </form>
      <button class='mt-2 rounded border-2 border-black bg-white p-2' onClick={continueAsGuest}>
        Continue as guest
      </button>
    </div>
  )
}
