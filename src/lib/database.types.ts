// Tipos de datos de dominio para la aplicacion

export type MenuKind =
  | 'comidas'
  | 'bebidas'
  | 'postres'
  | 'destacados'
  | 'chef'
  | 'otro'
export type DishKind =
  | 'food'
  | 'beverage'
  | 'wine'
  | 'cafe'
  | 'dessert'
  | 'other'
export type MenuActivationStrategy = 'manual' | 'always_on' | 'scheduled'

export interface Restaurant {
  id: string
  name: string | null
  slug: string
  created_at: string | null
  updated_at: string | null
}

export interface Branch {
  id: string
  restaurant_id: string
  name: string | null
  welcom_message: string | null
  created_at: string | null
  updated_at: string | null
}

export interface Menu {
  id: string
  restaurant_id: string
  branch_id: string | null
  slug: string
  name: string
  kind: MenuKind
  description: string | null
  cover: string | null
  is_active: boolean
  activation_strategy: MenuActivationStrategy
  timezone: string | null
  time_start: string | null
  time_end: string | null
  position: number
  created_at: string
  updated_at: string
}

export interface MenuSection {
  id: string
  menu_id: string
  slug: string
  title: string
  cover: string | null
  description: string | null
  position: number
  created_at: string
  updated_at: string
}

export interface Dish {
  id: string
  kind: DishKind
  name: string
  short: string | null
  description: string | null
  cover: string[] | null
  active: boolean
  tags: string[] | null
  meta: Record<string, unknown>
  default_ingredients: Record<string, unknown>
  spicy_level: number | null
  position: number
  created_at: string
  updated_at: string
}

export interface DishPrice {
  id: string
  dish_id: string
  label: string | null
  amount: number | null
  currency: string
  volume_ml: number | null
  note: string | null
  position: number
}

export interface SectionItem {
  id: string
  section_id: string
  dish_id: string
  display_name: string | null
  display_desc: string | null
  price_override: number | null
  available: boolean
  position: number
  meta: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Badge {
  id: string
  key: string | null
  label: string | null
  icon: string | null
  color_bg: string | null
  color_text: string | null
}

export interface Order {
  id: string
  restaurant_id: string
  branch_id: string | null
  user_id: string | null
  cash_session_id: string | null
  status: string
  total_amount: number
  currency: string
  note: string | null
  order_type: OrderType
  customer_id: string | null
  delivery_address: string | null
  estimated_delivery_time: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  dish_id: string
  display_name: string | null
  quantity: number
  unit_price: number
  total_price: number
  meta: Record<string, unknown>
  created_at: string
}

export interface Topping {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  base_price: number
  active: boolean
  position: number
  meta: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'billing'

export interface Table {
  id: string
  branch_id: string
  name: string
  capacity: number
  status: TableStatus
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Cash Register Types
export type CashRegisterStatus = 'open' | 'closed'
export type CashMovementType =
  | 'sale'
  | 'withdrawal'
  | 'deposit'
  | 'refund'
  | 'tip'

export interface CashRegister {
  id: string
  branch_id: string
  name: string
  description: string | null
  is_active: boolean
  position: number
  created_at: string
  updated_at: string
}

export interface CashSession {
  id: string
  cash_register_id: string
  opened_by: string
  closed_by: string | null
  status: CashRegisterStatus
  opening_amount: number
  closing_amount: number | null
  expected_amount: number | null
  difference: number | null
  notes: string | null
  opened_at: string
  closed_at: string | null
  created_at: string
  updated_at: string
}

export interface CashMovement {
  id: string
  cash_session_id: string
  order_id: string | null
  type: CashMovementType
  amount: number
  payment_method: string | null
  description: string | null
  performed_by: string
  created_at: string
}

// Inventory Types
export type InventoryMovementType =
  | 'entry'
  | 'exit'
  | 'adjustment'
  | 'waste'
  | 'transfer'
export type InventoryUnit =
  | 'kg'
  | 'g'
  | 'lt'
  | 'ml'
  | 'pz'
  | 'caja'
  | 'bolsa'
  | 'lata'
  | 'botella'

export interface InventoryCategory {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  color: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: string
  restaurant_id: string
  category_id: string | null
  name: string
  description: string | null
  sku: string | null
  unit: InventoryUnit
  current_stock: number
  minimum_stock: number
  maximum_stock: number | null
  cost_per_unit: number
  is_active: boolean
  position: number
  created_at: string
  updated_at: string
}

export interface InventoryMovement {
  id: string
  item_id: string
  type: InventoryMovementType
  quantity: number
  previous_stock: number
  new_stock: number
  unit_cost: number | null
  total_cost: number | null
  reason: string | null
  reference: string | null
  performed_by: string
  created_at: string
}

// Tipos con relaciones para Inventario
export interface InventoryItemWithCategory extends InventoryItem {
  inventory_categories: InventoryCategory | null
}

export interface InventoryAdjustment {
  id: string
  restaurant_id: string
  performed_by: string
  notes: string | null
  items_adjusted: number
  created_at: string
}

// Recipe Types (Dish Ingredients)
export interface DishRecipe {
  id: string
  dish_id: string
  inventory_item_id: string
  quantity: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DishRecipeWithItem extends DishRecipe {
  inventory_items: InventoryItem
}

export interface DishCost {
  dish_id: string
  dish_name: string
  recipe_cost: number
  ingredient_count: number
}

export interface OrderStatusLog {
  id: string
  order_id: string
  previous_status: string | null
  new_status: string
  changed_at: string
}

// Delivery / Customer Types
export type OrderType = 'dine_in' | 'delivery' | 'pickup'

export interface Customer {
  id: string
  restaurant_id: string
  name: string
  phone: string
  street: string | null
  house_number: string | null
  postal_code: string | null
  address: string | null
  reference: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// Tipos con relaciones
export interface DishWithPrice extends Dish {
  dish_prices: DishPrice[]
}

export interface SectionItemWithDish extends SectionItem {
  dish: DishWithPrice
}

export interface MenuSectionWithItems extends MenuSection {
  section_items: SectionItemWithDish[]
}

export interface MenuWithSections extends Menu {
  menu_sections: MenuSectionWithItems[]
}
