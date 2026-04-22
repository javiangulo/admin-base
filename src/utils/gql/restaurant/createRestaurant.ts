import {gql} from 'graphql-request'

export const createRestaurant = gql`
  mutation createRestaurant($objects: [restaurantsInsertInput!]!) {
    insertIntorestaurantsCollection(objects: $objects) {
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
