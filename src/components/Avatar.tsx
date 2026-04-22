import * as React from 'react'

import {UserIcon} from '@heroicons/react/24/outline'
import {joinClasses} from '@utils/misc'

type DefaultProps = {
  className?: string
  children?: React.ReactNode
}

/**
 * Component to render Avatar in users profile
 *
 * @component
 * @param {DefaultProps}
 */

function Avatar({className}: DefaultProps) {
  return (
    <div
      className={joinClasses(
        'w-16 h-16 rounded-full bg-coolgreen-400 text-coolgray-25 flex justify-center',
        className ?? '',
      )}
    >
      <UserIcon className="w-10" />
    </div>
  )
}

export {Avatar}
