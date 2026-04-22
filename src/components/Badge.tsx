import {joinClasses} from '@/utils/misc'
import * as React from 'react'

type Props = {
  className?: string
  children: React.ReactNode
}

/**
 * @component
 * @param {React.ReactNode} children
 */
function Badge({className = 'bg-gray-100 text-gray-800', children}: Props) {
  return (
    <span
      className={joinClasses(
        className,
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
      )}
    >
      {children}
    </span>
  )
}

export {Badge}
