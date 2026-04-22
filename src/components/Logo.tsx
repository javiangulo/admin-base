/**
 * Logo with Icon and Brandname
 *
 * @component
 */
function Logo() {
  return (
    <div className="mb-8">
      <span className="inline-flex rounded-md bg-gray-900 px-2 py-1 text-xs font-semibold tracking-wide text-white dark:bg-white dark:text-gray-900">
        ADMIN
      </span>
    </div>
  )
}

/**
 * Logo with only Brandname
 *
 * @component
 */
function LogoBrandname() {
  return (
    <div className="flex justify-center">
      <span className="inline-flex rounded-xl border border-gray-300 px-4 py-3 text-lg font-bold tracking-[0.2em] text-gray-800 dark:border-gray-700 dark:text-gray-100">
        ADMIN
      </span>
    </div>
  )
}

/**
 * Logo with only the icon
 *
 * @component
 */
type SidebarUserProps = {
  collapse: boolean
}
function LogoIcon(_collapse: SidebarUserProps) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-white dark:bg-white dark:text-gray-900">
      A
    </span>
  )
}

export {Logo, LogoBrandname, LogoIcon}
