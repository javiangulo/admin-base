import * as React from 'react'

import {Transition} from '@headlessui/react'
import {
  CheckIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'

interface ContextState {
  show: boolean
  setShow: (state: boolean) => void
}

const defaultContext = {} as ContextState
const NotificationContext = React.createContext<ContextState>(defaultContext)

type DefaultProps = {
  children: React.ReactNode
}

const CLOSE_NOTY_IN_MS = 10000

/**
 * Renders the notification wrapper and initialize the context to use in
 * children
 *
 * @component
 * @param {DefaultProps} props
 */
function Notification(props: DefaultProps) {
  const [show, setShow] = React.useState(false)

  return (
    <NotificationContext.Provider value={{show, setShow}}>
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start top-18 z-20"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {props.children}
        </div>
      </div>
    </NotificationContext.Provider>
  )
}

/**
 * @component
 * @param {DefaultProps} props
 */
function NotificationContent({children}: DefaultProps) {
  const {show, setShow} = React.useContext(NotificationContext)

  React.useEffect(() => {
    setShow(true)
  }, [setShow])

  return (
    <Transition
      show={show}
      as={React.Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="max-w-sm w-full border-gray-200 bg-white  dark:border-gray-800 dark:bg-gray-dark shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start">{children}</div>
        </div>
      </div>
    </Transition>
  )
}

/**
 * @component
 * @param {DefaultProps} props
 */
function NotificationIcon({children}: DefaultProps) {
  return <div className="flex-shrink-0">{children}</div>
}

/**
 * @component
 * @param {DefaultProps} props
 */
function NotificationMessage({children}: DefaultProps) {
  return <div className="ml-3 w-0 flex-1 pt-0.5">{children}</div>
}

type CloseProps = DefaultProps & {
  onClose?: () => void
}
/**
 * @component
 * @param {CloseProps} props
 */
function NotificationClose({children, onClose}: CloseProps) {
  const {setShow} = React.useContext(NotificationContext)

  const close = React.useCallback(
    function close() {
      setShow(false)
      onClose?.()
    },
    [onClose, setShow],
  )

  React.useEffect(() => {
    setShow(true)
    const intervalId = setTimeout(close, CLOSE_NOTY_IN_MS)

    return () => {
      clearInterval(intervalId)
    }
  }, [close, setShow])

  return (
    <div className="ml-4 flex-shrink-0 flex">
      <button
        className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={close}
      >
        <span className="sr-only">Close</span>
        {children}
      </button>
    </div>
  )
}

type NotificationCustomProps = CloseProps & {
  open: boolean
}

/**
 * @component
 * @param {NotificationCustomProps} props
 */
function NotificationSuccess(props: NotificationCustomProps) {
  const {open, children} = props

  return (
    <Notification>
      {open && (
        <Notification.Content>
          <Notification.Icon>
            <CheckIcon className="h-6 w-6 text-green-300" aria-hidden="true" />
          </Notification.Icon>
          <Notification.Message>{children}</Notification.Message>
          <Notification.Close onClose={props.onClose}>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </Notification.Close>
        </Notification.Content>
      )}
    </Notification>
  )
}

/**
 * @component
 * @param {NotificationCustomProps} props
 */
function NotificationError(props: NotificationCustomProps) {
  const {open, children} = props
  return (
    <Notification>
      {open && (
        <Notification.Content>
          <Notification.Icon>
            <ExclamationCircleIcon
              className="h-6 w-6 text-red-300"
              aria-hidden="true"
            />
          </Notification.Icon>
          <Notification.Message>{children}</Notification.Message>
          <Notification.Close onClose={props.onClose}>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </Notification.Close>
        </Notification.Content>
      )}
    </Notification>
  )
}

Notification.Content = NotificationContent
Notification.Icon = NotificationIcon
Notification.Message = NotificationMessage
Notification.Close = NotificationClose
Notification.Success = NotificationSuccess
Notification.Error = NotificationError

export {Notification}
