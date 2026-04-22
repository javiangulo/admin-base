import {PaginationParams, UserTypes} from '.'

interface User {
  id: string
  username: string
  name: string
  lastname: string
  birthdate: string
  email: string
  phone: string
  token: string
  type: UserTypes
  confirm: boolean
  confirmSms: boolean
  sendSms: boolean
  userReferred: User
  created_at: string
  updated_at: string
}

type UserFilterActions = {type: 'RESET'}

type UserFilterState = PaginationParams & {
  status: string
  type: string
}

type UserWaitingFilterState = PaginationParams

type UserWaitingFilterActions = {type: 'RESET'}

type UserStatusFilterActions = {type: 'RESET'}

type userStatusFilterState = PaginationParams

type UserForm = Pick<
  User,
  'name' | 'lastname' | 'phone' | 'birthdate' | 'email' | 'username'
> & {
  confirmEmail: string
  password: string
  confirmPassword: string
}

type UserFormEdit = Pick<
  User,
  'id' | 'name' | 'lastname' | 'birthdate' | 'phone' | 'email' | 'username'
> & {
  confirmEmail: string
  type?: '' | string
  confirm?: '' | string
  confirmSms?: '' | string
}

type UserContractHistoryFilterActions = {type: 'RESET'}

type UserContractHistoryFilterState = PaginationParams

export type {
  User,
  UserForm,
  UserFormEdit,
  UserFilterActions,
  UserFilterState,
  UserWaitingFilterState,
  UserWaitingFilterActions,
  UserStatusFilterActions,
  userStatusFilterState,
  UserContractHistoryFilterActions,
  UserContractHistoryFilterState,
}
