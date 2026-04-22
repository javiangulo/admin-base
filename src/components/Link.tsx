import * as React from 'react'

import {Link, LinkProps} from 'react-router-dom'

import {joinClasses} from '@utils/misc'

/**
 * Link styled with border bottom dotted
 *
 * @component
 * @param {LinkProps}
 */
function LinkDotted({className = '', children, ...props}: LinkProps) {
  return (
    <Link
      className={joinClasses('border-b border-dotted border-black', className)}
      {...props}
    >
      {children}
    </Link>
  )
}

export {LinkDotted}
