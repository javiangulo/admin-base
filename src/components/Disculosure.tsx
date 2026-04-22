import * as React from 'react'

import {joinClasses} from '@utils/misc'
import {Disclosure} from '@headlessui/react'
import {CardContent, CardTitle} from '@/components/Card'
import {ChevronDownIcon} from '@heroicons/react/24/outline'

type DefaultProps = {
  className?: string
  children: React.ReactNode
  items?: unknown[]
  component?: React.JSX.Element
}

type DefaultTableProps = DefaultProps & {
  header: string
}

/**
 * Component to render Disclosures
 *
 * @component
 * @param {DefaultProps}
 */

function Disclosures({children, items}: DefaultProps) {
  return (
    <Disclosure>
      {({open}) => (
        <CardContent className="py-4 px-4">
          <Disclosure.Button className="py-2 px-2 bg-gray-50 w-full">
            <div className="flex justify-between font-semibold uppercase">
              {children}
              <ChevronDownIcon
                className={joinClasses(
                  open ? 'transform rotate-180' : '',
                  'w-4',
                )}
              />
            </div>
          </Disclosure.Button>
          {items?.map(item => (
            <Disclosure.Panel key={item.title} className="text-gray-500 py-2">
              <div className="grid grid-rows-2 px-2">
                <CardTitle>{item.title}</CardTitle>
                <div>{item.data}</div>
              </div>
              <hr className="border border-gray-50 border-opacity-25 mt-2"></hr>
            </Disclosure.Panel>
          ))}
        </CardContent>
      )}
    </Disclosure>
  )
}

function DisclosuresTable({children, header}: DefaultTableProps) {
  return (
    <Disclosure>
      {({open}) => (
        <CardContent className="py-4 px-4">
          <Disclosure.Button className="py-2 px-2 bg-gray-50 w-full">
            <div className="flex justify-between font-semibold uppercase">
              {header}
              <ChevronDownIcon
                className={joinClasses(
                  open ? 'transform rotate-180' : '',
                  'w-4',
                )}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className="text-gray-500 py-2">
            {children}
          </Disclosure.Panel>
        </CardContent>
      )}
    </Disclosure>
  )
}

function DisclosuresComponent({children, component}: DefaultProps) {
  return (
    <Disclosure>
      {({open}) => (
        <CardContent className="py-4 px-4">
          <Disclosure.Button className="py-2 px-2 bg-gray-50 w-full">
            <div className="flex justify-between font-semibold uppercase">
              {children}
              <ChevronDownIcon
                className={joinClasses(
                  open ? 'transform rotate-180' : '',
                  'w-4',
                )}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className="text-gray-500 py-2 flex justify-center">
            {component}
          </Disclosure.Panel>
        </CardContent>
      )}
    </Disclosure>
  )
}

export {Disclosures, DisclosuresTable, DisclosuresComponent}
