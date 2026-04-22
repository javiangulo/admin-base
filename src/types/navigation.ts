type FlagTypes = 'SHOW_IN_TABS'

type MenusNames = 'MENU' | 'OTHERS'

type NavItem = {
  name: string
  icon: React.ReactNode
  path?: string
  subItems?: {
    name: string
    path: string
    pro?: boolean
    new?: boolean
  }[]
}

interface NavigationItem {
  name?: string
  path: string
  component: React.ComponentType<any>
  icon?: React.ReactNode
  onSidenav?: boolean
  onAdmin?: boolean
  menuName?: MenusNames
  routes?: NavigationItem[]
  exact?: boolean
  flag?: FlagTypes
  permissions: string
}

export type {NavigationItem, NavItem, MenusNames}
