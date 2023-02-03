import { LoginForm } from 'components/LoginForm'
import { useAuth } from 'lib/appwrite'

export default function Login() {
  const { getGoogleAuthLink } = useAuth({ redirect: true })

  function continueWithGoogle() {
    const link = getGoogleAuthLink('http://localhost:3000', 'http://localhost:3000/login')
    console.log('url', link)
    // window.location.href = link
  }
  return (
    <div>
      <LoginForm />
      <button class='mt-2 rounded border-2 border-black bg-white p-2' onClick={continueWithGoogle}>
        Continue with Google
      </button>
    </div>
  )
}
