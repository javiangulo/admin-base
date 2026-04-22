import {joinClasses} from '@/utils/misc'
import * as React from 'react'

type DefaultProps = {
  children: React.ReactNode
}

type Props = DefaultProps & {
  className?: string
}

function Screen({className = '', children}: Props) {
  return <div className={className}>{children}</div>
}

function ScreenHeader({children}: DefaultProps) {
  return <div className="sm:flex sm:items-center">{children}</div>
}

function ScreenTitle({className = '', children}: Props) {
  return (
    <h1
      className={joinClasses(
        className,
        'text-xl font-semibold text-gray-800 dark:text-white/90',
      )}
    >
      {children}
    </h1>
  )
}

function ScreenContent({children}: DefaultProps) {
  return <div className="py-4">{children}</div>
}

Screen.Header = ScreenHeader
Screen.Title = ScreenTitle
Screen.Content = ScreenContent

export {Screen}
