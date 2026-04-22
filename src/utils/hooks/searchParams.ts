import * as React from 'react'

import {useNavigate, useLocation} from 'react-router-dom'

/**
 * Hook to manipulate query search params, it exposes the current
 * search params and gives an api to add new search params
 */
function useSearchParams() {
  const history = useNavigate()
  const {search, pathname} = useLocation()

  const searchParams = React.useMemo(
    () => new URLSearchParams(search),
    [search],
  )

  const pushSearchParams = React.useCallback(
    (query: string) => history({pathname, search: `?${query}`}),
    [history, pathname],
  )

  const setSearchParam = React.useCallback(
    (name: string, value: unknown) => {
      searchParams.set(name, value as string)
      pushSearchParams(searchParams.toString())
    },
    [pushSearchParams, searchParams],
  )

  const setSearchParams = React.useCallback(
    (params: Array<{name: string; value: unknown}>) => {
      for (const {name, value} of params) {
        searchParams.set(name, value as string)
      }
      pushSearchParams(searchParams.toString())
    },
    [pushSearchParams, searchParams],
  )

  const clearSearchParams = React.useCallback(() => {
    for (const name of searchParams.keys()) {
      searchParams.delete(name)
    }
    pushSearchParams('')
  }, [pushSearchParams, searchParams])

  const encodeObject = React.useCallback(
    (value: unknown) => encodeURIComponent(JSON.stringify(value)),
    [],
  )

  const decodeObject = React.useCallback(
    (name: string, defaultValue: string) =>
      JSON.parse(decodeURIComponent(searchParams.get(name) ?? defaultValue)),
    [searchParams],
  )

  return {
    searchParams,
    setSearchParam,
    setSearchParams,
    clearSearchParams,
    encodeObject,
    decodeObject,
  }
}

export {useSearchParams}
