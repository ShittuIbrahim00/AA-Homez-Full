import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context/global";

function NavbarItem(props) {
  const { tab, setTab } = useGlobalContext();
  const { item, showTab = false } = props;

  const router = useRouter();
  const routeName = router.pathname;
  const isActive = routeName === item.route;

  const _gotoRoute = (route) => {
    router.push({ pathname: route }, undefined, { shallow: true });
    if (showTab) setTab(false); // Close mobile nav after click
  };

  return (
    <div
      onClick={() => _gotoRoute(item.route)}
      className={`
        group relative flex items-center w-full cursor-pointer
        transition-all duration-200 ease-in-out
        px-3 py-2.5 md:px-4 md:py-3 rounded-md
        ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <span className="absolute left-0 top-1 bottom-1 md:top-2 md:bottom-2 w-[2px] md:w-[3px] rounded-full bg-blue-600 transition-all" />
      )}

      {/* Icon */}
      <Image
        src={isActive ? item.active_icon : item.icon}
        alt={item.name}
        width={20}
        height={20}
        className="min-w-[20px] md:min-w-[24px]"
      />

      {/* Label (name) - Always visible in mobile menu when showTab is true, hidden on desktop sidebar */}
      <h2
        className={`
          ml-3 text-xs md:text-sm font-medium tracking-wide text-gray-800
          ${isActive ? "text-blue-600 font-semibold" : ""}
          ${showTab ? "block" : "hidden lg:block"}
        `}
      >
        {item.name}
      </h2>
    </div>
  );
}

export default NavbarItem;