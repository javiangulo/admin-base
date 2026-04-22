/* eslint-disable no-prototype-builtins */
import {GraphQLClient, gql} from 'graphql-request'
import {RequestDocument, Variables} from 'graphql-request'

import {getToken} from './auth-provider'

/**
 * Env variables for GraphQL
 */
const endpoint = import.meta.env.VITE_GRAPHQL_URL as string

/**
 * Initis GraphQLClient with the endpoint
 */
const gqlClient = new GraphQLClient(endpoint, {
  headers: {},
})

/**
 * Request a petition to the backend, if returns a Promise with the endpoint data
 * or a Promise rejection just in case of a error.
 *
 * @param {RequestDocument} request
 * @param {Variables} variables
 * @param options
 * @param showError
 */
async function client<ResponseType = unknown>(
  request: RequestDocument,
  variables?: Variables,
  options?: {errorMessage?: string; upload?: boolean},
  showError = true,
): Promise<ResponseType> {
  try {
    const token = getToken()
    if (options?.upload) {
      gqlClient.setHeader('Apollo-Require-Preflight', 'true')
    }
    if (token) {
      gqlClient.setHeader('authorization', `Bearer ${token}`)
    }
    gqlClient.setHeader('pathname', window.location.pathname)
    const data: any = await gqlClient.request(request, variables)
    /**
     * This validation detects if the Graphql query/mutation has the key `response`
     * in the result, if does then returns the `response` object
     */
    if (data.hasOwnProperty('response')) return data.response
    return data
  } catch (error: any) {
    if (showError) {
      throw new Error(
        options?.errorMessage ?? error?.response?.errors[0].message,
      )
    } else return options?.errorMessage ?? error?.response?.errors[0].message
  }
}

export {client, gql}
