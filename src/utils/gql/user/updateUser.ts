import {gql} from 'graphql-request'

export const updateUser = gql`
  mutation updateUser(
    $id: GraphQLObjectId!
    $name: String!
    $lastname: String!
    $birthdate: String!
    $phone: String!
    $email: String!
    $type: UserType!
    $confirm: Boolean
    $confirmSms: Boolean
  ) {
    response: updateUser(
      id: $id
      name: $name
      lastname: $lastname
      birthdate: $birthdate
      phone: $phone
      email: $email
      type: $type
      confirm: $confirm
      confirmSms: $confirmSms
    ) {
      id
    }
  }
`
