import * as React from 'react'

import {Routes, Route, Navigate} from 'react-router-dom'

import {FullPageSpinner} from './FullPageSpinner'
import {NavigationItem} from '@/types'

type Props = {
  routes: NavigationItem[]
  loadingText?: string
  noMatchPath?: string
}

/**
 * wrapper for <Route> that knows how to handle "sub"-routes by passing
 * them in a `routes` prop to the component it renders.
 *
 * @component
 * @param {Props}
 */
function RouteWithSubRoutes({
  routes,
  loadingText = 'loading...',
  noMatchPath,
}: Props) {
  return (
    <React.Suspense
      fallback={
        <FullPageSpinner className="z-0">{loadingText}</FullPageSpinner>
      }
    >
      <Routes>
        {routes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component {...route} />}
          />
        ))}
        {noMatchPath ? (
          <Route path="*" element={<Navigate to={noMatchPath} replace />} />
        ) : null}
      </Routes>
    </React.Suspense>
  )
}

export {RouteWithSubRoutes}
