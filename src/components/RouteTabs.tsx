import * as React from 'react'

import {Link} from 'react-router-dom'

import {NavigationItem} from '@/types'
import {joinClasses} from '@utils/misc'

type Props = {
  routes: NavigationItem[]
  children: (tab: NavigationItem) => React.JSX.Element | null
}

/**
 * Wrapper for tab routes
 *
 * @component
 * @param {Props}
 */
function RouteTabs({routes, children}: Props) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex overflow-x-auto space-x-8" aria-label="Tabs">
        {routes.map(children)}
      </nav>
    </div>
  )
}

type RouteTabProps = {title: string; to: string; selected: boolean}

/**
 * Renders a <Link> route with custom styles for tabs
 *
 * @component
 * @param {RouteTabProps}
 */
function RouteTab({title, to, selected}: RouteTabProps) {
  return (
    <Link
      to={to}
      className={joinClasses(
        selected
          ? 'border-green-600 text-green-500'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
      )}
      aria-current={selected ? 'page' : undefined}
    >
      {title}
    </Link>
  )
}

RouteTabs.Tab = RouteTab

export {RouteTabs}
