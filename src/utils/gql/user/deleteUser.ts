import {gql} from 'graphql-request'

export const deleteUser = gql`
  mutation deleteUser($id: GraphQLObjectId!) {
    deleteUser(id: $id)
  }
`
