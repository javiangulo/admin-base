import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import backendClient from '@/lib/backendClient'
import type {
  CashRegister,
  CashSession,
  CashMovement,
  CashMovementType,
} from '@/lib/database.types'

// ==================== Cash Registers ====================

export function useCashRegisters(branchId?: string) {
  return useQuery({
    queryKey: ['cashRegisters', branchId],
    queryFn: async () => {
      let query = backendClient
        .from('cash_registers')
        .select('*')
        .eq('is_active', true)
        .order('position', {ascending: true})

      if (branchId) {
        query = query.eq('branch_id', branchId)
      }

      const {data, error} = await query

      if (error) throw error
      return data as CashRegister[]
    },
  })
}

// ==================== Cash Sessions ====================

export function useCurrentSession(cashRegisterId?: string) {
  return useQuery({
    queryKey: ['currentCashSession', cashRegisterId],
    queryFn: async () => {
      if (!cashRegisterId) return null

      const {data, error} = await backendClient
        .from('cash_sessions')
        .select('*')
        .eq('cash_register_id', cashRegisterId)
        .eq('status', 'open')
        .order('opened_at', {ascending: false})
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
      return data as CashSession | null
    },
    enabled: !!cashRegisterId,
  })
}

export function useCashSessions(cashRegisterId?: string) {
  return useQuery({
    queryKey: ['cashSessions', cashRegisterId],
    queryFn: async () => {
      if (!cashRegisterId) return []

      const {data, error} = await backendClient
        .from('cash_sessions')
        .select('*')
        .eq('cash_register_id', cashRegisterId)
        .order('opened_at', {ascending: false})
        .limit(50)

      if (error) throw error
      return data as CashSession[]
    },
    enabled: !!cashRegisterId,
  })
}

// Hook para obtener todas las sesiones de caja (para reportes)
export function useAllCashSessions(branchId?: string) {
  return useQuery({
    queryKey: ['allCashSessions', branchId],
    queryFn: async () => {
      let query = backendClient
        .from('cash_sessions')
        .select(`
          *,
          cash_registers (
            id,
            name,
            branch_id
          )
        `)
        .order('opened_at', {ascending: false})
        .limit(100)

      const {data, error} = await query

      if (error) throw error

      // Filtrar por branch_id si se proporciona
      if (branchId) {
        return (data as any[]).filter(
          session => session.cash_registers?.branch_id === branchId
        )
      }

      return data as (CashSession & {cash_registers: {id: string; name: string; branch_id: string}})[]
    },
  })
}

export function useOpenCashSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      cashRegisterId,
      openedBy,
      openingAmount,
    }: {
      cashRegisterId: string
      openedBy: string
      openingAmount: number
    }) => {
      const {data, error} = await backendClient
        .from('cash_sessions')
        .insert({
          cash_register_id: cashRegisterId,
          opened_by: openedBy,
          opening_amount: openingAmount,
          status: 'open',
        })
        .select()
        .single()

      if (error) throw error
      return data as CashSession
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['currentCashSession', variables.cashRegisterId]})
      queryClient.invalidateQueries({queryKey: ['cashSessions', variables.cashRegisterId]})
    },
  })
}

export function useCloseCashSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      closedBy,
      closingAmount,
      expectedAmount,
      notes,
    }: {
      sessionId: string
      closedBy: string
      closingAmount: number
      expectedAmount: number
      notes?: string
    }) => {
      const difference = closingAmount - expectedAmount

      const {data, error} = await backendClient
        .from('cash_sessions')
        .update({
          closed_by: closedBy,
          closing_amount: closingAmount,
          expected_amount: expectedAmount,
          difference,
          status: 'closed',
          closed_at: new Date().toISOString(),
          notes,
        })
        .eq('id', sessionId)
        .select()
        .single()

      if (error) throw error
      return data as CashSession
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['currentCashSession']})
      queryClient.invalidateQueries({queryKey: ['cashSessions']})
    },
  })
}

// ==================== Cash Movements ====================

export function useCashMovements(sessionId?: string) {
  return useQuery({
    queryKey: ['cashMovements', sessionId],
    queryFn: async () => {
      if (!sessionId) return []

      const {data, error} = await backendClient
        .from('cash_movements')
        .select('*')
        .eq('cash_session_id', sessionId)
        .order('created_at', {ascending: false})

      if (error) throw error
      return data as CashMovement[]
    },
    enabled: !!sessionId,
  })
}

export function useCreateCashMovement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      orderId,
      type,
      amount,
      paymentMethod,
      description,
      performedBy,
    }: {
      sessionId: string
      orderId?: string
      type: CashMovementType
      amount: number
      paymentMethod?: string
      description?: string
      performedBy: string
    }) => {
      const {data, error} = await backendClient
        .from('cash_movements')
        .insert({
          cash_session_id: sessionId,
          order_id: orderId,
          type,
          amount,
          payment_method: paymentMethod,
          description,
          performed_by: performedBy,
        })
        .select()
        .single()

      if (error) throw error
      return data as CashMovement
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['cashMovements', variables.sessionId]})
    },
  })
}

// ==================== Session Summary ====================

export function useSessionSummary(sessionId?: string) {
  const {data: movements = []} = useCashMovements(sessionId)

  const summary = {
    sales: {cash: 0, card: 0, digital: 0, total: 0},
    withdrawals: 0,
    deposits: 0,
    refunds: 0,
    tips: 0,
    totalCash: 0,
  }

  movements.forEach(movement => {
    const amount = Number(movement.amount || 0)
    switch (movement.type) {
      case 'sale':
        summary.sales.total += amount
        if (movement.payment_method === 'cash') {
          summary.sales.cash += amount
          summary.totalCash += amount
        } else if (movement.payment_method === 'card') {
          summary.sales.card += amount
        } else if (movement.payment_method === 'digital') {
          summary.sales.digital += amount
        }
        break
      case 'withdrawal':
        summary.withdrawals += amount
        summary.totalCash -= amount
        break
      case 'deposit':
        summary.deposits += amount
        summary.totalCash += amount
        break
      case 'refund':
        summary.refunds += amount
        summary.totalCash -= amount
        break
      case 'tip':
        summary.tips += amount
        if (movement.payment_method === 'cash') {
          summary.totalCash += amount
        }
        break
    }
  })

  return summary
}
