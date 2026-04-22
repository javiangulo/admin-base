import * as React from 'react'

import {joinClasses} from '@utils/misc'

type Props = {
  content: React.ReactNode
  as?: React.ElementType
  className: string
  children: React.ReactNode
}

type State = 'SHOW' | 'HIDE'

/**
 * Renders a tooltip
 *
 * @component
 * @param {Props}
 */
function Tooltip({content, className = '', as = 'span', children}: Props) {
  const [state, setState] = React.useState<State>('HIDE')

  if (!React.isValidElement(children)) {
    throw new Error('Tooltip needs a React Component')
  }

  // verifies that children has only one child (a React element) and returns it
  const wrapperElem = React.Children.only(children)

  // creates a dynamic element tag provided by the `as` prop,
  // `content` is what tooltip will display
  const tooltipElem = React.createElement(
    as,
    {
      key: 'tooltip',
      className: joinClasses(
        'tooltip text-xxs left-0 rounded-md shadow-lg bg-gray-500 text-gray-5 absolute bottom-0.5 left-5',
        className,
      ),
    },
    content,
  )

  // properties passed to the cloned element
  const cloneProps = {
    className: joinClasses(
      (wrapperElem.props as any).className,
      'has-tooltip relative',
    ),
    onMouseEnter() {
      ;(wrapperElem.props as any).onMouseEnter?.()
      setState('SHOW')
    },
    onMouseLeave() {
      ;(wrapperElem.props as any).onMouseLeave?.()
      setState('HIDE')
    },
  }

  // elements that will render the cloned element
  const cloneContent = [
    state === 'SHOW' ? tooltipElem : null,
    (wrapperElem.props as any).children,
  ]

  return React.cloneElement(wrapperElem, cloneProps, cloneContent)
}

export {Tooltip}
