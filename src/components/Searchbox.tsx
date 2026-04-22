import * as React from 'react'

import {MagnifyingGlassIcon} from '@heroicons/react/24/outline'

import {joinClasses} from '@utils/misc'

type Props = {
  handleSearch: (query: string) => void
  value?: string
}

/**
 * Renders an input text to perform searchs, `handleSearch` will recive the string
 * typed into the search box.
 *
 * @component
 * @param {Function} handleSearch
 */
function Searchbox({handleSearch, value = ''}: Props) {
  const [query, setQuery] = React.useState('')
  const [lastSearch, setLastSearch] = React.useState('')

  React.useEffect(() => {
    setQuery(value)
    setLastSearch(value)
  }, [value])

  function onSearchBtn() {
    if (lastSearch !== query) {
      setLastSearch(query)
      handleSearch(query)
    }
  }

  function onSearchInput(e: React.KeyboardEvent) {
    const isEnter = e.key && e.key === 'Enter'

    if (lastSearch !== query && isEnter) {
      setLastSearch(query)
      handleSearch(query)
    }
  }

  return (
    <div className="flex rounded-md shadow-sm">
      <div className="relative flex items-stretch flex-grow focus-within:z-10">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon
            className="h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          name="search"
          id="search-input"
          className="focus block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-50"
          placeholder="Buscar..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyPress={onSearchInput}
        />
      </div>
      <button
        id="search-btn"
        className={joinClasses(
          '-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-50 text-sm font-medium rounded-r-md focus',
          query === ''
            ? 'bg-gray-25 border-gray-50 border-2 border-solid text-gray-200 cursor-not-allowed'
            : 'bg-gray-25 border-gray-50 border-2 border-solid text-gray-600 hover:bg-gray-100',
        )}
        onClick={onSearchBtn}
        type="button"
        disabled={query === ''}
      >
        Buscar
      </button>
    </div>
  )
}

export {Searchbox}
