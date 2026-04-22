import * as React from 'react'

/**
 * Renders a ghost table, this is usefull to simulate the loading status
 *
 * @component
 */
function TableGhost() {
  const items = Array(4).fill(null)

  return (
    <div className="-my-2 overflow-x-auto">
      <div className="py-2 align-middle inline-block min-w-full">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 animate-pulse">
            <thead className="bg-gray-50">
              <tr>
                {items.map((_, idx) => (
                  <th key={idx} scope="col" className="px-6 py-3">
                    <p className="bg-gray-200 text-gray-200 h-8">fake</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((_, idxtr) => (
                <tr key={idxtr}>
                  {items.map((_, idxtd) => (
                    <td className="px-6 py-4 whitespace-nowrap" key={idxtd}>
                      <p className="bg-gray-200 text-gray-200 text-sm">
                        fakecolumn
                      </p>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export {TableGhost}
