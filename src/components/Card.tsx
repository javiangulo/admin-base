import * as React from 'react'

import {joinClasses} from '@utils/misc'

type DefaultProps = {
  className?: string
  children: React.ReactNode
}

/**
 * Component to render Cards content
 *
 * @component
 * @param {DefaultProps}
 */

function CardContent({className, children}: DefaultProps) {
  return (
    <div className={joinClasses('bg-gray-25 rounded shadow', className ?? '')}>
      {children}
    </div>
  )
}

function CardTitle({className, children}: DefaultProps) {
  return (
    <p className={joinClasses('text-gray-300 uppercase', className ?? '')}>
      {children}
    </p>
  )
}

export {CardContent, CardTitle}
