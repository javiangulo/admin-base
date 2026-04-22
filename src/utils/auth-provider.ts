import Cookies from 'universal-cookie'

import {client, gql} from './api-client'
import {User} from '@/types'

/**
 * Env variable for cookies
 */
const cookieDomain = import.meta.env.VITE_COOKIE_DOMAIN as string
const cookieName = import.meta.env.VITE_COOKIE_AUTH_NAME as string
const cookies = new Cookies()

/**
 * Gets token from cookie
 */
function getToken(): string | null {
  return cookies.get(cookieName)
}

/**
 * Removes cookie
 */
function removeToken(): void {
  cookies.remove(cookieName)
}

/**
 * Gets the user with session and store the token in a cookie
 *
 * @param {User} user User logged in
 */
function handleUserResponse(user: User): User {
  cookies.set(cookieName, user.token, {domain: cookieDomain})
  return user
}

/**
 * Logs in if credentials are ok
 *
 * @param {string} username user's username triyin to init session
 * @param {string} password user's password trying to init session
 */
async function login(username: string, password: string): Promise<User> {
  return await client<User>(gqlLogin, {username, password}).then(
    handleUserResponse,
  )
}

/**
 * Logs out current user
 */
async function logout(): Promise<boolean> {
  return await client<boolean>(gqlLogout).then(response => {
    removeToken()
    return response
  })
}

/**
 * Returns the current user if there is a valid session.
 */
async function bootstrapAppData(): Promise<User | null> {
  let user = null
  const token = getToken()
  if (token) {
    try {
      const data = await client<User>(gqlMe)
      user = {...data, token}
    } catch {
      removeToken()
    }
  }
  return user
}

/**
 * Returns the current user if there is a valid session.
 */
async function permissionByUser(): Promise<Array<string>> {
  return await client<Array<string>>(gqlPermissionByUser).then(permission => {
    return permission
  })
}

const gqlLogin = gql`
  mutation login($username: String!, $password: String!) {
    response: login(username: $username, password: $password, remember: true) {
      id: userId
      token
      email
      name
      lastname
      tokenExpiration
    }
  }
`

const gqlMe = gql`
  query {
    response: me {
      id
      name
      lastname
      phone
      email
      birthdate
      type
      roles {
        id
        name
        type
        app
      }
      files {
        id
        name
        type
        route
        mimetype
        encoding
        url
        butcket
        security
      }
      address {
        id
        streetName
        exterior
        interior
        suburb
        country
        countryCode
        state
        city
        zipcode
        created_at
        updated_at
      }
      active
      created_at
      updated_at
    }
  }
`

const gqlPermissionByUser = gql`
  query {
    response: permissionByUser
  }
`

const gqlLogout = gql`
  mutation logout {
    response: logout
  }
`

export {
  bootstrapAppData,
  permissionByUser,
  getToken,
  removeToken,
  login,
  logout,
}
