import {gql} from 'graphql-request'

export const deleteRestaurant = gql`
  mutation deleteRestaurant($id: UUID!) {
    deleteFromrestaurantsCollection(filter: {id: {eq: $id}}) {
      records {
        id
      }
    }
  }
`
