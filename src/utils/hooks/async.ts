import * as React from 'react'

const enum AsyncStatus {
  idle = 'idle',
  resolved = 'resolved',
  pending = 'pending',
  rejected = 'rejected',
}

export interface AsyncResponse<T> {
  isIdle: boolean
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  setData: (data: T) => void
  setError: (error: Error) => void
  error: Error
  status: AsyncStatus
  data: T
  run: (promise: Promise<T>) => Promise<T>
  reset: () => void
}

interface AsyncState<T = null> {
  data: T
  error: Error | null
  status: AsyncStatus
}

interface AsyncAction<T = null> {
  data?: T
  error?: Error | null
  status: AsyncStatus
}

function useSafeDispatch<T = null>(dispatch: React.Dispatch<AsyncAction<T>>) {
  const mounted = React.useRef(false)

  React.useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return React.useCallback(
    (args: AsyncAction<T>) => {
      return mounted.current ? dispatch({...args}) : void 0
    },
    [dispatch],
  )
}

const defaultInitialState: AsyncState = {
  status: AsyncStatus.idle,
  data: null,
  error: null,
}

const asyncReducer = <T>(s: AsyncState<T>, a: AsyncAction<T>) => ({...s, ...a})

/**
 * Hook to handle asynchronous, promise-based behavior.
 * It manages different statuses (see AsyncStatus) in order to get more
 * control over the live of the Promise
 *
 * @param initialState
 * @generic T is the data type to return from the promise, i.e. User
 */
function useAsync<T = null>(initialState?: AsyncState<T>): AsyncResponse<T> {
  const initialAsyncState = React.useMemo(
    () =>
      ({
        ...defaultInitialState,
        ...initialState,
      }) as AsyncState<T>,
    [initialState],
  )

  const initialStateRef = React.useRef(initialAsyncState)

  const [{status, data, error}, setState] = React.useReducer(
    asyncReducer<T>,
    initialAsyncState,
  )

  const safeSetState = useSafeDispatch<T>(setState)

  const setData = React.useCallback(
    (data: T) => safeSetState({data, status: AsyncStatus.resolved}),
    [safeSetState],
  )
  const setError = React.useCallback(
    (error: Error) => safeSetState({error, status: AsyncStatus.rejected}),
    [safeSetState],
  )
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState],
  )

  const run = React.useCallback(
    (promise: Promise<T>): Promise<T> => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        )
      }
      safeSetState({status: AsyncStatus.pending})
      return promise.then(
        (data: T) => {
          setData(data)
          return data
        },
        error => {
          setError(error)
          return Promise.reject(error)
        },
      )
    },
    [safeSetState, setData, setError],
  )

  return {
    isIdle: status === AsyncStatus.idle,
    isLoading: status === AsyncStatus.pending,
    isError: status === AsyncStatus.rejected,
    isSuccess: status === AsyncStatus.resolved,

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}

export {useAsync, AsyncStatus}
