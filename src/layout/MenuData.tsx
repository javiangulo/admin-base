import React from 'react'
import {authProtectedRoutes} from '@/routes/allRoutes'
import {MenusNames, NavItem} from '@/types'

const getMenu = async () => {
  // const permissions = await fetchPermissionByUser()
  const menuVerified: Record<MenusNames, NavItem[]> = {
    MENU: [],
    OTHERS: [],
  }
  const filterRoutes = authProtectedRoutes.filter(
    route => route.onSidenav && route.menuName,
  )
  filterRoutes.forEach(route => {
    if (route.menuName) {
      menuVerified[route.menuName].push({
        name: route.name ?? '',
        icon: route.icon ?? <React.Fragment />,
        path: route.path ?? '',
        subItems: route.routes
          ? route.routes.map(subRoute => ({
              name: subRoute.name ?? '',
              path: subRoute.path ?? '',
            }))
          : undefined,
      })
    }
  })
  return menuVerified
}

const menuData = getMenu

export {menuData}
