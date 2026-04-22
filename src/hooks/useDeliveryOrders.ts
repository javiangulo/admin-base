import {useEffect} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import backendClient from '@/lib/backendClient'
import type {OrderStatusLog} from '@/lib/database.types'

interface DeliveryOrder {
  id: string
  status: string
  total_amount: number
  note: string | null
  order_type: string
  customer_id: string | null
  delivery_address: string | null
  estimated_delivery_time: string | null
  created_at: string
  updated_at: string
  order_items: Array<{
    id: string
    display_name: string | null
    quantity: number
    unit_price: number
    total_price: number
  }>
  customers: {
    id: string
    name: string
    phone: string
    address: string | null
  } | null
}

export function useDeliveryOrders(restaurantId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!restaurantId) return

    const channel = backendClient
      .channel('delivery-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
          queryClient.invalidateQueries({queryKey: ['deliveryOrders', restaurantId]})
        },
      )
      .subscribe()

    return () => {
      backendClient.removeChannel(channel)
    }
  }, [restaurantId, queryClient])

  return useQuery({
    queryKey: ['deliveryOrders', restaurantId],
    queryFn: async () => {
      const {data, error} = await backendClient
        .from('orders')
        .select(`*, order_items(*), customers(*)`)
        .eq('restaurant_id', restaurantId)
        .in('order_type', ['delivery', 'pickup'])
        .not('status', 'in', '("delivered","canceled")')
        .order('created_at', {ascending: true})
      if (error) throw error
      return data as DeliveryOrder[]
    },
    enabled: !!restaurantId,
  })
}

interface CreateDeliveryOrderInput {
  restaurantId: string
  branchId?: string
  cashSessionId?: string
  orderType: 'delivery' | 'pickup'
  customerId?: string
  deliveryAddress?: string
  estimatedDeliveryTime?: string
  note?: string
  items: Array<{id: string; name: string; price: number; quantity: number; notes?: string}>
}

export function useCreateDeliveryOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateDeliveryOrderInput) => {
      const total = input.items.reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0,
      )

      // Create order via REST (supports new columns)
      const {data: order, error: orderError} = await backendClient
        .from('orders')
        .insert({
          restaurant_id: input.restaurantId,
          branch_id: input.branchId || null,
          cash_session_id: input.cashSessionId || null,
          status: 'pending',
          total_amount: total,
          currency: 'MXN',
          note: input.note || null,
          order_type: input.orderType,
          customer_id: input.customerId || null,
          delivery_address: input.deliveryAddress || null,
          estimated_delivery_time: input.estimatedDeliveryTime || null,
        })
        .select('id')
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = input.items.map(item => ({
        order_id: order.id,
        dish_id: item.id,
        display_name: item.notes ? `${item.name} (${item.notes})` : item.name,
        quantity: item.quantity,
        unit_price: Number(item.price || 0),
        total_price: Number(item.price || 0) * item.quantity,
        meta: item.notes ? {notes: item.notes} : {},
      }))

      const {error: itemsError} = await backendClient
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      return {orderId: order.id, total}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['orders']})
      queryClient.invalidateQueries({queryKey: ['kitchenOrders']})
      queryClient.invalidateQueries({queryKey: ['deliveryOrders']})
    },
  })
}

export function useOrderTimeline(orderId: string | null) {
  return useQuery({
    queryKey: ['orderTimeline', orderId],
    queryFn: async () => {
      if (!orderId) return []
      const {data, error} = await backendClient
        .from('order_status_logs')
        .select('*')
        .eq('order_id', orderId)
        .order('changed_at', {ascending: true})
      if (error) throw error
      return data as OrderStatusLog[]
    },
    enabled: !!orderId,
  })
}
