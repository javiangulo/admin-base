import React from 'react'
import {Route, Routes} from 'react-router-dom'
// import {ErrorBoundary} from 'react-error-boundary'
import _ from 'lodash'

import {authProtectedRoutes} from '@/routes/allRoutes'
import {NavigationItem} from '@/types'
// import {FullPageSpinner} from '@/components/FullPageSpinner'
// import {ErrorFallback} from '@/components/ErrorFallback'
// import {Breadcrumbs} from '@/components/Layout/Breadcrumbs'
import AppLayout from '@/layout/AppLayout'

const createRoutes = (
  route: NavigationItem,
  idx: number,
  permissions: string[],
) => {
  switch (true) {
    case _.isArray(route.routes) && route.onAdmin:
      return (
        <Route element={<AppLayout />}>
          <Route
            key={idx}
            path={route.path}
            element={<route.component {...route} />}
          >
            {route.routes?.map((route: NavigationItem, idx: number) =>
              createRoutes(route, idx, permissions),
            )}
          </Route>
        </Route>
      )
    case route.onAdmin:
      return (
        <Route element={<AppLayout />}>
          <Route
            key={idx}
            path={route.path}
            element={<route.component {...route} />}
          />
        </Route>
      )
    default:
      return (
        <Route>
          <Route
            key={idx}
            path={route.path}
            element={<route.component {...route} />}
          />
        </Route>
      )
  }
}

const RouteIndex = () => {
  return (
    <React.Fragment>
      <Routes>
        {authProtectedRoutes.map((route: NavigationItem, idx: number) =>
          createRoutes(route, idx, []),
        )}
      </Routes>
    </React.Fragment>
  )
}

export default RouteIndex
