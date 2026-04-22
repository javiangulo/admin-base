import {SortDirectionTypes} from './enum'

interface PaginationResultParams {
  page: number
  limit: number
  total: number
  totalPages: number
  sortField?: string
  searchField?: string
  sortDirection?: SortDirections
}

type SortDirections = 'ASC' | 'DESC'

interface RequestWithPagination<DataType> {
  params: PaginationResultParams
  data: DataType[]
}

type PaginationParams = {
  page?: number
  limit?: number
  search?: string
  sortField?: string
  sortDirection?: string
  searchField?: string
  // Cursor-based pagination (Supabase)
  after?: string
  before?: string
}

type ParamAction =
  | {type: 'PAGE'; page: number}
  | {type: 'LIMIT'; limit: number}
  | {type: 'SEARCH'; search: string}
  | {type: 'SORT_BY'; sortField: string; sortDirection: SortDirectionTypes}
  | {type: 'RESET'}

interface PagePagination<DatatType> {
  page: number
  limit: number
  total: number
  totalPages: number
  sortField: string
  sortDirection: SortDirectionTypes
  data: Array<DatatType>
}

type LogPaginationParams = PaginationParams & {
  modelDate?: string
  contentId?: string
}

export type {
  ParamAction,
  PagePagination,
  PaginationResultParams,
  RequestWithPagination,
  PaginationParams,
  LogPaginationParams,
  SortDirections,
}
