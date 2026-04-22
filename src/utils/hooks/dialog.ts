import * as React from 'react'

import {useNavigate} from 'react-router-dom'

import {useLocationQuery} from '@hooks/misc'

type State = 'LOADING' | 'OPEN' | 'CLOSE'

/**
 * Handles the dialog state with redirect
 *
 * @param triggerShow
 */
function useDialogRoute(triggerShow: boolean) {
  const timeoutIdsRef = React.useRef<ReturnType<typeof setTimeout>[]>([])

  const history = useNavigate()
  const location = useLocationQuery()
  const [state, setState] = React.useState<State>('LOADING')

  React.useEffect(() => {
    if (triggerShow) {
      timeoutIdsRef.current.push(
        setTimeout(() => {
          setState('OPEN')
        }, 180),
      )
    }
    const intervals = timeoutIdsRef.current
    return () => {
      intervals.forEach(clearTimeout)
    }
  }, [triggerShow])

  function handleGoTo(queryGoTo = 'goTo') {
    const goTo = location.get(queryGoTo)
    if (goTo) {
      history(goTo)
    } else {
      history(-1)
    }
  }

  function dismissDialog(wait = 700) {
    setState('CLOSE')
    timeoutIdsRef.current.push(
      setTimeout(() => {
        handleGoTo()
      }, wait),
    )
  }

  return {
    state,
    dismissDialog,
    handleGoTo,
    isLoading: state === 'LOADING',
    isOpen: state === 'OPEN',
  }
}

const initialDialogState = {
  dialogSave: 'CLOSE',
  dialogDelete: 'CLOSE',
  dialogGuard: 'CLOSE',
  dialogActivate: 'CLOSE',
  dialogChiefIncomeEarner: 'CLOSE',
}

type DialogAction = {
  type:
    | 'SAVE'
    | 'DELETE'
    | 'GUARD'
    | 'ACTIVATE'
    | 'SET_CHIEF_INCOME_EARNER'
    | 'CLOSE_ALL'
  payload: 'OPEN' | 'CLOSE'
}
function dialogReducer(state: typeof initialDialogState, action: DialogAction) {
  switch (action.type) {
    case 'SAVE':
      return {...state, dialogSave: action.payload}
    case 'DELETE':
      return {...state, dialogDelete: action.payload}
    case 'GUARD':
      return {...state, dialogGuard: action.payload}
    case 'ACTIVATE':
      return {...state, dialogActivate: action.payload}
    case 'SET_CHIEF_INCOME_EARNER':
      return {...state, dialogChiefIncomeEarner: action.payload}
    case 'CLOSE_ALL':
      return initialDialogState
    default:
      return state
  }
}

/**
 * Handles the state open/close for generic dialogs showed in different
 * situations, e.g:
 *
 *  - Save Action
 *  - Route Guarde Action
 *
 * We can add more dialogs in the `dialogReducer`
 *
 * @param triggerShow
 */
function useDialogGeneric() {
  return React.useReducer(dialogReducer, initialDialogState)
}

export {useDialogRoute, useDialogGeneric}
