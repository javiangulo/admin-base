import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import backendClient from '@/lib/backendClient'
import type {Table, TableStatus} from '@/lib/database.types'

// Hook para obtener las mesas de una sucursal
export function useTables(branchId?: string) {
  return useQuery({
    queryKey: ['tables', branchId],
    queryFn: async () => {
      let query = backendClient
        .from('tables')
        .select('*')
        .eq('is_active', true)
        .order('position', {ascending: true})

      if (branchId) {
        query = query.eq('branch_id', branchId)
      }

      const {data, error} = await query

      if (error) throw error
      return data as Table[]
    },
  })
}

// Hook para actualizar el estado de una mesa
export function useUpdateTableStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      tableId,
      status,
    }: {
      tableId: string
      status: TableStatus
    }) => {
      const {data, error} = await backendClient
        .from('tables')
        .update({status, updated_at: new Date().toISOString()})
        .eq('id', tableId)
        .select()
        .single()

      if (error) throw error
      return data as Table
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tables']})
    },
  })
}

// Hook para crear una nueva mesa
export function useCreateTable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      branchId,
      name,
      capacity = 4,
    }: {
      branchId: string
      name: string
      capacity?: number
    }) => {
      // Obtener la posición máxima actual
      const {data: tables} = await backendClient
        .from('tables')
        .select('position')
        .eq('branch_id', branchId)
        .order('position', {ascending: false})
        .limit(1)

      const nextPosition = tables && tables.length > 0 ? tables[0].position + 1 : 0

      const {data, error} = await backendClient
        .from('tables')
        .insert({
          branch_id: branchId,
          name,
          capacity,
          status: 'available',
          position: nextPosition,
        })
        .select()
        .single()

      if (error) throw error
      return data as Table
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tables']})
    },
  })
}
