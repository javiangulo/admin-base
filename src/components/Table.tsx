/* eslint-disable react-hooks/incompatible-library */

import * as React from 'react'

import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table'

import type {
  ColumnDef,
  SortingState,
  OnChangeFn,
  TableState,
  PaginationState,
  ColumnSizingState,
  Header,
  Cell,
  ColumnOrderState,
  ExpandedState,
  Row,
  RowSelectionState,
  ColumnPinningState,
  Column,
} from '@tanstack/react-table'

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline'
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

import {joinClasses, pagination} from '@utils/misc'
import {SortDirectionTypes} from '@/types'

export type TableActionsRef = {
  gotoPage: (page: number) => void
  toggleAllRowsSelected: (set: boolean) => void
}

/**
 * `totalRows` and `totalPages` are required if pagination will be
 * handle manually, for example server pagination
 *
 */

type Props = {
  data: Array<any>
  columns: ColumnDef<any, any>[]
  children: React.ReactNode

  totalRows?: number
  totalPages?: number
  initialPage?: number
  initialLimit?: number
  initialSortBy?: Array<{id: string; desc: boolean}>
  handleSortBy?: (sortField: string, sortDirection: SortDirectionTypes) => void
  selectedRows?: Record<string, boolean>
  handleSelectedRowsChange?: (row: Record<string, boolean>) => void
  actionsRef?: React.MutableRefObject<TableActionsRef>
  handleTagsIncluded?: (row: Row<any>) => '' | string | null
  onSortingChange?: OnChangeFn<SortingState> | undefined
  onPaginationChange?: OnChangeFn<PaginationState> | undefined
  onColumnSizingChange?: OnChangeFn<ColumnSizingState> | undefined
  onColumnOrderChange?: OnChangeFn<ColumnOrderState> | undefined
  onExpandedChange?: OnChangeFn<ExpandedState> | undefined
  onRowSelectionChange?: OnChangeFn<RowSelectionState> | undefined
  onColumnPinningChange?: OnChangeFn<ColumnPinningState> | undefined
  getSubRows?:
    | ((originalRow: any, index: number) => any[] | undefined)
    | undefined
  getRowCanExpand?: ((row: Row<any>) => boolean) | undefined
  state?: Partial<TableState> | undefined
  columnCanResize?: boolean
  manualPagination?: boolean
  renderRowSubComponent?: (props: {row: Row<any>}) => React.ReactElement
}

const getCommonPinningStyles = (column: Column<any>): React.CSSProperties => {
  const isPinned = column.getIsPinned()
  //const enablePinning = column.getCanPin()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

const TABLE_LIMIT = [5, 10, 25, 50, 100]

type UseTableResult = ReturnType<typeof useReactTable<any>> & {
  totalPages?: number
  totalRows?: number
  renderRowSubComponent?: (props: {row: Row<any>}) => React.ReactElement
  columnCanResize?: boolean
}

const TableContext = React.createContext<UseTableResult>({} as UseTableResult)

TableContext.displayName = 'TableContext'

function useTableContext() {
  return React.useContext(TableContext)
}

/**
 * Renders a table with the next features:
 *  - sorting
 *  - pagination
 *  - limit by page
 *  - leyend with current page and total of rows
 *  - composable
 *
 * Pagination could be handled via server (manually) or automatically with
 * the core of react-table
 *
 * @component
 * @param {Props} props
 */
function Table(props: Props) {
  const {
    data,
    columns,
    totalPages,
    totalRows,
    initialPage,
    initialLimit,
    manualPagination = false,
    // initialSortBy,
    // selectedRows,
    // handleSortBy,
    // handleSelectedRowsChange,
    // handleTagsIncluded,
    renderRowSubComponent,
    // actionsRef,
    onSortingChange,
    onPaginationChange,
    onColumnSizingChange,
    onColumnOrderChange,
    onExpandedChange,
    onRowSelectionChange,
    onColumnPinningChange,
    getSubRows,
    getRowCanExpand,
    state,
    columnCanResize = false,
  } = props

  const instance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange,
    onPaginationChange,
    onColumnSizingChange,
    onColumnOrderChange,
    onRowSelectionChange,
    onExpandedChange,
    onColumnPinningChange,
    getSubRows,
    getRowCanExpand,
    columnResizeMode: 'onChange',
    manualPagination,
    initialState: {
      pagination: {
        pageIndex: initialPage ?? 0,
        pageSize: initialLimit ?? 100,
      },
    },
    state,
  })

  // React.useEffect(() => {
  //   if (handleSortBy) {
  //     const sortBy = instance.state.sortBy[0]
  //     if (sortBy !== undefined) {
  //       handleSortBy(sortBy.id, sortBy.desc ? 'DESC' : 'ASC')
  //     }
  //   }
  // }, [handleSortBy, instance.state.sortBy])

  // React.useEffect(() => {
  //   handleSelectedRowsChange?.(instance.state.selectedRowIds)
  // }, [handleSelectedRowsChange, instance.state.selectedRowIds])

  // /**
  //  * Exposes methods via `actionsRef` that allows control some actions
  //  */
  // React.useEffect(() => {
  //   if (!actionsRef) return

  //   actionsRef.current = {
  //     gotoPage: instance.gotoPage,
  //     toggleAllRowsSelected: instance.toggleAllRowsSelected,
  //   }
  // }, [actionsRef, instance.gotoPage, instance.toggleAllRowsSelected])

  if (data.length === 0) {
    return <NoResults />
  }

  const resultInstance: UseTableResult = {
    ...instance,
    totalPages,
    totalRows,
    renderRowSubComponent,
    columnCanResize,
  }

  return (
    <TableContext.Provider value={resultInstance}>
      {props.children}
    </TableContext.Provider>
  )
}

function TableData({width}: {width?: string}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const {options, getTotalSize} = useTableContext()

  // calculates dynamic height for table container
  React.useLayoutEffect(() => {
    if (!containerRef.current) return

    const screenHeight = window.innerHeight
    const bounding = containerRef.current.getBoundingClientRect()

    if (bounding) {
      const height = screenHeight - bounding.top - 40
      containerRef.current.style.maxHeight = `${height}px`
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-auto shadow-md sm:rounded-lg"
      style={{direction: options.columnResizeDirection}}
    >
      <table
        className={joinClasses(
          'w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400',
          width ?? '!min-w-full',
        )}
        {...{
          style: {
            width: getTotalSize(),
          },
        }}
      >
        <RenderHead />
        <RenderBody />
      </table>
    </div>
  )
}

const RenderHeaderResize = ({header}: {header: Header<any, unknown>}) => {
  return (
    <div
      {...{
        onDoubleClick: () => header.column.resetSize(),
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className: `resizer  w-10 ${
          header.column.getIsResizing() ? 'isResizing' : ''
        }`,
      }}
    />
  )
}

const RenderHeaderData = ({header}: {header: Header<any, unknown>}) => {
  const {attributes, listeners} = useSortable({
    id: header.column.id,
  })

  const {getState} = useTableContext()

  return header.isPlaceholder ? null : (
    <div
      className={joinClasses(
        'inline-flex items-center w-full justify-between',
        header.column.getCanSort() ? 'cursor-pointer select-none' : '',
      )}
      onClick={header.column.getToggleSortingHandler()}
      title={
        header.column.getCanSort()
          ? header.column.getNextSortingOrder() === 'asc'
            ? 'Sort ascending'
            : header.column.getNextSortingOrder() === 'desc'
              ? 'Sort descending'
              : 'Clear sort'
          : undefined
      }
    >
      {getState().columnOrder.length > 0 && header.subHeaders.length === 0 && (
        <button {...attributes} {...listeners}>
          🟰
        </button>
      )}
      {flexRender(header.column.columnDef.header, header.getContext())}
      {{
        asc: (
          <ChevronUpIcon className="w-5 !ml-2 text-gray-700 dark:text-gray-400" />
        ),
        desc: (
          <ChevronDownIcon className="w-5 !ml-2 text-gray-700 dark:text-gray-400" />
        ),
      }[header.column.getIsSorted() as string] ?? null}
      {header.column.getCanSort() && header.column.getIsSorted() === false && (
        <ChevronUpDownIcon className="w-5 !ml-2 text-gray-700 dark:text-gray-400" />
      )}
    </div>
  )
}

const DraggableTableHeader = ({header}: {header: Header<any, unknown>}) => {
  const {isDragging, setNodeRef, transform} = useSortable({
    id: header.column.id,
  })

  const {columnCanResize} = useTableContext()

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: 'width transform 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  }

  const showTooltip =
    (header.column.columnDef.meta as any)?.showTooltip ?? false

  return (
    <th
      scope="col"
      ref={setNodeRef}
      className={joinClasses(
        'relative bg-gray-50 dark:bg-gray-700 dark:text-gray-400',
        (header.column.columnDef.meta as any)?.headerClass ?? '',
        showTooltip ? '' : '!px-6 !py-3',
      )}
      key={header.id}
      colSpan={header.colSpan}
      {...{
        style: {
          ...style,
          ...getCommonPinningStyles(header.column),
        },
      }}
    >
      <React.Fragment>
        <RenderHeaderData header={header} />
        {columnCanResize && <RenderHeaderResize header={header} />}
      </React.Fragment>
    </th>
  )
}

const DragAlongCell = ({cell}: {cell: Cell<any, unknown>}) => {
  const {isDragging, setNodeRef, transform} = useSortable({
    id: cell.column.id,
  })

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    // position: 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: 'width transform 0.2s ease-in-out',
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <td
      className={joinClasses(
        '!px-6 !py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white',
        'bg-inherit',
        '!px-6 !py-2',
      )}
      ref={setNodeRef}
      style={{...style, ...getCommonPinningStyles(cell.column)}}
      key={cell.id}
    >
      <div className="grid">
        <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
      </div>
    </td>
  )
}

function RenderHead() {
  const {getHeaderGroups, getState} = useTableContext()

  return (
    <thead className="text-xs text-gray-700 uppercase ">
      {getHeaderGroups().map(group => {
        return (
          <tr key={group.id} className="">
            <SortableContext
              items={getState().columnOrder}
              strategy={horizontalListSortingStrategy}
            >
              {group.headers.map(header => (
                <DraggableTableHeader key={header.id} header={header} />
              ))}
            </SortableContext>
          </tr>
        )
      })}
    </thead>
  )
}

function RenderBody() {
  const {getRowModel, getState, renderRowSubComponent} = useTableContext()
  const rows = getRowModel().rows
  return (
    <tbody>
      {getRowModel().rows.map((row, idx: number) => {
        return (
          <React.Fragment key={row.id}>
            <tr
              className={joinClasses(
                `relative border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600`,
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                row.getIsExpanded()
                  ? 'border-t-2 border-l-2 border-r-2 border-coolgray-200'
                  : 'border-0',
              )}
              style={{
                zIndex: rows.length - idx,
              }}
              key={row.id}
            >
              {row.getVisibleCells().map(cell => {
                return (
                  <SortableContext
                    key={cell.id}
                    items={getState().columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    <DragAlongCell key={cell.id} cell={cell} />
                  </SortableContext>
                )
              })}
            </tr>
            {row.getIsExpanded() && (
              <tr>
                <td colSpan={row.getVisibleCells().length}>
                  {renderRowSubComponent && renderRowSubComponent({row})}
                </td>
              </tr>
            )}
          </React.Fragment>
        )
      })}
    </tbody>
  )
}

type TablePaginationProps = {
  handleChange?: (page: number) => void
  children?: React.ReactNode
}
function TablePagination({handleChange, children}: TablePaginationProps) {
  const {getState, getPageCount, totalPages, totalRows} = useTableContext()

  const visualCurrentPage = getState().pagination.pageIndex + 1
  const pages = totalPages ?? getPageCount()
  const pageSize = getState().pagination.pageSize
  const rows = totalRows ?? pageSize

  return (
    <div className="flex items-center flex-column flex-wrap !md:flex-row justify-between !p-4">
      {/* desktop */}
      <div className="w-full sm:flex-1 sm:flex sm:items-center">
        {pages && (
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              <span className="font-medium">{rows}</span> resultados
              {' | '}
              Página <span className="font-medium">
                {visualCurrentPage}
              </span> de <span className="font-medium">{pages}</span>
            </p>
          </div>
        )}
        {children ?? <div className="flex-1" />}
        <div className="flex xs:mt-2 lg:!mt-0 xs:flex-col-reverse lg:flex-row space-x-4 items-center">
          <nav
            className="relative z-0 inline-flex items-center space-x-1.5"
            aria-label="Pagination"
          >
            <PaginationButtons gotoPageServer={handleChange} />
          </nav>
          <div className="h-3 border-l border-gray-200"></div>
          <JumpToPage gotoPageServer={handleChange} />
        </div>
      </div>
    </div>
  )
}

type PaginationServer = {
  gotoPageServer?: (page: number) => void
}

function PaginationButtons({gotoPageServer}: PaginationServer) {
  const {getState, setPageIndex, getPageCount, totalPages} = useTableContext()

  const visualCurrentPage = getState().pagination.pageIndex + 1
  const pages = totalPages ?? getPageCount()

  return (
    <>
      {pagination(visualCurrentPage, pages).map((item, idx) => {
        return Number(item) ? (
          <button
            key={idx}
            className={joinClasses(
              (item as number) === visualCurrentPage
                ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
              'flex items-center justify-center !px-3 h-8 !ms-0 leading-tight',
            )}
            onClick={() => {
              const page = (item as number) - 1
              gotoPageServer?.(page)
              setPageIndex(page)
            }}
            disabled={(item as number) === visualCurrentPage}
          >
            {item}
          </button>
        ) : (
          <span
            key={idx}
            className="flex items-center justify-center !px-3 h-8 !ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            ...
          </span>
        )
      })}
    </>
  )
}

type TablePaginationLimitProps = {
  handleChange?: (limit: number) => void
}
function TablePaginationLimit(props: TablePaginationLimitProps) {
  const {handleChange} = props

  const {getState, setPageSize, setPageIndex} = useTableContext()

  const visualCurrentPage = getState().pagination.pageSize
  return (
    <select
      id="limit"
      name="limit"
      className="w-38 inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm !px-3 !py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      value={visualCurrentPage}
      onChange={e => {
        const pageLimit = Number(e.target.value)
        handleChange?.(pageLimit)
        setPageSize(pageLimit)
        setPageIndex(0)
      }}
    >
      {TABLE_LIMIT.map(limit => (
        <option
          key={limit}
          value={limit}
          className="w-full !ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300"
        >
          {limit} por página
        </option>
      ))}
    </select>
  )
}

function JumpToPage({gotoPageServer}: PaginationServer) {
  const {getState, setPageIndex, getPageCount, totalPages} = useTableContext()
  const pages = totalPages ?? getPageCount()

  const visualCurrentPage = getState().pagination.pageIndex + 1
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="jump_to"
        className="font-semibold text-gray-900 dark:text-white"
      >
        Saltar a
      </label>
      <input
        id="jump_to"
        type="text"
        className="bg-gray-50 w-10 text-center border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                focus:border-blue-500 block !px-2.5 !py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="1"
        defaultValue={visualCurrentPage}
        onKeyDown={e => {
          const target = e.target as HTMLInputElement
          const jumpToPage = Number(target.value)
          if (isNaN(jumpToPage) || (e.key && e.key !== 'Enter')) return
          if (jumpToPage >= 1 && jumpToPage <= pages) {
            const page = jumpToPage - 1
            gotoPageServer?.(page)
            setPageIndex(page)
          }
        }}
      />
    </div>
  )
}

function NoResults() {
  return (
    <div className="!py-16 sm:!py-24">
      <div className="relative sm:!py-16">
        <div aria-hidden="true" className="hidden sm:block">
          <svg
            className="absolute top-8 left-1/2 !-ml-3"
            width={404}
            height={392}
            fill="none"
            viewBox="0 0 404 392"
          >
            <defs>
              <pattern
                id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={392}
              fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)"
            />
          </svg>
        </div>
        <div className="!mx-auto !max-w-md !px-4 sm:max-w-3xl sm:!px-6">
          <div className="relative rounded-2xl !px-6 !py-10 bg-purple-600 overflow-hidden shadow-xl sm:!px-12 sm:!py-20">
            <div className="relative">
              <div className="sm:text-center">
                <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                  No encontramos resultados
                </h2>
                <p className="!mt-6 !mx-auto !max-w-2xl text-lg text-gray-25">
                  Intenta con otra busqueda o crea un nuevo registro
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Table.Data = TableData
Table.Pagination = TablePagination
Table.PaginationLimit = TablePaginationLimit

export {Table}
