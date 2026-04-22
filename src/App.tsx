import * as React from 'react'

import {FullPageSpinner} from '@lib/FullPageSpinner'
import {useAuth} from '@context/auth-context'

const AppAuthenticated = React.lazy(() => import('@/routes'))
//const AppUnauthenticated = React.lazy(() => import('./AppUnauthenticated'))

/**
 * If there is a valid session then renders the authenticated app if not then
 * renders the unauthenticated app.
 *
 * @component
 */
function App() {
  const {user} = useAuth()

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AppAuthenticated /> : <AppAuthenticated />}
    </React.Suspense>
  )
}

export default App
