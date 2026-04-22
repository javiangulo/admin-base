import * as React from 'react'

import {Dialog} from './Dialog'

interface Props {
  enabled: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  description?: string
}

const defaultTitle = 'Hey!'
const defaultDescription =
  'Estás seguro que quieres dejar esta página? Los cambios se perderán.'

/**
 * Render a dialog to prevent go out of the current route
 *
 * @param {Props}
 */
function DialogRouteGuard2({
  enabled,
  onConfirm,
  onCancel,
  title = defaultTitle,
  description = defaultDescription,
}: Props) {
  if (!enabled) return null

  return (
    <Dialog.Warning
      open={enabled}
      buttonText="Dejar pagina"
      title={title}
      description={description}
      isLoading={false}
      handleAction={onConfirm}
      handleCancel={onCancel}
    />
  )
}

export {DialogRouteGuard2}
