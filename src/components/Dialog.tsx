import * as React from 'react'
import {
  Dialog as DialogTw,
  Transition,
  TransitionChild,
  DialogTitle as DialogTwTitle,
} from '@headlessui/react'
import {ExclamationTriangleIcon} from '@heroicons/react/24/solid'

import {ButtonSecondary} from './Button'
import {IconSpinner} from './IconSpinner'
import {joinClasses, noop} from '@utils/misc'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/free-solid-svg-icons'

type DefaultProps = {
  className?: string
  children: React.ReactNode
}

type DialogProps = DefaultProps & {
  open: boolean
  size?: string
  overflow?: string
}

/**
 * Wrapper to render all dialog content
 *
 * @component
 * @param {Props}
 */
function Dialog({
  size = 'sm:max-w-lg',
  overflow = 'overflow-hidden',
  open,
  children,
}: DialogProps) {
  const initialFocusRef = React.useRef<HTMLDivElement>(null)

  return (
    <Transition appear show={open} as={React.Fragment}>
      <DialogTw
        as="div"
        className="relative z-[100000]"
        open={open}
        onClose={noop}
        initialFocus={initialFocusRef}
      >
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 dark:bg-white/75" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto" ref={initialFocusRef}>
          <div className="flex h-[calc(100%-1rem)] max-h-full items-center justify-center !p-8 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`inline-block align-bottom bg-white dark:bg-zinc-700 rounded-lg text-left shadow-xl transform transition-all ease-all sm:!my-16 sm:align-middle sm:w-full ${size} ${overflow}`}
              >
                {children}
              </div>
            </TransitionChild>
          </div>
        </div>
      </DialogTw>
    </Transition>
  )
}

/**
 * Wrapper for the dialog content
 *
 * @component
 * @param {DefaultProps}
 */
function DialogContent({className = '', children}: DefaultProps) {
  return (
    <div
      className={joinClasses(
        'bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4',
        className,
      )}
    >
      <div className="sm:flex sm:items-start">{children}</div>
    </div>
  )
}

/**
 * Wrapper for the dialog icon
 *
 * @component
 * @param {DefaultProps}
 */
function DialogIcon({className, children}: DefaultProps) {
  return (
    <div
      className={joinClasses(
        'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10',
        className ?? '',
      )}
    >
      {children}
    </div>
  )
}

/**
 * Render dialog title with custom classes
 *
 * @component
 * @param {DefaultProps}
 */
function DialogTitle({className, children}: DefaultProps) {
  return (
    <DialogTwTitle
      as="h3"
      className={joinClasses(
        'text-lg leading-6 font-medium text-gray-900',
        className ?? '',
      )}
    >
      {children}
    </DialogTwTitle>
  )
}

/**
 * Renders dialog description with custom classes
 *
 * @component
 * @param {DefaultProps}
 */
function DialogDescription({className, children}: DefaultProps) {
  return (
    <div className="mt-2">
      <p
        className={joinClasses(
          'text-sm text-gray-500 leading-normal',
          className ?? '',
        )}
      >
        {children}
      </p>
    </div>
  )
}

/**
 * Wrapper for dialog actions (buttons)
 *
 * @component
 * @param {DefaultProps}
 */
function DialogActions({children}: {children: React.ReactNode}) {
  return (
    <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      {children}
    </div>
  )
}

type DialogModalProps = {
  title: string
  description: React.ReactNode
  open: boolean
  isLoading: boolean
  buttonText?: string
  icon?: boolean
  showTitle?: boolean
  type: keyof DialogStyles
  handleCancel?: () => void
}

function DialogModal(props: DialogModalProps) {
  const {
    title,
    description,
    open,
    icon = true,
    showTitle = true,
    type = 'success',
    handleCancel,
  } = props

  const style = DialogStyles[type]

  return (
    <Dialog open={open}>
      <div
        className={joinClasses(
          icon ? 'pb-4 sm:pb-4' : 'pb-2 sm:pb-0',
          'bg-white px-3 pt-3  sm:p-4 ',
        )}
      >
        <div className="flex justify-end">
          <FontAwesomeIcon
            icon={faTimes}
            className="!w-4 text-coolgray-700 cursor-pointer duration-1000"
            aria-hidden="true"
            onClick={handleCancel}
          />
        </div>

        <div className="sm:flex sm:items-center">
          {icon && (
            <Dialog.Icon className={style.iconBg}>
              <ExclamationTriangleIcon
                className={joinClasses('h-6 w-6', style.icon)}
                aria-hidden="true"
              />
            </Dialog.Icon>
          )}
          {showTitle && (
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <Dialog.Title>{title}</Dialog.Title>
            </div>
          )}
        </div>
      </div>
      <Dialog.Description>{description}</Dialog.Description>
    </Dialog>
  )
}

type DialogBaseProps = {
  title: string
  description: React.ReactNode
  open: boolean
  isLoading: boolean
  buttonText?: string
  handleAction: () => void
  handleCancel: () => void
  type: keyof DialogStyles
}

/**
 * Base reusable dialog component
 *
 * @component
 * @param {DialogBaseProps}
 */
function DialogBase(props: DialogBaseProps) {
  const {
    title,
    description,
    open,
    isLoading,
    handleAction,
    handleCancel,
    buttonText,
    type,
  } = props

  const style = DialogStyles[type]

  const [isFocused, setIsFocused] = React.useState(true)

  const callbackRef = React.useCallback((inputElement: HTMLButtonElement) => {
    setIsFocused(false)
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus()
        setIsFocused(true)
      }, 100)
    }
  }, [])

  return (
    <Dialog open={open}>
      <Dialog.Content>
        <Dialog.Icon className={style.iconBg}>
          <ExclamationTriangleIcon
            className={joinClasses('h-6 w-6', style.icon)}
            aria-hidden="true"
          />
        </Dialog.Icon>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <button
          autoFocus={true}
          ref={callbackRef}
          className={joinClasses(
            isFocused
              ? 'focus:outline-none focus:ring-2 focus:ring-offset-2'
              : '',
            'w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white    sm:ml-3 sm:w-auto sm:text-sm',
            style.buttonAction,
          )}
          onClick={handleAction}
          // onKeyDown={e => e.key === 'Enter' && question(e)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <IconSpinner
                className={joinClasses('h-4 w-4 mr-2', style.iconSpinner)}
              />
              Procesando
            </>
          ) : (
            (buttonText ?? 'ACEPTAR')
          )}
        </button>
        {!isLoading && (
          <ButtonSecondary
            className="w-full sm:w-auto mt-2 sm:mt-0"
            onClick={handleCancel}
          >
            Cancelar
          </ButtonSecondary>
        )}
      </Dialog.Actions>
    </Dialog>
  )
}

/**
 * Dialog for success actions
 *
 * @component
 * @param {DialogBaseProps}
 */
function DialogSuccess(props: Omit<DialogBaseProps, 'type'>) {
  return <DialogBase {...props} type="success" />
}

/**
 * Dialog for danger actions
 *
 * @component
 * @param {DialogBaseProps}
 */
function DialogDanger(props: Omit<DialogBaseProps, 'type'>) {
  return <DialogBase {...props} type="danger" />
}

/**
 * Dialog for warning actions
 *
 * @component
 * @param {DialogBaseProps}
 */
function DialogWarning(props: Omit<DialogBaseProps, 'type'>) {
  return <DialogBase {...props} type="warning" />
}

type DialogStylesAttrs = {
  iconBg: string
  icon: string
  buttonAction: string
  iconSpinner: string
}
interface DialogStyles {
  success: DialogStylesAttrs
  warning: DialogStylesAttrs
  danger: DialogStylesAttrs
}

/**
 * Style for different dialog status
 */
const DialogStyles: DialogStyles = {
  success: {
    iconBg: 'bg-green-100',
    icon: 'text-green-600',
    buttonAction: 'bg-green-600 hover:bg-green-700  focus:ring-green-500',
    iconSpinner: 'text-green-300',
  },
  warning: {
    iconBg: 'bg-yellow-100',
    icon: 'text-yellow-600',
    buttonAction: 'bg-yellow-600 hover:bg-yellow-700  focus:ring-yellow-500',
    iconSpinner: 'text-yellow-300',
  },
  danger: {
    iconBg: 'bg-red-100',
    icon: 'text-red-600',
    buttonAction: 'bg-red-600 hover:bg-red-700  focus:ring-red-500',
    iconSpinner: 'text-red-300',
  },
}

Dialog.Content = DialogContent
Dialog.Icon = DialogIcon
Dialog.Title = DialogTitle
Dialog.Description = DialogDescription
Dialog.Actions = DialogActions
Dialog.Success = DialogSuccess
Dialog.Danger = DialogDanger
Dialog.Warning = DialogWarning
Dialog.Modal = DialogModal

export {Dialog}
