import { useUI } from '@components/ui/context'
import useFacebookLogin from '@framework/auth/use-facebook-login'
import { useEffect, useState } from 'react'

const FacebookLogin: React.FC = () => {
  const { closeModal } = useUI()
  const [error, setError] = useState('')
  const facebookLogin = useFacebookLogin()

  useEffect(() => {
    window.FB!.init({
      appId: process.env.NEXT_PUBLIC_APP_ID_FACEBOOK_LOGIN!,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v14.0',
    })
  }, [])

  useEffect(() => {
    window.handleOnSuccessFacebook = function () {
      window.FB!.getLoginStatus(login)
    }
    return () => {
      delete window.handleOnSuccessFacebook
    }
  }, [])

  useEffect(() => {
    window.FB!.XFBML.parse()
  }, [])

  const login = async (response: FacebookSDKLoginStatus) => {
    const { status, authResponse } = response
    if (status === 'connected') {
      await facebookLogin({
        token: authResponse.accessToken
      })
      closeModal()
      return
    }
    setError('An error occurred!')
  }

  return (
    <div>
      <div
        className="fb-login-button"
        data-width=""
        data-size="large"
        data-button-type="continue_with"
        data-layout="default"
        data-auto-logout-link="false"
        data-use-continue-as="false"
        data-scope="public_profile,email"
        data-onlogin="handleOnSuccessFacebook"
      />
      {error && <div>{error}</div>}
    </div>
  )
}

export default FacebookLogin
