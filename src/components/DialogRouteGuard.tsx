import {Dialog} from './Dialog'
import {usePrompt} from '@/utils/hooks/useNavigationBlock'

interface Props {
  enabled: boolean
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
function DialogRouteGuard({
  enabled,
  title = defaultTitle,
  description = defaultDescription,
}: Props) {
  const {showPrompt, confirmNavigation, cancelNavigation} = usePrompt(enabled)

  // const handlePromptMessage = (nextLocation: H.Location) => {
  //   setNextLocation(nextLocation)
  //   setShowDialog(true)
  //   return false
  // }

  return (
    <>
      {/* <Prompt when={enabled && !leave} message={handlePromptMessage} /> */}

      <Dialog.Warning
        open={showPrompt}
        buttonText="Dejar pagina"
        title={title}
        description={description}
        isLoading={false}
        handleAction={() => confirmNavigation()}
        handleCancel={() => cancelNavigation()}
      />
    </>
  )
}

export {DialogRouteGuard}
