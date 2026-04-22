import * as React from 'react'
import {useCallback, useEffect, useRef, useState} from 'react'
import {Link, useLocation} from 'react-router'

// Assume these icons are imported from an icon library
import {ChevronDownIcon, HorizontaLDots} from '../icons'
import {useSidebar} from '@/context/sidebarContext'
import {menuData} from './MenuData'
import {MenusNames, NavItem} from '@/types'
import {joinClasses, menuNames} from '@/utils/misc'

const AppSidebar: React.FC = () => {
  const {isExpanded, isMobileOpen, isHovered, setIsHovered} = useSidebar()
  const rawVersion = import.meta.env.VITE_APP_VERSION
  const appVersion =
    rawVersion && !rawVersion.startsWith('$') ? rawVersion : 'local'
  const [menuItems, setMenuItems] = React.useState<
    Record<MenusNames, NavItem[]>
  >({
    MENU: [],
    OTHERS: [],
  })
  React.useEffect(() => {
    async function getMenuData() {
      const menuLoaded = await menuData()
      setMenuItems(menuLoaded)
    }
    getMenuData()
  }, [])
  const location = useLocation()

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: MenusNames
    index: number
  } | null>(null)
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({})
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({})
  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  )

  useEffect(() => {
    Object.keys(menuItems).forEach(menuType => {
      const type = menuType as MenusNames
      const items = menuItems[type] ?? []
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach(subItem => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: type,
                index,
              })
            }
          })
        }
      })
    })
  }, [location, isActive, menuItems])

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`
      if (subMenuRefs.current[key]) {
        setSubMenuHeight(prevHeights => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }))
      }
    }
  }, [openSubmenu])

  const handleSubmenuToggle = (index: number, menuType: MenusNames) => {
    setOpenSubmenu(prevOpenSubmenu => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null
      }
      return {type: menuType, index}
    })
  }

  const renderMenuItems = (items: NavItem[], menuType: MenusNames) => {
    return (
      <ul className="flex flex-col gap-4">
        {items.map((nav, index) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-active'
                    : 'menu-item-inactive'
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'lg:justify-start'
                }`}
              >
                <span
                  className={`menu-item-icon-size  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={joinClasses(
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                        ? 'rotate-180 text-brand-500'
                        : '',
                    )}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? 'menu-item-active'
                      : 'menu-item-inactive'
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive'
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={el => {
                  subMenuRefs.current[`${menuType}-${index}`] = el
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : '0px',
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map(subItem => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? 'menu-dropdown-item-active'
                            : 'menu-dropdown-item-inactive'
                        }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? 'menu-dropdown-badge-active'
                                  : 'menu-dropdown-badge-inactive'
                              } menu-dropdown-badge`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? 'menu-dropdown-badge-active'
                                  : 'menu-dropdown-badge-inactive'
                              } menu-dropdown-badge`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <aside
      className={`fixed top-16 flex h-[calc(100vh-4rem)] flex-col px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${
          isExpanded || isMobileOpen
            ? 'w-[290px]'
            : isHovered
              ? 'w-[290px]'
              : 'w-[90px]'
        }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-full flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6 flex-1 pt-6">
          <div className="flex flex-col gap-4">
            {Object.keys(menuItems).map(menuType => {
              const type = menuType as MenusNames
              return menuItems[type].length > 0 ? (
                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? 'lg:justify-center'
                        : 'justify-start'
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      menuNames[type]
                    ) : (
                      <HorizontaLDots className="size-6" />
                    )}
                  </h2>
                  {renderMenuItems(menuItems[type], type)}
                </div>
              ) : (
                <React.Fragment />
              )
            })}
            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Others'
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, 'others')}
            </div> */}
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}

        {isExpanded || isHovered || isMobileOpen ? (
          <div className="mb-6 mt-auto flex justify-center border-t border-gray-200 pt-4 dark:border-gray-800">
            <span className="inline-flex min-w-20 justify-center rounded-md border border-gray-300 px-2 py-1 text-center text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
              v{appVersion}
            </span>
          </div>
        ) : null}
      </div>
    </aside>
  )
}

export default AppSidebar
