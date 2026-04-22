import * as React from 'react'

import {IconSpinner} from './IconSpinner'
import {LogoBrandname} from './Logo'
import {joinClasses} from '@utils/misc'

type Props = {
  className?: string
  children?: React.ReactNode
}

/**
 * Renders a full screen element that display a loading indicator, logo and
 * some text (optional)
 *
 * @component
 * @param {React.ReactNode} children
 */
function FullPageSpinner({className = 'z-10', children}: Props) {
  return (
    <div
      className={joinClasses(
        'fixed inset-0 flex min-h-screen items-center justify-center bg-white bg-opacity-70 dark:bg-black',
        className,
      )}
    >
      <div className="flex-col space-y-2 items-center justify-center">
        <LogoBrandname />
        <div className="flex justify-center mb-4">
          <IconSpinner className="h-12 w-12 mt-4 text-black dark:text-white" />
        </div>
        <p className="text-xs text-black text-center dark:text-white">
          {children ?? ''}
        </p>
      </div>
    </div>
  )
}

export {FullPageSpinner}
