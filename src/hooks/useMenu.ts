import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {gql} from 'graphql-request'
import graphqlClient from '@/lib/graphql'
import backendClient from '@/lib/backendClient'
import type {
  MenuSection,
  Dish,
  DishPrice,
  DishKind,
  SectionItem,
} from '@/lib/database.types'

// ==================== Queries ====================

const GET_MENU_SECTIONS = gql`
  query GetMenuSections($menuId: UUID!) {
    menu_sectionsCollection(
      filter: {menu_id: {eq: $menuId}}
      orderBy: [{position: AscNullsLast}]
    ) {
      edges {
        node {
          id
          slug
          title
          cover
          description
          position
        }
      }
    }
  }
`

const GET_SECTION_ITEMS = gql`
  query GetSectionItems($sectionId: UUID!) {
    section_itemsCollection(
      filter: {section_id: {eq: $sectionId}, available: {eq: true}}
      orderBy: [{position: AscNullsLast}]
    ) {
      edges {
        node {
          id
          display_name
          display_desc
          price_override
          available
          position
          dishes {
            id
            kind
            name
            short
            description
            cover
            active
            tags
            spicy_level
            dish_pricesCollection {
              edges {
                node {
                  id
                  label
                  amount
                  currency
                }
              }
            }
          }
        }
      }
    }
  }
`

const GET_ALL_DISHES = gql`
  query GetAllDishes {
    dishesCollection(
      filter: {active: {eq: true}}
      orderBy: [{position: AscNullsLast}]
    ) {
      edges {
        node {
          id
          kind
          name
          short
          description
          cover
          active
          tags
          spicy_level
          position
          dish_pricesCollection(first: 1) {
            edges {
              node {
                id
                label
                amount
                currency
              }
            }
          }
          section_itemsCollection(first: 1) {
            edges {
              node {
                menu_sections {
                  title
                  position
                }
              }
            }
          }
        }
      }
    }
  }
`

// ==================== Hooks ====================

export function useMenuSections(menuId: string | undefined) {
  return useQuery({
    queryKey: ['menuSections', menuId],
    queryFn: async () => {
      if (!menuId) return []
      const data = await graphqlClient.request<{
        menu_sectionsCollection: {
          edges: Array<{node: MenuSection}>
        }
      }>(GET_MENU_SECTIONS, {menuId})
      return data.menu_sectionsCollection.edges.map(edge => edge.node)
    },
    enabled: !!menuId,
  })
}

export function useSectionItems(sectionId: string | undefined) {
  return useQuery({
    queryKey: ['sectionItems', sectionId],
    queryFn: async () => {
      if (!sectionId) return []
      const data = await graphqlClient.request<{
        section_itemsCollection: {
          edges: Array<{
            node: SectionItem & {
              dishes: Dish & {
                dish_pricesCollection: {
                  edges: Array<{node: DishPrice}>
                }
              }
            }
          }>
        }
      }>(GET_SECTION_ITEMS, {sectionId})

      return data.section_itemsCollection.edges.map(edge => {
        const item = edge.node
        const prices = item.dishes.dish_pricesCollection.edges.map(e => e.node)
        return {
          ...item,
          dish: {
            ...item.dishes,
            prices,
          },
        }
      })
    },
    enabled: !!sectionId,
  })
}

export function useAllDishes() {
  return useQuery({
    queryKey: ['allDishes'],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        dishesCollection: {
          edges: Array<{
            node: Dish & {
              dish_pricesCollection: {
                edges: Array<{node: DishPrice}>
              }
              section_itemsCollection: {
                edges: Array<{
                  node: {
                    menu_sections: {
                      title: string
                      position: number
                    }
                  }
                }>
              }
            }
          }>
        }
      }>(GET_ALL_DISHES, {})

      return data.dishesCollection.edges.map(edge => {
        const dish = edge.node
        const price = dish.dish_pricesCollection.edges[0]?.node
        const section = dish.section_itemsCollection.edges[0]?.node?.menu_sections
        return {
          id: dish.id,
          name: dish.name,
          description: dish.description || dish.short || '',
          price: price?.amount || 0,
          category: section?.title || 'Sin categoría',
          categoryPosition: section?.position ?? 999,
          image: dish.cover?.[0] || '',
          available: dish.active,
          tags: dish.tags || [],
          spicy_level: dish.spicy_level,
        }
      })
    },
  })
}

// ==================== Dishes List for Admin ====================

const GET_DISHES_LIST = gql`
  query GetDishesList {
    dishesCollection(
      orderBy: [{position: AscNullsLast}, {name: AscNullsLast}]
    ) {
      edges {
        node {
          id
          kind
          name
          short
          description
          cover
          active
          tags
          spicy_level
          position
          created_at
          dish_pricesCollection(orderBy: [{position: AscNullsLast}]) {
            edges {
              node {
                id
                label
                amount
                currency
              }
            }
          }
          section_itemsCollection(first: 1) {
            edges {
              node {
                menu_sections {
                  title
                  menus {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export interface DishListItem {
  id: string
  name: string
  short: string | null
  description: string | null
  kind: string
  cover: string | null
  active: boolean
  tags: string[] | null
  spicy_level: number | null
  position: number
  created_at: string
  prices: Array<{
    id: string
    label: string | null
    amount: number | null
    currency: string
  }>
  section: string | null
  menu: string | null
}

export function useDishesList() {
  return useQuery({
    queryKey: ['dishesList'],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        dishesCollection: {
          edges: Array<{
            node: Dish & {
              dish_pricesCollection: {
                edges: Array<{node: DishPrice}>
              }
              section_itemsCollection: {
                edges: Array<{
                  node: {
                    menu_sections: {
                      title: string
                      menus: {
                        name: string
                      }
                    }
                  }
                }>
              }
            }
          }>
        }
      }>(GET_DISHES_LIST, {})

      return data.dishesCollection.edges.map(edge => {
        const dish = edge.node
        const prices = dish.dish_pricesCollection.edges.map(e => e.node)
        const sectionItem = dish.section_itemsCollection.edges[0]?.node

        return {
          id: dish.id,
          name: dish.name,
          short: dish.short,
          description: dish.description,
          kind: dish.kind,
          cover: dish.cover?.[0] || null,
          active: dish.active,
          tags: dish.tags,
          spicy_level: dish.spicy_level,
          position: dish.position,
          created_at: dish.created_at,
          prices,
          section: sectionItem?.menu_sections?.title || null,
          menu: sectionItem?.menu_sections?.menus?.name || null,
        } as DishListItem
      })
    },
  })
}

// ==================== Dish Detail ====================

const GET_DISH_DETAIL = gql`
  query GetDishDetail($id: UUID!) {
    dishesCollection(
      filter: {id: {eq: $id}}
      first: 1
    ) {
      edges {
        node {
          id
          kind
          name
          short
          description
          cover
          active
          tags
          spicy_level
          position
          created_at
          dish_pricesCollection(orderBy: [{position: AscNullsLast}]) {
            edges {
              node {
                id
                label
                amount
                currency
              }
            }
          }
        }
      }
    }
  }
`

export function useDishDetail(dishId: string) {
  return useQuery({
    queryKey: ['dishDetail', dishId],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        dishesCollection: {
          edges: Array<{
            node: Dish & {
              dish_pricesCollection: {
                edges: Array<{node: DishPrice}>
              }
            }
          }>
        }
      }>(GET_DISH_DETAIL, {id: dishId})

      const dish = data.dishesCollection.edges[0]?.node
      if (!dish) return null

      return {
        ...dish,
        prices: dish.dish_pricesCollection.edges.map(e => e.node),
      }
    },
    enabled: !!dishId,
  })
}

// ==================== Mutations ====================

export function useUpdateDish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      name,
      short,
      description,
      kind,
      active,
      tags,
      spicy_level,
      cover,
    }: {
      id: string
      name?: string
      short?: string
      description?: string
      kind?: DishKind
      active?: boolean
      tags?: string[]
      spicy_level?: number | null
      cover?: string[]
    }) => {
      const updateData: Record<string, unknown> = {}
      if (name !== undefined) updateData.name = name
      if (short !== undefined) updateData.short = short
      if (description !== undefined) updateData.description = description
      if (kind !== undefined) updateData.kind = kind
      if (active !== undefined) updateData.active = active
      if (tags !== undefined) updateData.tags = tags
      if (spicy_level !== undefined) updateData.spicy_level = spicy_level
      if (cover !== undefined) updateData.cover = cover

      const {data, error} = await backendClient
        .from('dishes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Dish
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['dishDetail', variables.id]})
      queryClient.invalidateQueries({queryKey: ['dishesList']})
      queryClient.invalidateQueries({queryKey: ['allDishes']})
    },
  })
}

export function useUpdateDishPrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      dishId,
      label,
      amount,
      currency,
    }: {
      id: string
      dishId: string
      label?: string
      amount?: number
      currency?: string
    }) => {
      const updateData: Record<string, unknown> = {}
      if (label !== undefined) updateData.label = label
      if (amount !== undefined) updateData.amount = amount
      if (currency !== undefined) updateData.currency = currency

      const {data, error} = await backendClient
        .from('dish_prices')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return {data, dishId}
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({queryKey: ['dishDetail', result.dishId]})
      queryClient.invalidateQueries({queryKey: ['dishesList']})
      queryClient.invalidateQueries({queryKey: ['allDishes']})
    },
  })
}

export function useCreateDishPrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      dishId,
      label,
      amount,
      currency = 'MXN',
      position = 0,
    }: {
      dishId: string
      label?: string
      amount: number
      currency?: string
      position?: number
    }) => {
      const {data, error} = await backendClient
        .from('dish_prices')
        .insert({
          dish_id: dishId,
          label,
          amount,
          currency,
          position,
        })
        .select()
        .single()

      if (error) throw error
      return {data, dishId}
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({queryKey: ['dishDetail', result.dishId]})
      queryClient.invalidateQueries({queryKey: ['dishesList']})
    },
  })
}

export function useDeleteDishPrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id, dishId}: {id: string; dishId: string}) => {
      const {error} = await backendClient.from('dish_prices').delete().eq('id', id)

      if (error) throw error
      return {dishId}
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({queryKey: ['dishDetail', result.dishId]})
      queryClient.invalidateQueries({queryKey: ['dishesList']})
    },
  })
}

export function useCreateDish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      short,
      description,
      kind = 'food',
      active = true,
      tags,
      spicy_level,
      cover,
    }: {
      name: string
      short?: string
      description?: string
      kind?: DishKind
      active?: boolean
      tags?: string[]
      spicy_level?: number | null
      cover?: string[]
    }) => {
      const {data, error} = await backendClient
        .from('dishes')
        .insert({
          name,
          short,
          description,
          kind,
          active,
          tags,
          spicy_level,
          cover,
        })
        .select()
        .single()

      if (error) throw error
      return data as Dish
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['dishesList']})
      queryClient.invalidateQueries({queryKey: ['allDishes']})
    },
  })
}

export function useDeleteDish() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Soft delete - set active to false
      const {error} = await backendClient
        .from('dishes')
        .update({active: false})
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['dishesList']})
      queryClient.invalidateQueries({queryKey: ['allDishes']})
    },
  })
}
