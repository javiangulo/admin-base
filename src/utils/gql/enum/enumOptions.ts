import {gql} from '@utils/api-client'

export const enumOptions = (enumName: string) => gql`
  query types {
    response: enumTypes(name: "${enumName}") {
      options {
        label
        value
      }
    }
  }
`
