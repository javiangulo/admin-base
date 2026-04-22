import {gql} from 'graphql-request'

export const userAutocomplete = gql`
  query userAutocomplete($search: String!) {
    response: userAutocomplete(search: $search) {
      id
      name
      lastname
      email
    }
  }
`
