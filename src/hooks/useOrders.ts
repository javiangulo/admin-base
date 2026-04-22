import {useEffect} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {gql} from 'graphql-request'
import graphqlClient from '@/lib/graphql'
import backendClient from '@/lib/backendClient'
import type {Order, OrderItem} from '@/lib/database.types'

// ==================== Mutations ====================

const CREATE_ORDER = gql`
  mutation CreateOrder($input: ordersInsertInput!) {
    insertIntoordersCollection(objects: [$input]) {
      records {
        id
        status
        total_amount
        created_at
      }
    }
  }
`

const CREATE_ORDER_ITEMS = gql`
  mutation CreateOrderItems($items: [order_itemsInsertInput!]!) {
    insertIntoorder_itemsCollection(objects: $items) {
      records {
        id
        dish_id
        quantity
        unit_price
        total_price
      }
    }
  }
`

const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: UUID!, $status: String!) {
    updateordersCollection(
      filter: {id: {eq: $id}}
      set: {status: $status, updated_at: "now()"}
    ) {
      records {
        id
        status
        updated_at
      }
    }
  }
`

const GET_ORDERS = gql`
  query GetOrders($restaurantId: UUID!, $status: String) {
    ordersCollection(
      filter: {restaurant_id: {eq: $restaurantId}, status: {eq: $status}}
      orderBy: [{created_at: DescNullsLast}]
    ) {
      edges {
        node {
          id
          status
          total_amount
          currency
          note
          created_at
          order_itemsCollection {
            edges {
              node {
                id
                display_name
                quantity
                unit_price
                total_price
              }
            }
          }
        }
      }
    }
  }
`

interface TicketItem {
  id: string
  name: string
  price: number
  quantity: number
  notes?: string
}

// ==================== Hooks ====================

export function useOrders(restaurantId: string, status?: string) {
  return useQuery({
    queryKey: ['orders', restaurantId, status],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        ordersCollection: {
          edges: Array<{
            node: Order & {
              order_itemsCollection: {
                edges: Array<{node: OrderItem}>
              }
            }
          }>
        }
      }>(GET_ORDERS, {restaurantId, status})

      return data.ordersCollection.edges.map(edge => ({
        ...edge.node,
        items: edge.node.order_itemsCollection.edges.map(e => e.node),
      }))
    },
    enabled: !!restaurantId,
  })
}

const GET_TABLE_ORDERS = gql`
  query GetTableOrders($tableId: UUID!) {
    ordersCollection(
      filter: {table_id: {eq: $tableId}, status: {neq: "delivered"}}
      orderBy: [{created_at: DescNullsLast}]
    ) {
      edges {
        node {
          id
          status
          total_amount
          currency
          note
          created_at
          order_itemsCollection {
            edges {
              node {
                id
                display_name
                quantity
                unit_price
                total_price
              }
            }
          }
        }
      }
    }
  }
`

export function useTableOrders(tableId: string | undefined) {
  return useQuery({
    queryKey: ['tableOrders', tableId],
    queryFn: async () => {
      if (!tableId) return []
      const data = await graphqlClient.request<{
        ordersCollection: {
          edges: Array<{
            node: Order & {
              order_itemsCollection: {
                edges: Array<{node: OrderItem}>
              }
            }
          }>
        }
      }>(GET_TABLE_ORDERS, {tableId})

      return data.ordersCollection.edges.map(edge => ({
        ...edge.node,
        items: edge.node.order_itemsCollection.edges.map(e => e.node),
      }))
    },
    enabled: !!tableId,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      restaurantId,
      branchId,
      tableId,
      cashSessionId,
      items,
      note,
      orderType = 'dine_in',
      customerId,
      deliveryAddress,
      estimatedDeliveryTime,
    }: {
      restaurantId: string
      branchId?: string
      tableId?: string
      cashSessionId?: string
      items: TicketItem[]
      note?: string
      orderType?: 'dine_in' | 'delivery' | 'pickup'
      customerId?: string
      deliveryAddress?: string
      estimatedDeliveryTime?: string
    }) => {
      const total = items.reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0,
      )

      // Crear la orden
      const orderData = await graphqlClient.request<{
        insertIntoordersCollection: {
          records: Array<{id: string}>
        }
      }>(CREATE_ORDER, {
        input: {
          restaurant_id: restaurantId,
          branch_id: branchId,
          table_id: tableId,
          cash_session_id: cashSessionId,
          status: 'pending',
          total_amount: String(total),
          currency: 'MXN',
          note,
          order_type: orderType,
          customer_id: customerId || null,
          delivery_address: deliveryAddress || null,
          estimated_delivery_time: estimatedDeliveryTime || null,
        },
      })

      const orderId = orderData.insertIntoordersCollection.records[0].id

      // Crear los items de la orden
      const orderItems = items.map(item => ({
        order_id: orderId,
        dish_id: item.id,
        display_name: item.notes ? `${item.name} (${item.notes})` : item.name,
        quantity: item.quantity,
        unit_price: String(Number(item.price || 0)),
        total_price: String(Number(item.price || 0) * item.quantity),
        meta: item.notes ? {notes: item.notes} : {},
      }))

      await graphqlClient.request(CREATE_ORDER_ITEMS, {items: orderItems})

      return {orderId, total}
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['orders']})
      queryClient.invalidateQueries({queryKey: ['deliveryOrders']})
      if (variables.tableId) {
        queryClient.invalidateQueries({
          queryKey: ['tableOrders', variables.tableId],
        })
      }
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      previousStatus,
    }: {
      orderId: string
      previousStatus?: string
    }) => {
      const data = await graphqlClient.request<{
        updateordersCollection: {
          records: Array<{id: string; status: string}>
        }
      }>(UPDATE_ORDER_STATUS, {id: orderId, status: 'canceled'})

      await backendClient.from('order_status_logs').insert({
        order_id: orderId,
        previous_status: previousStatus ?? null,
        new_status: 'canceled',
      })

      return data.updateordersCollection.records[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['orders']})
      queryClient.invalidateQueries({queryKey: ['tableOrders']})
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      previousStatus,
    }: {
      orderId: string
      status:
        | 'pending'
        | 'confirmed'
        | 'preparing'
        | 'ready'
        | 'assigned'
        | 'on_the_way'
        | 'delivered'
        | 'canceled'
      previousStatus?: string
    }) => {
      const data = await graphqlClient.request<{
        updateordersCollection: {
          records: Array<{id: string; status: string}>
        }
      }>(UPDATE_ORDER_STATUS, {id: orderId, status})

      await backendClient.from('order_status_logs').insert({
        order_id: orderId,
        previous_status: previousStatus ?? null,
        new_status: status,
      })

      return data.updateordersCollection.records[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['orders']})
      queryClient.invalidateQueries({queryKey: ['tableOrders']})
      queryClient.invalidateQueries({queryKey: ['kitchenOrders']})
      queryClient.invalidateQueries({queryKey: ['deliveryOrders']})
    },
  })
}

export function useKitchenOrders(restaurantId: string) {
  const queryClient = useQueryClient()

  // Realtime listener: invalidate on any INSERT/UPDATE/DELETE on orders table
  useEffect(() => {
    if (!restaurantId) return

    const channel = backendClient
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['kitchenOrders', restaurantId],
          })
        },
      )
      .subscribe()

    return () => {
      backendClient.removeChannel(channel)
    }
  }, [restaurantId, queryClient])

  return useQuery({
    queryKey: ['kitchenOrders', restaurantId],
    queryFn: async () => {
      const {data, error} = await backendClient
        .from('orders')
        .select(`*, order_items(*), customers(name, phone)`)
        .eq('restaurant_id', restaurantId)
        .in('status', ['pending', 'confirmed', 'preparing'])
        .order('created_at', {ascending: true})
      if (error) throw error
      return data
    },
    enabled: !!restaurantId,
  })
}
