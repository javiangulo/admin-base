// dashboard

import React from 'react'
import {Navigate} from 'react-router-dom'

import {NavigationItem} from '@/types'

const RedirectToDashboard = () => <Navigate to="/dashboard" replace />

const authProtectedRoutes: Array<NavigationItem> = [
  // Redirect root to main dashboard
  {
    path: '/',
    name: 'Dashboard',
    component: RedirectToDashboard,
    permissions: '',
    routes: [],
  },
  {
    path: '/dashboard',
    name: 'Main Dashboard',
    component: React.lazy(() => import('@/screens/Dashboard/index')),
    permissions: '',
    onAdmin: false,
    routes: [],
  },
  {
    path: '/admin/dashboard',
    name: 'Admin Dashboard',
    component: React.lazy(() => import('@/screens/Dashboard/index')),
    permissions: '',
    onAdmin: true,
    routes: [],
  },
]

export {authProtectedRoutes}
