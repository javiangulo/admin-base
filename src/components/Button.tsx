import * as React from 'react'

import {Link, LinkProps} from 'react-router-dom'

import {joinClasses} from '@utils/misc'
import {
  RectangleStackIcon,
  Square2StackIcon,
  Bars4Icon,
} from '@heroicons/react/24/outline'
import {
  CheckIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ArrowPathIcon,
  PencilIcon,
} from '@heroicons/react/24/solid'

type ButtonIcon = {
  icon?: string
  disabled?: boolean
  onClick?: () => void
  type?: string
}

type ButtonProps = React.JSX.IntrinsicElements['button'] & ButtonIcon

/**
 * Renders a <button> tag with a base style but it can be edited with the className
 * prop
 *
 * @param {ButtonProps}
 */
function Button({
  className = colorsBase,
  children,
  icon,
  ...props
}: ButtonProps) {
  className = props.disabled
    ? joinClasses(className, colorsDisabled)
    : className

  return (
    <button className={joinClasses(baseStyles, className)} {...props}>
      {renderIcon(icon)}
      {children}
    </button>
  )
}

/**
 * Renders a <link> tag with a base style but it can be edited with the className
 * prop
 *
 * @param {LinkProps}
 */
function ButtonLink({className = colorsBase, children, ...props}: LinkProps) {
  return (
    <Link className={joinClasses(baseStyles, colorsBase, className)} {...props}>
      {children}
    </Link>
  )
}

/**
 * Renders a <button> tag with a base style
 *
 * @param {ButtonProps}
 */
function ButtonSecondary({className = colorsSecondary, ...props}: ButtonProps) {
  return (
    <Button {...props} className={joinClasses(className)}>
      {props.children}
    </Button>
  )
}
const renderIcon = (icon?: string) => {
  switch (icon) {
    case 'plans':
      return <RectangleStackIcon className={iconStyles} />
    case 'cards':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconStyles}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      )
    case 'more':
      return <PlusIcon className={iconStyles} />
    case 'check':
      return <CheckIcon className={iconStyles} />
    case 'download':
      return <ArrowDownTrayIcon className={iconStyles} />
    case 'copy':
      return <Square2StackIcon className={iconStyles} />
    case 'edit':
      return <PencilIcon className={iconStyles} />
    case 'list':
      return <Bars4Icon className={iconStyles} />
    case 'refresh':
      return <ArrowPathIcon className={iconStyles} />
    default:
      break
  }
}
export const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition focus:outline-none'
export const colorsBase =
  'bg-gray-50 text-gray-500 ring-1 ring-inset ring-gray-300 shadow-md hover:bg-gray-100 focus:ring-green-500 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300'
export const colorsSecondary =
  'bg-white text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 sm:mt-0 sm:ml-3'
export const colorsDisabled = 'bg-gray-50 text-gray-100 cursor-not-allowed'
export const iconStyles = 'w-5'
export {Button, ButtonLink, ButtonSecondary}
