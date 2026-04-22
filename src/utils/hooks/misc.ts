import {useLocation} from 'react-router'

/**
 * Gets utility methods to work with the query string of a URL
 */
function useLocationQuery() {
  return new URLSearchParams(useLocation().search)
}

export {useLocationQuery}
