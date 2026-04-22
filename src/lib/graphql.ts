import {GraphQLClient} from 'graphql-request'

const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_URL || '/graphql'

export const graphqlClient = new GraphQLClient(graphqlEndpoint, {
  headers: {},
})

// Helper para actualizar el token de autenticación
export const setAuthToken = (token: string) => {
  graphqlClient.setHeader('Authorization', `Bearer ${token}`)
}

// Helper para requests con token dinámico
export const createAuthenticatedClient = (token: string) => {
  return new GraphQLClient(graphqlEndpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export default graphqlClient
