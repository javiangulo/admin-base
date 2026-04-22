import {useQuery} from '@tanstack/react-query'
import backendClient from '@/lib/backendClient'

const RESTAURANT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function startOfWeek(date: Date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function startOfMonth(date: Date) {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function useTodaySales() {
  return useQuery({
    queryKey: ['dashboard', 'todaySales'],
    queryFn: async () => {
      const today = startOfDay(new Date())
      const {data, error} = await backendClient
        .from('orders')
        .select('id, total_amount, order_type, created_at')
        .eq('restaurant_id', RESTAURANT_ID)
        .eq('status', 'delivered')
        .gte('created_at', today)

      if (error) throw error

      const total = (data || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
      const count = data?.length || 0
      const byType = {
        dine_in: 0,
        delivery: 0,
        pickup: 0,
      }
      for (const o of data || []) {
        const t = o.order_type as keyof typeof byType
        if (t in byType) byType[t] += Number(o.total_amount || 0)
      }

      return {total, count, byType}
    },
    refetchInterval: 30000,
  })
}

export function useWeekSales() {
  return useQuery({
    queryKey: ['dashboard', 'weekSales'],
    queryFn: async () => {
      const week = startOfWeek(new Date())
      const {data, error} = await backendClient
        .from('orders')
        .select('total_amount, created_at')
        .eq('restaurant_id', RESTAURANT_ID)
        .eq('status', 'delivered')
        .gte('created_at', week)

      if (error) throw error

      const total = (data || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0)

      // Group by day of week
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      const byDay = days.map(() => 0)
      for (const o of data || []) {
        const d = new Date(o.created_at).getDay()
        byDay[d] += Number(o.total_amount || 0)
      }

      return {total, count: data?.length || 0, byDay, days}
    },
    refetchInterval: 60000,
  })
}

export function useMonthSales() {
  return useQuery({
    queryKey: ['dashboard', 'monthSales'],
    queryFn: async () => {
      const month = startOfMonth(new Date())
      const {data, error} = await backendClient
        .from('orders')
        .select('total_amount')
        .eq('restaurant_id', RESTAURANT_ID)
        .eq('status', 'delivered')
        .gte('created_at', month)

      if (error) throw error

      const total = (data || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
      return {total, count: data?.length || 0}
    },
    refetchInterval: 60000,
  })
}

export function useActiveOrders() {
  return useQuery({
    queryKey: ['dashboard', 'activeOrders'],
    queryFn: async () => {
      const {data, error} = await backendClient
        .from('orders')
        .select('id, status, order_type, total_amount, note, created_at, customers(name, phone)')
        .eq('restaurant_id', RESTAURANT_ID)
        .not('status', 'in', '("delivered","canceled")')
        .order('created_at', {ascending: false})
        .limit(20)

      if (error) throw error
      return data || []
    },
    refetchInterval: 15000,
  })
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ['dashboard', 'recentOrders'],
    queryFn: async () => {
      const {data, error} = await backendClient
        .from('orders')
        .select('id, status, order_type, total_amount, note, created_at, order_items(display_name, quantity, unit_price)')
        .eq('restaurant_id', RESTAURANT_ID)
        .order('created_at', {ascending: false})
        .limit(10)

      if (error) throw error
      return data || []
    },
    refetchInterval: 30000,
  })
}

export function useLowStockItems() {
  return useQuery({
    queryKey: ['dashboard', 'lowStock'],
    queryFn: async () => {
      const {data, error} = await backendClient
        .from('inventory_items')
        .select('id, name, current_stock, minimum_stock, unit')
        .eq('restaurant_id', RESTAURANT_ID)
        .eq('is_active', true)

      if (error) throw error

      // Filter items where current_stock <= minimum_stock
      return (data || []).filter(
        item => Number(item.minimum_stock || 0) > 0 && Number(item.current_stock || 0) <= Number(item.minimum_stock || 0),
      )
    },
    refetchInterval: 60000,
  })
}

export function useTopProducts(period: 'today' | 'week' | 'month' = 'today') {
  return useQuery({
    queryKey: ['dashboard', 'topProducts', period],
    queryFn: async () => {
      const now = new Date()
      const since = period === 'week' ? startOfWeek(now) : period === 'month' ? startOfMonth(now) : startOfDay(now)

      // Get delivered order IDs for the period
      const {data: orders, error: ordersError} = await backendClient
        .from('orders')
        .select('id')
        .eq('restaurant_id', RESTAURANT_ID)
        .eq('status', 'delivered')
        .gte('created_at', since)

      if (ordersError) throw ordersError

      if (!orders || orders.length === 0) return []

      const orderIds = orders.map(o => o.id)

      const {data: items, error: itemsError} = await backendClient
        .from('order_items')
        .select('display_name, quantity, total_price')
        .in('order_id', orderIds)

      if (itemsError) throw itemsError

      // Aggregate by display_name
      const map = new Map<string, {name: string; qty: number; revenue: number}>()
      for (const item of items || []) {
        const name = item.display_name || 'Sin nombre'
        const existing = map.get(name)
        if (existing) {
          existing.qty += item.quantity
          existing.revenue += Number(item.total_price || 0)
        } else {
          map.set(name, {name, qty: item.quantity, revenue: Number(item.total_price || 0)})
        }
      }

      return Array.from(map.values())
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5)
    },
    refetchInterval: 60000,
  })
}
