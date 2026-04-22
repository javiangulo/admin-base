import * as React from 'react'

type DefaultProps = {
  className?: string
  note: string
}

function StopNote({note}: DefaultProps) {
  return (
    <div className="mb-4 mt-4">
      <div className="bg-coolgray-100 rounded-md px-8 py-6 flex xs:flex-col sm:flex-row items-center">
        <span className="mr-3 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-700">
          !
        </span>

        <div className="ml-2 xs:mt-4 sm:mt-0 xs:text-center sm:text-left">
          <h1 className="text-xl font-bold text-coolgray-900">¡Atención!</h1>
          <p className="text-base text-coolgray-800 mt-2">{note}</p>
        </div>
      </div>
    </div>
  )
}

export {StopNote}
