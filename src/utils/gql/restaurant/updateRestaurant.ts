import {gql} from 'graphql-request'

export const updateRestaurant = gql`
  mutation updateRestaurant($id: UUID!, $set: restaurantsUpdateInput!) {
    updaterestaurantsCollection(filter: {id: {eq: $id}}, set: $set) {
      records {
        id
        name
        slug
        created_at
        updated_at
      }
    }
  }
`
