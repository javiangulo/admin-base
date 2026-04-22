import * as React from 'react'
type DefaultProps = {
  children?: string
}

/**
 * Renders the No Results
 *
 * @component
 * @param {DefaultProps}
 */

const NoResults = ({children}: DefaultProps) => {
  return (
    <div className="py-4 sm:py-4">
      <div className="relative">
        <div aria-hidden="true" className="hidden sm:block"></div>
        <div className="mx-auto max-w-max px-4 sm:max-w-max sm:px-6">
          <div className="relative rounded-2xl px-6 py-10 bg-purple-600 overflow-hidden shadow-xl sm:px-8 sm:py-18">
            <div className="relative">
              <div className="sm:text-center">
                <h2 className="text-xl font-extrabold text-white tracking-tight sm:text-2xl">
                  Lo sentimos
                </h2>
                <p className="mt-6 mx-auto max-w-2xl text-lg text-gray-25">
                  {children}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoResults
