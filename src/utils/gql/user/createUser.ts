import {gql} from 'graphql-request'

const createUser = gql`
  mutation createUserAdmin(
    $name: String!
    $lastname: String!
    $birthdate: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $phone: String!
    $type: UserType!
  ) {
    response: createUserAdmin(
      name: $name
      lastname: $lastname
      birthdate: $birthdate
      email: $email
      password: $password
      confirmPassword: $confirmPassword
      phone: $phone
      type: $type
    ) {
      id
    }
  }
`
export {createUser}
