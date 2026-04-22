import * as React from 'react'

import {FullPageSpinner} from '@lib/FullPageSpinner'
import {useAsync} from '@hooks/async'
import * as auth from '@utils/auth-provider'
import {User} from '@/types'

type Login = (username: string, password: string) => Promise<User>
type Logout = () => Promise<boolean>
type Me = () => Promise<User | null>
type PermissionByUser = () => Promise<Array<string>>

interface ContextState {
  user: User | null
  login: Login
  logout: Logout
  me: Me
  getPermissionByUser: PermissionByUser

  //updateMyUser: UpdateMyUser
}

type Props = {
  children: React.ReactNode
}

/**
 * Context for authentication
 */
const AuthContext = React.createContext<ContextState>({} as ContextState)
AuthContext.displayName = 'AuthContext'

/**
 * Auth provider that manages all operations related to authentication.
 *
 * NOTE: use the custom hook `useAuth` instead of calling `React.useContext`
 *
 * @param {React.ReactNode} children
 */
function AuthProvider(props: Props) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync<User | null>()

  React.useEffect(() => {
    const dataPromise = auth.bootstrapAppData()
    run(dataPromise)
  }, [run])

  const login = React.useCallback(
    (username: string, password: string): Promise<User> => {
      return auth.login(username, password).then((user: User) => {
        setData(user)
        return user
      })
    },
    [setData],
  )

  const logout = React.useCallback(() => {
    return auth.logout().then(response => {
      setData(null)
      return response
    })
  }, [setData])

  const me = React.useCallback(() => {
    return auth.bootstrapAppData().then(user => {
      setData(user)
      return user
    })
  }, [setData])

  const getPermissionByUser = React.useCallback((): Promise<Array<string>> => {
    return auth.permissionByUser().then(permission => {
      return permission
    })
  }, [])

  const value: ContextState = React.useMemo(
    () => ({
      user,
      login,
      logout,
      me,
      getPermissionByUser,
      //updateMyUser
    }),
    [
      user,
      login,
      logout,
      me,
      getPermissionByUser,
      //updateMyUser
    ],
  )

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return (
      <div>
        Ups, something went wrong! Please refresh the page {error.message}
      </div>
    )
  }
  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

/**
 * Returns the definition for `AuthContext`
 */
function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

export {AuthProvider, useAuth}
