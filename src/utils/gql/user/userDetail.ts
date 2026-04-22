import {gql} from 'graphql-request'

export const userDetail = gql`
  query user($id: GraphQLObjectId!) {
    response: user(id: $id) {
      id
      username
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
      confirm
      confirmSms
      sendSms
      created_at
      updated_at
    }
  }
`
