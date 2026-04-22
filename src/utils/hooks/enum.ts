import {useQuery} from '@tanstack/react-query'

import {enumOptions} from '@gql/enum'
import {client} from '@utils/api-client'
import {EnumOptions} from '@/types/enum'

/**
 * Returns the set of values for a specific enum, only use for graphql enums
 *
 * @param {string} enumName The enum's name
 */
function useEnumOptions(enumName: string) {
  return useQuery({
    queryKey: ['enum', 'options', enumName],
    queryFn: () => fetchEnumOptions(enumName),
  })
}

function fetchEnumOptions(enumName: string) {
  return client<EnumOptions>(enumOptions(enumName))
}

export {useEnumOptions, fetchEnumOptions}
