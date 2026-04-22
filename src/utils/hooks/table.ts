import * as React from 'react'
import {useLocation} from 'react-router'

import {PaginationParams, SortDirectionTypes, ParamAction} from '@/types'

const defaultFilters: PaginationParams = {
  page: 0,
  limit: 100,
  search: '',
  searchField: 'id',
  sortField: 'created_at',
  sortDirection: 'DESC',
}

function getDefaultFilters(search: string, initial: any) {
  const searchParams = new URLSearchParams(search)
  let queryParams = {}

  for (const [param, value] of searchParams) {
    const isArray = value.startsWith('[') && value.endsWith(']')

    queryParams = {
      ...queryParams,
      [param]:
        param === 'search' || value === ''
          ? value
          : isArray
            ? value.replace(/\[|\]/g, '').split(',') // convert string array to valid array
            : Number(value) >= 0
              ? Number(value)
              : value,
    }
  }

  return {
    ...defaultFilters,
    ...initial,
    ...queryParams,
  }
}

function buildQuerySearch(state: PaginationParams): string {
  return Object.entries(state)
    .map(([query, value]) => {
      if (Array.isArray(value)) {
        return `${query}=[${value}]`
      }

      return `${query}=${value}`
    })
    .join('&')
}

function historyReplace(pathName: string, state: PaginationParams) {
  window.history.replaceState(
    null,
    '',
    `${pathName}?${buildQuerySearch(state)}`,
  )
}

function filtersReducer(state: PaginationParams, action: ParamAction) {
  // Determine if the action should cause the page to reset
  const shouldResetPage =
    action.type === 'LIMIT' ||
    action.type === 'SEARCH' ||
    action.type === 'SORT_BY'

  const newState = (() => {
    switch (action.type) {
      case 'PAGE':
        // Only update page, no other change
        return {...state, page: +action.page}

      case 'LIMIT':
        // Update limit
        return {...state, limit: +action.limit}

      case 'SEARCH':
        // Update search
        return {...state, search: action.search}

      case 'SORT_BY':
        // Update sort fields
        return {
          ...state,
          sortField: action.sortField,
          sortDirection: action.sortDirection,
        }
      case 'RESET': {
        return {
          ...state,
          ...defaultFilters,
        }
      }
      default:
        throw new Error(`Unsupported action type on filtersReducer`)
    }
  })()

  // Apply page reset if necessary
  if (shouldResetPage) {
    return {...newState, page: 0}
  }

  return newState
}

type PaginationFiltersParams<
  State extends PaginationParams,
  Actions extends ParamAction = ParamAction,
> = {
  initial?: State
  // El reducer ahora acepta la unión de todas las acciones:
  // ParamAction (PAGE, LIMIT, RESET, etc.) | CustomActions (tus nuevas acciones)
  reducer?: (state: State, action: ParamAction | Actions) => any
}

/**
 * Manages the state for filters, this hook can be combined with table
 * component and handles query strings.
 *
 * @param {PaginationParams} initial Initial filters
 */

function usePaginationFilters<
  State extends PaginationParams,
  Actions extends ParamAction = ParamAction,
>({initial, reducer}: PaginationFiltersParams<State, Actions> = {}) {
  const history = useLocation()
  const initialFilters = getDefaultFilters(history.search, initial)
  const [state, dispatch] = React.useReducer(
    reducer ?? filtersReducer,
    initialFilters,
  )

  React.useEffect(() => {
    historyReplace(history.pathname, state)
  }, [history.pathname, state])

  const onPageChange = React.useCallback(
    (page: number) => {
      if (page !== state.page) {
        dispatch({type: 'PAGE', page})
      }
    },
    [state, dispatch],
  )

  const onLimitChange = React.useCallback(
    (limit: number) => {
      if (limit !== state.limit) {
        dispatch({type: 'LIMIT', limit})
      }
    },
    [state, dispatch],
  )

  const onSortByChange = React.useCallback(
    (sortField: string, sortDirection: SortDirectionTypes) => {
      if (
        state.sortField !== sortField ||
        state.sortDirection !== sortDirection
      ) {
        dispatch({type: 'SORT_BY', sortField, sortDirection})
      }
    },
    [state, dispatch],
  )

  const onSearchChange = React.useCallback(
    (query: string) => {
      dispatch({type: 'SEARCH', search: query})
    },
    [dispatch],
  )

  const initialSortBy = React.useCallback(() => {
    if (state.sortField) {
      return [
        {
          id: state.sortField,
          desc: state.sortDirection === 'DESC',
        },
      ]
    }

    return []
  }, [state.sortDirection, state.sortField])

  return {
    dispatch,
    filters: state,
    onPageChange,
    onLimitChange,
    onSortByChange,
    onSearchChange,
    initialSortBy,
  }
}

export {usePaginationFilters, defaultFilters, filtersReducer}
