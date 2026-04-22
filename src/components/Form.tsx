import * as React from 'react'

type DefaultProps = {
  className?: string
  children: React.ReactNode
}

type Props = DefaultProps & {onSubmit: (e: React.SyntheticEvent) => void}

/**
 * Main component to build a <form>
 *
 * @component
 * @param {Props}
 */
function Form({className = 'max-w-full', onSubmit, children}: Props) {
  return (
    <div
      className={`border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mx-auto shadow sm:rounded-md ${className}`}
    >
      <form onSubmit={onSubmit}>{children}</form>
    </div>
  )
}

/**
 * Wrapper for the content, this content
 *
 * @component
 * @param {DefaultProps}
 */
function FormContent({
  children,
  className = 'space-y-8 divide-y divide-gray-200',
}: DefaultProps) {
  return <div className={`px-6 py-6 ${className}`}>{children}</div>
}

/**
 * Wrapper only to separate one bunch of elements from others
 *
 * @component
 * @param {DefaultProps}
 */
function FormSection({
  className = 'grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-6',
  children,
}: DefaultProps) {
  return <div className={className}>{children}</div>
}

/**
 * This works like the "footer" for the form, usefull for actions like submit
 * button and others
 *
 * @component
 * @param {DefaultProps}
 */
function FormActions({children}: DefaultProps) {
  return (
    <div className="px-4 py-3 text-center sm:px-6">
      <div className="flex justify-end">{children}</div>
    </div>
  )
}

/**
 * Wrapper to distinguish one element from other
 *
 * @component
 * @param {DefaultProps}
 */
function FormElement({className = '', children}: DefaultProps) {
  return <div className={className}>{children}</div>
}

type FormLabelProps = DefaultProps & {
  htmlFor?: string
}
/**
 * Renders a <label> tag with a base style, the styles could be extended
 * via className prop
 *
 * @component
 * @param {FormLabelProps}
 */
function FormLabel(props: FormLabelProps) {
  return (
    <label
      htmlFor={props.htmlFor}
      className={`mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 ${props.className}`}
    >
      {props.children}
    </label>
  )
}

/**
 * Renders a <p> tag with red style, use only for errors
 *
 * @component
 * @param {DefaultProps}
 */
function FormError({children}: DefaultProps) {
  return <p className="mt-2 text-sm text-red-600">{children}</p>
}

Form.Content = FormContent
Form.Section = FormSection
Form.Actions = FormActions
Form.Element = FormElement
Form.Label = FormLabel
Form.Error = FormError

export {Form}
