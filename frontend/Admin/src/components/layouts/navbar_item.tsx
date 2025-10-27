// components/layouts/navbar_item.tsx

import React, { useContext } from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// Context for desktop dropdown
const NavbarContext = React.createContext<{
  openMenu: string | null;
  setOpenMenu: (name: string | null) => void;
}>({
  openMenu: null,
  setOpenMenu: () => {},
});

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  return (
    <NavbarContext.Provider value={{ openMenu, setOpenMenu }}>
      {children}
    </NavbarContext.Provider>
  );
};

interface NavbarChild {
  name: string;
  route: string;
}

interface NavbarItemProps {
  item: {
    name: string;
    route: string;
    icon: string | StaticImageData;
    active_icon: string | StaticImageData;
    children?: NavbarChild[];
  };
  noSpace?: boolean;
  closeDrawer?: () => void;
  isMobile?: boolean;
  mobileOpenItem?: string | null;
  setMobileOpenItem?: (name: string | null) => void;
}

const NavbarItem: React.FC<NavbarItemProps> = ({
  item,
  noSpace,
  closeDrawer,
  isMobile = false,
  mobileOpenItem,
  setMobileOpenItem,
}) => {
  const router = useRouter();
  const { openMenu, setOpenMenu } = useContext(NavbarContext);

  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = item.children?.some((c) =>
    router.pathname.startsWith(c.route)
  );
  const isActive = router.pathname === item.route || isChildActive;

  const isOpen = isMobile
    ? mobileOpenItem === item.name
    : openMenu === item.name;

  const _gotoRoute = (route: string) => {
    router.push(route);
    if (closeDrawer) closeDrawer();
    if (isMobile) {
      setMobileOpenItem?.(null);
    } else {
      setOpenMenu(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // console.log(
    //   "🔘 NavbarItem clicked:",
    //   item.name,
    //   "hasChildren:",
    //   hasChildren,
    //   "isMobile:",
    //   isMobile,
    //   "currentOpen:",
    //   isMobile ? mobileOpenItem : openMenu
    // );

    if (hasChildren) {
      if (isMobile) {
        const newValue = isOpen ? null : item.name;
        // console.log(
        //   "📱 Mobile submenu toggle:",
        //   item.name,
        //   "from",
        //   mobileOpenItem,
        //   "to",
        //   newValue
        // );
        setMobileOpenItem?.(newValue);
      } else {
        const newValue = isOpen ? null : item.name;
        // console.log(
        //   "🖥️ Desktop submenu toggle:",
        //   item.name,
        //   "from",
        //   openMenu,
        //   "to",
        //   newValue
        // );
        setOpenMenu(newValue);
      }
    } else {
      // console.log("🔗 Navigating to route:", item.route);
      _gotoRoute(item.route);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        className={`group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200
          ${
            isActive
              ? "bg-main-primary/10 text-main-primary"
              : "hover:bg-gray-100"
          }
          ${noSpace ? "mb-2" : "mb-4"}`}
        onClick={handleClick}
        aria-current={isActive ? "page" : undefined}
      >
        <div className="flex items-center space-x-3">
          <Image
            src={isActive ? item.active_icon : item.icon}
            alt={item.name}
            width={24}
            height={24}
            className="w-6 h-6"
            priority={isActive}
          />
          <span
            className={`text-sm font-medium transition-colors ${
              isActive
                ? "text-main-primary"
                : "text-gray-700 group-hover:text-gray-900"
            }`}
          >
            {item.name}
          </span>
        </div>

        {hasChildren &&
          (isOpen ? (
            <FaChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <FaChevronDown className="w-4 h-4 text-gray-500" />
          ))}
      </button>

      {/* Children - Enhanced for mobile */}
      {hasChildren && (
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isMobile ? 'ml-4' : 'ml-8'
          } mt-2 ${
            isOpen 
              ? "max-h-96 opacity-100 transform translate-y-0" 
              : "max-h-0 opacity-0 transform -translate-y-2"
          }`}
          style={{
            transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
            willChange: isOpen ? 'max-height, opacity, transform' : 'auto'
          }}
        >
          <div className={`flex flex-col rounded-lg shadow-inner space-y-1 p-2 ${
            isMobile ? 'bg-gray-100' : 'bg-gray-50'
          }`}>
            {item.children!.map((child, idx) => {
              const childActive = router.pathname === child.route;
              return (
                <button
                  key={idx}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors touch-manipulation ${
                    childActive
                      ? "font-semibold text-main-primary bg-main-primary/10"
                      : "text-gray-600 hover:text-main-primary hover:bg-gray-100 active:bg-gray-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // console.log('🔗 Child menu clicked:', child.name, 'route:', child.route, 'isMobile:', isMobile);
                    _gotoRoute(child.route);
                  }}
                >
                  {child.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarItem;
export { NavbarContext };