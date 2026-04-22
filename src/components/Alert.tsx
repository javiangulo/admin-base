import * as React from 'react'

type DefaultProps = {
  className?: string
  children?: React.ReactNode
}

/**
 * Renders the Aler Wrapper
 *
 * @component
 * @param {DefaultProps}
 */
function Alert({className = '', children}: DefaultProps) {
  return (
    <div className={`sm:col-span-full mt-4 rounded-md p-4  ${className}`}>
      <div className="flex justify-between items-center">{children}</div>
    </div>
  )
}

/**
 * Renders the Alert title with base styles
 *
 * @component
 * @param {DefaultProps}
 */
function AlertTitle({className = '', children}: DefaultProps) {
  return <h3 className={`text-sm font-medium ${className}`}>{children}</h3>
}

/**
 * Renders the Alert description with base styles
 *
 * @component
 * @param {DefaultProps}
 */
function AlertDescription({className = '', children}: DefaultProps) {
  return (
    <div className={`mt-2 text-sm ${className}`}>
      <p>{children}</p>
    </div>
  )
}

type CustomAlertProps = DefaultProps & {
  title: string
  description: string
}

/**
 * Custom Alert for success actions
 *
 * @component
 * @param {CustomAlertProps}
 */
function AlertInfo({title, description, children}: CustomAlertProps) {
  return (
    <Alert className="bg-blue-50">
      <div className="ml-3">
        <Alert.Title className="text-blue-800">{title}</Alert.Title>
        <Alert.Description className="text-blue-700">
          {description}
        </Alert.Description>
      </div>
      {children}
    </Alert>
  )
}

/**
 * Custom Alert for danger actions
 *
 * @component
 * @param {CustomAlertProps}
 */
function AlertDanger({title, description, children}: CustomAlertProps) {
  return (
    <Alert className="bg-red-50">
      <div className="ml-3">
        <Alert.Title className="text-red-800">{title}</Alert.Title>
        <Alert.Description className="text-red-700">
          {description}
        </Alert.Description>
      </div>
      {children}
    </Alert>
  )
}

Alert.Title = AlertTitle
Alert.Description = AlertDescription
Alert.Danger = AlertDanger
Alert.Info = AlertInfo

export {Alert}
