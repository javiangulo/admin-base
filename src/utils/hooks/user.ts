import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useParams} from 'react-router-dom'

import {client} from '@utils/api-client'
import {
  createUser,
  deleteUser,
  userDetail,
  updateUser,
  userAutocomplete,
} from '@gql/user'
import {
  User,
  UserForm,
  PaginationParams,
  RequestWithPagination,
  UserFormEdit,
  UserFilterState,
} from '@/types'

type QueryUsersFilters = Pick<UserFilterState, 'status' | 'type'>

/**
 * Gets the user list paginated
 *
 * @param {PaginationParams} params Params for the pagination
 */
function useUserList(filters: UserFilterState) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['user', 'list', filters],
    queryFn: () => {
      const {status, type, ...params} = filters
      return fetchUsers(params, {
        status,
        type,
      })
    },
    // keepPreviousData: true,
    select: data => {
      const items = data.data ?? []
      for (const item of items) {
        queryClient.setQueryData(['user', 'detail', item.id], item)
      }

      return {
        users: data.data,
        pagination: data.params,
      }
    },
  })
}

/**
 * Gets a single user by id
 *
 * @param {string} id User's id to get the data
 */
function useUser(id: string) {
  return useQuery({
    queryKey: ['user', 'detail', id],
    queryFn: () => fetchUser(id),
    enabled: id !== '',
  })
}

/**
 * Creates a user
 */
function useCreateUser() {
  return useMutation((data: UserForm) => fetchCreateUser(data))
}

/**
 * Updates a user
 */
function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation((data: UserFormEdit) => fetchUpdateUser(data), {
    onSuccess(user) {
      queryClient.invalidateQueries(['user', 'detail', user.id])
    },
  })
}

/**
 * Gets a user by `:id` parameter from the route
 */
function useUserByIdParam() {
  const {id} = useParams<{id: string}>()
  return useUser(id || '')
}

/**
 * Deletes a user
 */
function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation((id: string) => fetchDeleteUser(id), {
    onSuccess() {
      queryClient.invalidateQueries(['user', 'list'])
    },
  })
}

type SetRolesToUserType = {id: string; rolesId: string[]}

/**
 * Sets the roles to a user
 */
function useSetRolesToUser() {
  const queryClient = useQueryClient()
  return useMutation(
    (data: SetRolesToUserType) => fetchSetRolesToUser(data).then(() => data.id),
    {
      onSuccess(id) {
        queryClient.invalidateQueries(['user', id])
      },
    },
  )
}

function useRefetchUser(id: string) {
  const queryClient = useQueryClient()

  return () => queryClient.invalidateQueries(['user', 'detail', id])
}

/*
 * Gets the user contract history list paginated
 *
 * @param {PaginationParams} params Params for the pagination
 */
function useUserContractHistory(userId: string, params: PaginationParams) {
  return useQuery({
    queryKey: ['user', 'contractHistory', userId, params],
    queryFn: () => fetchUserContractHistory(userId, params),
    // keepPreviousData: true,
    select: data => {
      return {
        contracts: data.data,
        pagination: data.params,
      }
    },
  })
}

function fetchUsers(params: PaginationParams, extraFilters: QueryUsersFilters) {
  return client<RequestWithPagination<User>>(userList, {
    params,
    ...extraFilters,
  })
}

function fetchUser(id: string) {
  return client<User>(userDetail, {id})
}

function fetchSetRolesToUser(data: SetRolesToUserType) {
  return client<boolean>(setRolesToUser, data)
}

function fetchCsvUsers(date: string) {
  return client<string>(csvUsersList, {date})
}

function fetchCreateUser(data: UserForm) {
  return client<User>(createUser, data)
}

function fetchUpdateUser(data: UserFormEdit) {
  const {confirmSms, confirm, ...rest} = data
  return client<User>(updateUser, {
    ...rest,
    confirm: confirm === 'CONFIRM_ACCOUNT' ? true : undefined,
    confirmSms: confirmSms === 'CONFIRM_ACCOUNT' ? true : undefined,
  })
}

function fetchDeleteUser(id: string) {
  return client<boolean>(deleteUser, {id})
}

function fetchUserAutocomplete(search: string) {
  return client<Array<User>>(userAutocomplete, {search}).then(users =>
    users.map(user => ({
      label: `${user.name} ${user.lastname} (${user.email})`,
      value: user.id,
    })),
  )
}

function usePermissionByUser() {
  return useQuery({
    queryKey: ['permission', 'user'],
    queryFn: () => fetchPermissionByUser(),
  })
}

function fetchPermissionByUser() {
  return client<string[]>(permissionByUser)
}

export {
  fetchCsvUsers,
  fetchSetRolesToUser,
  fetchUser,
  fetchUserAutocomplete,
  useUserList,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useRefetchUser,
  useSetRolesToUser,
  useUser,
  useUserByIdParam,
  useUserContractHistory,
  usePermissionByUser,
}
