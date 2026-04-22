import {useState, useEffect} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import backendClient from '@/lib/backendClient'
import type {Customer} from '@/lib/database.types'

export function useSearchCustomers(restaurantId: string, query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  return useQuery({
    queryKey: ['customers', restaurantId, debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return []
      const {data, error} = await backendClient
        .from('customers')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .or(`name.ilike.%${debouncedQuery}%,phone.ilike.%${debouncedQuery}%`)
        .order('name')
        .limit(10)
      if (error) throw error
      return data as Customer[]
    },
    enabled: !!restaurantId && debouncedQuery.length >= 2,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      restaurant_id: string
      name: string
      phone: string
      street?: string
      house_number?: string
      postal_code?: string
      address?: string
      reference?: string
      notes?: string
    }) => {
      const {data, error} = await backendClient
        .from('customers')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as Customer
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['customers']})
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id, ...updates}: {id: string; name?: string; phone?: string; street?: string; house_number?: string; postal_code?: string; address?: string; reference?: string; notes?: string}) => {
      const {data, error} = await backendClient
        .from('customers')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Customer
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['customers']})
    },
  })
}
