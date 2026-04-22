import {gql} from 'graphql-request'

export const restaurantDetail = gql`
  query restaurantDetail($id: UUID!) {
    restaurantsCollection(filter: {id: {eq: $id}}, first: 1) {
      edges {
        node {
          id
          name
          slug
          created_at
          updated_at
        }
      }
    }
  }
`
