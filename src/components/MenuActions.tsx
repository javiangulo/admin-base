import * as React from 'react'

import {Link, LinkProps} from 'react-router-dom'
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react'
import {EllipsisVerticalIcon, ChevronDownIcon} from '@heroicons/react/24/solid'

import {baseStyles, colorsBase} from './Button'
import {joinClasses} from '@utils/misc'

type DefaultProps = {
  children: React.ReactNode
  btnToggleClasses?: string
  svgClasses?: string
}

type Props = DefaultProps & {
  menuItemClasses?: string
  ButtonToggleMenu?: React.ElementType
}

/**
 * Renders the button that displays the menu
 *
 * @component
 * @param {Props}
 */
function MenuActions({
  children,
  ButtonToggleMenu = MenuButtonDots,
  menuItemClasses = '',
}: Props) {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left xs:w-max sm:w-fit"
    >
      {() => (
        <>
          <div className="flex">
            <ButtonToggleMenu />
          </div>

          <MenuItems
            anchor="bottom end"
            transition
            className={joinClasses(
              'max-h-[155px] overflow-auto w-56 rounded-md border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-dark ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-[9999]',
              'transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0',
              menuItemClasses,
            )}
          >
            {children}
          </MenuItems>
        </>
      )}
    </Menu>
  )
}

type MenuActionProps = DefaultProps & {
  onClick: (value?: any) => void
}

/**
 * Renders a menu item as a button
 *
 * @component
 * @param {Props}
 */
function MenuAction({children, onClick}: MenuActionProps) {
  return (
    <MenuItem>
      {() => (
        <button
          onClick={onClick}
          className={joinClasses(styles.actionItem.default)}
        >
          {children}
        </button>
      )}
    </MenuItem>
  )
}

/**
 * Renders a menu item as a link
 *
 * @component
 * @param {Props}
 */
function MenuActionLink({children, ...props}: LinkProps) {
  return (
    <MenuItem>
      {() => (
        <Link className={joinClasses(styles.actionItem.default)} {...props}>
          {children}
        </Link>
      )}
    </MenuItem>
  )
}

/**
 * Renders a with the 3 dots icon
 *
 * @component
 * @param {Props}
 */
function MenuButtonDots() {
  return (
    <MenuButton className="inline-flex items-center gap-2 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-1.5 text-sm/6 font-semibold  shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white">
      <span className="sr-only">Open options</span>
      <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
    </MenuButton>
  )
}

/**
 * Renders a button with a custom children text and an chevron down icon
 *
 * @component
 * @param {Props}
 */
function MenuButtonDown({
  children,
  btnToggleClasses = '',
  svgClasses = '',
}: DefaultProps) {
  return (
    <MenuButton
      className={joinClasses(`${baseStyles} ${colorsBase}`, btnToggleClasses)}
    >
      {children}
      <ChevronDownIcon
        className={joinClasses('-mr-1 ml-2 h-5 w-5', svgClasses)}
        aria-hidden="true"
      />
    </MenuButton>
  )
}

const styles = {
  actionItem: {
    default:
      'block w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300',
    active: '',
    inactive: '',
  },
}

MenuActions.Action = MenuAction
MenuActions.ActionLink = MenuActionLink
MenuActions.ButtonDown = MenuButtonDown

export {MenuActions}
