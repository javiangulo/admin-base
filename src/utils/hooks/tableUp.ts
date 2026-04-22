import * as React from 'react'

import {useSearchParams} from './searchParams'
import {PaginationParams, SortDirections} from '@/types'
import {TableActionsRef} from '@lib/Table'

const defaultFilters: PaginationParams = {
  page: 0,
  limit: 100,
  search: '',
  searchField: 'id',
  sortField: 'created_at',
  sortDirection: 'DESC',
}

/**
 * Hook that works with tables filters (search, pagination, limit, sort) and
 * exposes the URLSearchParams to manipulate the search params.
 */
function useTableFilters() {
  const tableActionsRef = React.useRef<TableActionsRef>({} as TableActionsRef)
  const params = useSearchParams()

  const defaultFilters = {
    page: +(params.searchParams.get('page') ?? 0),
    limit: +(params.searchParams.get('limit') ?? 100),
    search: params.searchParams.get('search') ?? '',
    sortField: params.searchParams.get('sortField') ?? 'created_at',
    sortDirection: params.searchParams.get('sortDirection') ?? 'DESC',
  }

  // This effect is triggered everytime the `page` param change and
  // sets the selected page in the table to that param.
  React.useEffect(() => {
    if (tableActionsRef.current.gotoPage) {
      tableActionsRef.current.gotoPage(defaultFilters.page)
    }
  }, [defaultFilters.page])

  const onPageChange = React.useCallback(
    (page: number) => params.setSearchParam('page', +page),
    [params],
  )

  const onLimitChange = React.useCallback(
    (limit: number) => {
      params.setSearchParams([
        {name: 'page', value: 0},
        {name: 'limit', value: limit},
      ])
    },
    [params],
  )

  const onSortByChange = React.useCallback(
    (sortField: string, sortDirection: SortDirections) => {
      if (
        params.searchParams.get('sortField') !== sortField ||
        params.searchParams.get('sortDirection') !== sortDirection
      ) {
        params.setSearchParams([
          {name: 'page', value: 0},
          {name: 'sortField', value: sortField},
          {name: 'sortDirection', value: sortDirection},
        ])
      }
    },
    [params],
  )

  const onSearchChange = React.useCallback(
    (query: string) => {
      params.setSearchParams([
        {name: 'page', value: 0},
        {name: 'search', value: query},
      ])
    },
    [params],
  )

  const initialSortBy = React.useCallback(() => {
    if (params.searchParams.get('sortField')) {
      return [
        {
          id: params.searchParams.get('sortField') ?? '',
          desc: params.searchParams.get('sortDirection') === 'DESC',
        },
      ]
    }
  }, [params.searchParams])

  return {
    ...params,
    defaultFilters,
    onPageChange,
    onLimitChange,
    onSortByChange,
    onSearchChange,
    initialSortBy,
    tableActionsRef,
  }
}
/**
 * Return the current URL encoded and concatenates search params.
 */
function getEncodedUrlWithSearchParams() {
  const {
    location: {pathname, search},
  } = window
  return encodeURIComponent(pathname + search) + search
}

export {useTableFilters, getEncodedUrlWithSearchParams, defaultFilters}
