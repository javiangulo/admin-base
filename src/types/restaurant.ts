import {PaginationParams, ParamAction} from '.'

interface Restaurant {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

type ResturantFilterState = PaginationParams

type AllActionsRestaurant = ParamAction

type RestaurantForm = Pick<Restaurant, 'id' | 'name' | 'slug'>

export type {
  Restaurant,
  RestaurantForm,
  ResturantFilterState,
  AllActionsRestaurant,
}
