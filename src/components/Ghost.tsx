import * as React from 'react'

import {joinClasses} from '@utils/misc'

type Props = {
  className?: string
  children?: React.ReactNode
}

/**
 * Renders a ghost element
 *
 * @param {string} className
 * @param {React.ReactNode} children
 */
function Ghost({className = '', children = null}: Props) {
  return children === null ? (
    <div className={joinClasses('h-4 bg-gray-50 rounded', className)} />
  ) : (
    <>{children}</>
  )
}

export {Ghost}
