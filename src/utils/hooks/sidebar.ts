import * as React from 'react'

/**
 * Actions allowed to use
 */
export const enum sidebarActions {
  'TOGGLE' = 'TOGGLE',
  'OPEN_WHEN_COLLAPSED' = 'OPEN_WHEN_COLLAPSED',
  'CLOSE_WHEN_COLLAPSED' = 'CLOSE_WHEN_COLLAPSED',
}

const defaultState = {show: true, collapse: false}

/**
 * Reducer to apply different states to the sidebar
 *
 * @param {status
 * @param action
 */
function sidebar(
  status: typeof defaultState,
  action: keyof typeof sidebarActions,
) {
  switch (action) {
    case sidebarActions.TOGGLE:
      return {collapse: !status.collapse, show: !status.show}
    case sidebarActions.OPEN_WHEN_COLLAPSED:
      return {collapse: true, show: true}
    case sidebarActions.CLOSE_WHEN_COLLAPSED:
      return {collapse: true, show: false}
    default:
      return status
  }
}

/**
 * Hook to control sidebar's state
 *
 * @param {typeof defaultState} initialState
 */
function useSidebar(initialState = defaultState) {
  const [state, dispatch] = React.useReducer(sidebar, initialState)

  return {state, dispatch}
}

export {useSidebar}
