import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import backendClient from '@/lib/backendClient'
import type {
  DishRecipe,
  DishRecipeWithItem,
  DishCost,
} from '@/lib/database.types'

// ==================== Recipes ====================

export function useDishRecipe(dishId: string) {
  return useQuery({
    queryKey: ['dishRecipe', dishId],
    queryFn: async () => {
      const {data, error} = await backendClient
        .from('dish_recipes')
        .select(
          `
          *,
          inventory_items (
            id,
            name,
            unit,
            current_stock,
            cost_per_unit
          )
        `,
        )
        .eq('dish_id', dishId)
        .order('created_at', {ascending: true})

      if (error) throw error
      return data as DishRecipeWithItem[]
    },
    enabled: !!dishId,
  })
}

export function useAddRecipeIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      dishId,
      inventoryItemId,
      quantity,
      notes,
    }: {
      dishId: string
      inventoryItemId: string
      quantity: number
      notes?: string
    }) => {
      const {data, error} = await backendClient
        .from('dish_recipes')
        .insert({
          dish_id: dishId,
          inventory_item_id: inventoryItemId,
          quantity,
          notes,
        })
        .select()
        .single()

      if (error) throw error
      return data as DishRecipe
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['dishRecipe', variables.dishId],
      })
      queryClient.invalidateQueries({queryKey: ['dishCost', variables.dishId]})
      queryClient.invalidateQueries({queryKey: ['dishCosts']})
    },
  })
}

export function useUpdateRecipeIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      quantity,
      notes,
    }: {
      id: string
      dishId: string
      quantity?: number
      notes?: string
    }) => {
      const updateData: Record<string, unknown> = {}
      if (quantity !== undefined) updateData.quantity = quantity
      if (notes !== undefined) updateData.notes = notes

      const {data, error} = await backendClient
        .from('dish_recipes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as DishRecipe
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['dishRecipe', variables.dishId],
      })
      queryClient.invalidateQueries({queryKey: ['dishCost', variables.dishId]})
      queryClient.invalidateQueries({queryKey: ['dishCosts']})
    },
  })
}

export function useRemoveRecipeIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id}: {id: string; dishId: string}) => {
      const {error} = await backendClient
        .from('dish_recipes')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['dishRecipe', variables.dishId],
      })
      queryClient.invalidateQueries({queryKey: ['dishCost', variables.dishId]})
      queryClient.invalidateQueries({queryKey: ['dishCosts']})
    },
  })
}

// ==================== Dish Cost ====================

export function useDishCost(dishId: string) {
  return useQuery({
    queryKey: ['dishCost', dishId],
    queryFn: async () => {
      const {data, error} = await backendClient
        .from('dish_costs')
        .select('*')
        .eq('dish_id', dishId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data as DishCost | null
    },
    enabled: !!dishId,
  })
}

export function useAllDishCosts() {
  return useQuery({
    queryKey: ['dishCosts'],
    queryFn: async () => {
      const {data, error} = await backendClient
        .from('dish_costs')
        .select('*')
        .order('dish_name', {ascending: true})

      if (error) throw error
      return data as DishCost[]
    },
  })
}

// ==================== Inventory Deduction ====================

export function useDeductInventoryForOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      performedBy,
    }: {
      orderId: string
      performedBy: string
    }) => {
      const {error} = await backendClient.rpc('deduct_inventory_for_order', {
        p_order_id: orderId,
        p_performed_by: performedBy,
      })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['inventoryItems']})
      queryClient.invalidateQueries({queryKey: ['inventoryMovements']})
      queryClient.invalidateQueries({queryKey: ['lowStockItems']})
    },
  })
}

// ==================== Recipe Summary ====================

export function useRecipeSummary(dishId: string) {
  const {data: recipe = []} = useDishRecipe(dishId)

  const summary = {
    ingredientCount: recipe.length,
    totalCost: recipe.reduce((sum, r) => {
      const qty = Number(r.quantity || 0)
      const cost = Number(r.inventory_items?.cost_per_unit || 0)
      return sum + qty * cost
    }, 0),
    hasLowStock: recipe.some(r => {
      const current = Number(r.inventory_items?.current_stock || 0)
      const needed = Number(r.quantity || 0)
      return current < needed
    }),
    missingIngredients: recipe.filter(r => {
      const current = Number(r.inventory_items?.current_stock || 0)
      const needed = Number(r.quantity || 0)
      return current < needed
    }).length,
  }

  return summary
}
