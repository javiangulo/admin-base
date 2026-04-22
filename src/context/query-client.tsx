import * as React from 'react'

import {
  QueryClient,
  QueryClientProvider as RQProvider,
} from '@tanstack/react-query'

type Props = {
  children: React.ReactNode
}

function useConstant(initializer: () => QueryClient) {
  return React.useState(initializer)[0]
}

/**
 * Custome provider for React Query, sets some default options for
 * mutations and queries
 *
 * @param {React.ReactNode} children
 */
function QueryClientProvider({children}: Props) {
  const queryClient = useConstant(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          // useErrorBoundary: true,
          refetchOnWindowFocus: false,
          retry(failureCount: number, error: unknown) {
            const status =
              typeof error === 'object' &&
              error !== null &&
              'status' in error &&
              typeof (error as {status?: unknown}).status === 'number'
                ? (error as {status: number}).status
                : undefined
            if (status === 404) return false
            else if (failureCount < 2) return true
            else return false
          },
        },
        mutations: {
          //   onError: (err, variables, recover) =>
          //     typeof recover === 'function' ? recover() : null,
        },
      },
    })
    return client
  })

  return <RQProvider client={queryClient}>{children}</RQProvider>
}

export {QueryClientProvider}
