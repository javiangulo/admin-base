import * as React from 'react'

import {BrowserRouter as Router} from 'react-router-dom'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

import {QueryClientProvider} from './query-client'
import {AuthProvider} from './auth-context'
import {ThemeProvider} from '@/context/themeContext'

type Props = {
  children: React.ReactNode
}

/**
 * Renders the application with all Provider's Context
 *
 * @component
 * @param {React.ReactNode} children
 */

function AppProviders({children}: Props) {
  return (
    <React.StrictMode>
      <QueryClientProvider>
        <ThemeProvider>
          <Router>
            <AuthProvider>{children}</AuthProvider>
          </Router>
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

export {AppProviders}
