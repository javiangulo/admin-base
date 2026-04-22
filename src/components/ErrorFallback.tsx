import * as React from 'react'

import {FallbackProps} from 'react-error-boundary'

import {Button} from './Button'

/**
 * Renders an error feedback
 *
 * @param {Error} error Object with name, message and stack props
 */
function ErrorFallback({error}: FallbackProps) {
  return (
    <div className="py-16 sm:py-24">
      <div className="relative sm:py-16">
        <div aria-hidden="true" className="hidden sm:block">
          <svg
            className="absolute top-8 left-1/2 -ml-3"
            width={404}
            height={392}
            fill="none"
            viewBox="0 0 404 392"
          >
            <defs>
              <pattern
                id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={392}
              fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)"
            />
          </svg>
        </div>
        <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6">
          <div className="relative rounded-2xl px-6 py-10 bg-red-600 overflow-hidden shadow-xl sm:px-12 sm:py-20">
            <div className="relative">
              <div className="sm:text-center">
                <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                  Hubo un problema
                </h2>
                <p className="mt-6 mx-auto max-w-2xl text-lg text-red-100">
                  {error.message}
                </p>
                <Button
                  className="mt-4 bg-white text-red-600"
                  onClick={() => window.location.reload()}
                >
                  Vuelve a intentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {ErrorFallback}
