import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import backendClient from '@/lib/backendClient'
import type {
  InventoryCategory,
  InventoryItem,
  InventoryMovement,
  InventoryAdjustment,
  InventoryItemWithCategory,
  InventoryMovementType,
  InventoryUnit,
} from '@/lib/database.types'

// ==================== Categories ====================

export function useInventoryCategories(restaurantId: string) {
  return useQuery({
    queryKey: ['inventoryCategories', restaurantId],
    queryFn: async () => {
      const {data, error} = await backendClient
        .from('inventory_categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .order('position', {ascending: true})

      if (error) throw error
      return data as InventoryCategory[]
    },
    enabled: !!restaurantId,
  })
}

export function useCreateInventoryCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      restaurantId,
      name,
      description,
      color,
    }: {
      restaurantId: string
      name: string
      description?: string
      color?: string
    }) => {
      const {data, error} = await backendClient
        .from('inventory_categories')
        .insert({
          restaurant_id: restaurantId,
          name,
          description,
          color: color || '#6B7280',
        })
        .select()
        .single()

      if (error) throw error
      return data as InventoryCategory
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['inventoryCategories', variables.restaurantId]})
    },
  })
}

export function useUpdateInventoryCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      color,
    }: {
      id: string
      name?: string
      description?: string
      color?: string
    }) => {
      const {data, error} = await backendClient
        .from('inventory_categories')
        .update({name, description, color})
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as InventoryCategory
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['inventoryCategories']})
    },
  })
}

export function useDeleteInventoryCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const {error} = await backendClient
        .from('inventory_categories')
        .update({is_active: false})
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['inventoryCategories']})
    },
  })
}

// ==================== Items ====================

export function useInventoryItems(restaurantId: string, categoryId?: string) {
  return useQuery({
    queryKey: ['inventoryItems', restaurantId, categoryId],
    queryFn: async () => {
      let query = backendClient
        .from('inventory_items')
        .select(`
          *,
          inventory_categories (
            id,
            name,
            color
          )
        `)
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .order('position', {ascending: true})

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const {data, error} = await query

      if (error) throw error
      return data as InventoryItemWithCategory[]
    },
    enabled: !!restaurantId,
  })
}

export function useInventoryItem(itemId: string) {
  return useQuery({
    queryKey: ['inventoryItem', itemId],
    queryFn: async () => {
      const {data, error} = await backendClient
        .from('inventory_items')
        .select(`
          *,
          inventory_categories (
            id,
            name,
            color
          )
        `)
        .eq('id', itemId)
        .single()

      if (error) throw error
      return data as InventoryItemWithCategory
    },
    enabled: !!itemId,
  })
}

export function useLowStockItems(restaurantId: string) {
  return useQuery({
    queryKey: ['lowStockItems', restaurantId],
    queryFn: async () => {
      const {data, error} = await backendClient
        .from('inventory_items')
        .select(`
          *,
          inventory_categories (
            id,
            name,
            color
          )
        `)
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .filter('current_stock', 'lte', 'minimum_stock')
        .order('current_stock', {ascending: true})

      if (error) throw error
      return data as InventoryItemWithCategory[]
    },
    enabled: !!restaurantId,
  })
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      restaurantId,
      categoryId,
      name,
      description,
      sku,
      unit,
      currentStock,
      minimumStock,
      maximumStock,
      costPerUnit,
    }: {
      restaurantId: string
      categoryId?: string
      name: string
      description?: string
      sku?: string
      unit: InventoryUnit
      currentStock?: number
      minimumStock?: number
      maximumStock?: number
      costPerUnit?: number
    }) => {
      const {data, error} = await backendClient
        .from('inventory_items')
        .insert({
          restaurant_id: restaurantId,
          category_id: categoryId,
          name,
          description,
          sku,
          unit,
          current_stock: currentStock || 0,
          minimum_stock: minimumStock || 0,
          maximum_stock: maximumStock,
          cost_per_unit: costPerUnit || 0,
        })
        .select()
        .single()

      if (error) throw error
      return data as InventoryItem
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['inventoryItems', variables.restaurantId]})
    },
  })
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      categoryId,
      name,
      description,
      sku,
      unit,
      minimumStock,
      maximumStock,
      costPerUnit,
    }: {
      id: string
      categoryId?: string
      name?: string
      description?: string
      sku?: string
      unit?: InventoryUnit
      minimumStock?: number
      maximumStock?: number
      costPerUnit?: number
    }) => {
      const updateData: Record<string, unknown> = {}
      if (categoryId !== undefined) updateData.category_id = categoryId
      if (name !== undefined) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (sku !== undefined) updateData.sku = sku
      if (unit !== undefined) updateData.unit = unit
      if (minimumStock !== undefined) updateData.minimum_stock = minimumStock
      if (maximumStock !== undefined) updateData.maximum_stock = maximumStock
      if (costPerUnit !== undefined) updateData.cost_per_unit = costPerUnit

      const {data, error} = await backendClient
        .from('inventory_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as InventoryItem
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['inventoryItems']})
      queryClient.invalidateQueries({queryKey: ['inventoryItem']})
    },
  })
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const {error} = await backendClient
        .from('inventory_items')
        .update({is_active: false})
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['inventoryItems']})
      queryClient.invalidateQueries({queryKey: ['lowStockItems']})
    },
  })
}

// ==================== Movements ====================

export function useInventoryMovements(itemId?: string, limit: number = 50) {
  return useQuery({
    queryKey: ['inventoryMovements', itemId, limit],
    queryFn: async () => {
      let query = backendClient
        .from('inventory_movements')
        .select('*')
        .order('created_at', {ascending: false})
        .limit(limit)

      if (itemId) {
        query = query.eq('item_id', itemId)
      }

      const {data, error} = await query

      if (error) throw error
      return data as InventoryMovement[]
    },
  })
}

export function useCreateInventoryMovement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      itemId,
      type,
      quantity,
      unitCost,
      reason,
      reference,
      performedBy,
    }: {
      itemId: string
      type: InventoryMovementType
      quantity: number
      unitCost?: number
      reason?: string
      reference?: string
      performedBy: string
    }) => {
      // Obtener el stock actual del item
      const {data: item, error: itemError} = await backendClient
        .from('inventory_items')
        .select('current_stock, cost_per_unit')
        .eq('id', itemId)
        .single()

      if (itemError) throw itemError

      const previousStock = Number(item.current_stock || 0)
      let newStock = previousStock

      // Calcular el nuevo stock según el tipo de movimiento
      if (type === 'entry') {
        newStock = previousStock + quantity
      } else if (type === 'exit' || type === 'waste') {
        newStock = previousStock - quantity
      } else if (type === 'adjustment') {
        newStock = quantity // El adjustment establece el stock directamente
      }

      // Permitir stock negativo para reflejar faltantes reales

      const effectiveUnitCost = unitCost ?? Number(item.cost_per_unit || 0)
      const totalCost = effectiveUnitCost * quantity

      // Crear el movimiento
      const {data: movement, error: movementError} = await backendClient
        .from('inventory_movements')
        .insert({
          item_id: itemId,
          type,
          quantity,
          previous_stock: previousStock,
          new_stock: newStock,
          unit_cost: effectiveUnitCost,
          total_cost: totalCost,
          reason,
          reference,
          performed_by: performedBy,
        })
        .select()
        .single()

      if (movementError) throw movementError

      // Actualizar el stock del item
      const {error: updateError} = await backendClient
        .from('inventory_items')
        .update({
          current_stock: newStock,
          ...(type === 'entry' && unitCost ? {cost_per_unit: unitCost} : {}),
        })
        .eq('id', itemId)

      if (updateError) throw updateError

      return movement as InventoryMovement
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['inventoryItems']})
      queryClient.invalidateQueries({queryKey: ['inventoryItem', variables.itemId]})
      queryClient.invalidateQueries({queryKey: ['inventoryMovements']})
      queryClient.invalidateQueries({queryKey: ['lowStockItems']})
    },
  })
}

// ==================== Bulk Adjustment ====================

export function useCreateInventoryAdjustment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      restaurantId,
      performedBy,
      notes,
      adjustments,
    }: {
      restaurantId: string
      performedBy: string
      notes?: string
      adjustments: Array<{
        itemId: string
        previousStock: number
        newStock: number
        unitCost: number
      }>
    }) => {
      // Create the adjustment record
      const {data: adjustment, error: adjError} = await backendClient
        .from('inventory_adjustments')
        .insert({
          restaurant_id: restaurantId,
          performed_by: performedBy,
          notes: notes || null,
          items_adjusted: adjustments.length,
        })
        .select()
        .single()

      if (adjError) throw adjError

      const adjustmentId = (adjustment as InventoryAdjustment).id

      // Create a movement and update stock for each adjusted item
      for (const adj of adjustments) {
        const {error: movError} = await backendClient
          .from('inventory_movements')
          .insert({
            item_id: adj.itemId,
            type: 'adjustment' as InventoryMovementType,
            quantity: adj.newStock,
            previous_stock: adj.previousStock,
            new_stock: adj.newStock,
            unit_cost: adj.unitCost,
            total_cost: adj.unitCost * Math.abs(adj.newStock - adj.previousStock),
            reason: notes || 'Ajuste de inventario masivo',
            reference: adjustmentId,
            performed_by: performedBy,
          })

        if (movError) throw movError

        const {error: updateError} = await backendClient
          .from('inventory_items')
          .update({current_stock: adj.newStock})
          .eq('id', adj.itemId)

        if (updateError) throw updateError
      }

      return adjustment as InventoryAdjustment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['inventoryItems']})
      queryClient.invalidateQueries({queryKey: ['inventoryMovements']})
      queryClient.invalidateQueries({queryKey: ['lowStockItems']})
    },
  })
}

// ==================== Stats ====================

export function useInventoryStats(restaurantId: string) {
  const {data: items = []} = useInventoryItems(restaurantId)

  const stats = {
    totalItems: items.length,
    lowStockCount: items.filter(i => Number(i.current_stock) <= Number(i.minimum_stock)).length,
    outOfStockCount: items.filter(i => Number(i.current_stock) <= 0).length,
    totalValue: items.reduce(
      (sum, i) => sum + Number(i.current_stock || 0) * Number(i.cost_per_unit || 0),
      0
    ),
  }

  return stats
}
