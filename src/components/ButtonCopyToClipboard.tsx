import * as React from 'react'

import {ClipboardDocumentListIcon} from '@heroicons/react/24/outline'

import {Tooltip} from './Tooltip'
import {useCopyToClipboard} from '@hooks/copyToClipboard'
import {joinClasses} from '@/utils/misc'

type Props = {copyValue: string; className?: string}

/**
 * Icon button that copies into clipboard
 *
 * @component
 * @param {string} text Text to copy
 */
function ButtonCopyToClipboard({copyValue, className}: Props) {
  const [copied, copy, undoCopy] = useCopyToClipboard(copyValue)

  return (
    <Tooltip content={copied ? 'Copiado!' : 'Copiar'} className="-mt-10 p-2">
      <button
        type="button"
        onClick={copy}
        className={joinClasses(
          'rounded-full text-xs font-medium text-gray-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
          className ?? '',
        )}
        onMouseLeave={undoCopy}
      >
        <ClipboardDocumentListIcon className="w-4 h-4" />
      </button>
    </Tooltip>
  )
}

export {ButtonCopyToClipboard}
