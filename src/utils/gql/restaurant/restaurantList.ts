import {gql} from 'graphql-request'

export const restaurantList = gql`
  query restaurantsCollection($first: Int, $after: Cursor) {
    restaurantsCollection(first: $first, after: $after) {
      edges {
        node {
          id
          name
          slug
          created_at
          updated_at
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`
