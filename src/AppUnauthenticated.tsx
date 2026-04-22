import * as React from 'react'

import {useLocation} from 'react-router-dom'

import {FullPageSpinner} from '@lib/FullPageSpinner'

/**
 * Env variable for login app
 */
const loginUrl = import.meta.env.VITE_LOGIN_APP_URL as string

/**
 * If there is not a user with session then is redirected to the login
 * page
 *
 * @component
 */
function AppUnauthenticated() {
  const {pathname} = useLocation()

  const url = encodeURIComponent(
    window.location.origin.toString() + pathname + window.location.search,
  )

  /**
   * Waits 2.5secs and then redirects to the login page's url
   */
  React.useEffect(() => {
    const intervalId = setTimeout(() => {
      window.location.replace(loginUrl + '?goToUrl=' + url)
    }, 2500)

    return () => {
      clearInterval(intervalId)
    }
  }, [url])

  return (
    <FullPageSpinner>
      No session found, redirecting to login page
    </FullPageSpinner>
  )
}

export default AppUnauthenticated
