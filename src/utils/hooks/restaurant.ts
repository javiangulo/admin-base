import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {client} from '@utils/api-client'
import {PaginationParams, Restaurant, RestaurantForm} from '@/types'
import {
  restaurantList,
  restaurantDetail,
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from '@/utils/gql/restaurant'

// Supabase GraphQL response types
interface SupabaseEdge<T> {
  node: T
}

interface SupabasePageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string
  endCursor: string
}

interface SupabaseCollectionResponse<T> {
  edges: SupabaseEdge<T>[]
  pageInfo: SupabasePageInfo
}

interface RestaurantListResponse {
  restaurantsCollection: SupabaseCollectionResponse<Restaurant>
}

interface RestaurantDetailResponse {
  restaurantsCollection: {
    edges: SupabaseEdge<Restaurant>[]
  }
}

interface CreateRestaurantResponse {
  insertIntorestaurantsCollection: {
    records: Restaurant[]
  }
}

interface UpdateRestaurantResponse {
  updaterestaurantsCollection: {
    records: Restaurant[]
  }
}

interface DeleteRestaurantResponse {
  deleteFromrestaurantsCollection: {
    records: {id: string}[]
  }
}

/**
 * Gets the resturant list paginated
 *
 * @param {PaginationParams} params Params for the pagination
 */
function useRestaurantList(params: PaginationParams) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['restaurant', 'list', params],
    queryFn: () => fetchRestaurants(params),
    select: data => {
      const items = data.restaurantsCollection.edges.map(edge => edge.node)
      for (const item of items) {
        queryClient.setQueryData(['restaurant', 'detail', item.id], item)
      }

      return {
        restaurants: items,
        pageInfo: data.restaurantsCollection.pageInfo,
      }
    },
  })
}

/**
 * Gets a single restaurant by id
 *
 * @param {string} id Warehouse's id to get the data
 */
function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['restaurant', 'detail', id],
    queryFn: () => fetchRestaurant(id),
    select: data => data.restaurantsCollection.edges[0]?.node ?? null,
  })
}

/**
 * Creates a restaurant
 */
function useCreateRestaurant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RestaurantForm) => fetchCreateRestaurant(data),
    onSuccess(data) {
      const record = data.insertIntorestaurantsCollection.records[0]
      if (record) {
        queryClient.setQueryData(['restaurant', 'detail', record.id], record)
        queryClient.invalidateQueries({queryKey: ['restaurant', 'list']})
      }
    },
  })
}

/**
 * Updates a restaurant
 */
function useUpdateRestaurant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RestaurantForm) => fetchUpdateRestaurant(data),
    onSuccess(data) {
      const record = data.updaterestaurantsCollection.records[0]
      if (record) {
        queryClient.invalidateQueries({
          queryKey: ['restaurant', 'detail', record.id],
        })
        queryClient.invalidateQueries({queryKey: ['restaurant', 'list']})
      }
    },
  })
}

/**
 * Deletes a restaurant
 */
function useDeleteRestaurant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => fetchDeleteRestaurant(id),
    onSuccess() {
      queryClient.invalidateQueries({queryKey: ['restaurant', 'list']})
    },
  })
}

function fetchRestaurants(params: PaginationParams) {
  return client<RestaurantListResponse>(restaurantList, {
    first: params.limit ?? 100,
    after: params.after,
  })
}

function fetchRestaurant(id: string) {
  return client<RestaurantDetailResponse>(restaurantDetail, {id})
}

function fetchCreateRestaurant(data: RestaurantForm) {
  return client<CreateRestaurantResponse>(createRestaurant, {
    objects: [{name: data.name, slug: data.slug}],
  })
}

function fetchUpdateRestaurant(data: RestaurantForm) {
  return client<UpdateRestaurantResponse>(updateRestaurant, {
    id: data.id,
    set: {name: data.name, slug: data.slug},
  })
}

function fetchDeleteRestaurant(id: string) {
  return client<DeleteRestaurantResponse>(deleteRestaurant, {id})
}

export {
  useRestaurantList,
  useRestaurant,
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
}
