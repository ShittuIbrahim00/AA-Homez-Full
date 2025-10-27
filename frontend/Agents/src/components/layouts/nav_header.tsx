import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { DropItem } from "@/components/header";
import { _getUser } from "@/hooks/user.hooks";
import { UserContext } from "@/context/user";
import { useGlobalContext } from "@/context/global";
import { createPortal } from "react-dom";

import { NavbarData } from "../../constants/data";
import NavbarItem from "@/components/layouts/navbar_item";
import { FaCalendarAlt } from "react-icons/fa";

// Icons
import search from "../../../public/icons/search.png";
import bar from "../../../public/icons/menu-bar.png";
import close from "../../../public/icons/close.png";
import notification from "../../../public/icons/notifications.png";
import arrow_down from "../../../public/icons/arrow_drop_down.png";
import profileImg from "../../../public/images/user.png";
import { DropProfileList } from "../../constants/data/header";
import { useAgentUnreadCount } from "@/hooks/useAgentUnreadCount";
import { useUnreadCount } from "@/context/useUnreadCount";

function NavHeader() {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext)!; // assert non-null since context is not null
  const { tab, setTab } = useGlobalContext();
  const [searchText, setSearchText] = useState("");
  const { unreadCount, refreshUnreadCount } = useUnreadCount();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // For mobile profile dropdown

  const gotoNotification = () => router.push("/notifications");
  
  useEffect(() => {
    const init = async () => {
      const userData = await _getUser();
      if (userData !== false) {
        setUser(userData);
        const aid = userData?.agent?.aid;
        if (aid) localStorage.setItem("$agent_id", aid.toString());
      }
    };
    init();
  }, [setUser]);

  // Refresh unread count when component mounts
  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  // Handle window resize to close mobile menu when screen becomes large
  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setTab(false);
        setShowProfileDropdown(false); // Close profile dropdown on resize
      }
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away to set correct state on initial load
    handleResize();
    
    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [setTab]);

  // console.log("User:", user);

  const getInitials = (input: string = "") => {
    const parts = input.trim().split(" ");
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const fullName = user?.agent?.fullName || "";
  const email = user?.agent?.email || "";
  const fallback = fullName.trim() || email.trim() || "U";

  const handleSearch = () => {
    const trimmed = searchText.trim();
    if (trimmed !== "") {
      router.push(`/home?search=${encodeURIComponent(trimmed)}`);
      if (tab) setTab(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Toggle profile dropdown for mobile
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Close profile dropdown when clicking outside (for both mobile and desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileDropdown = document.getElementById('profile-dropdown');
      const mobileProfileDropdown = document.getElementById('mobile-profile-dropdown');
      const profileButton = document.getElementById('profile-button');
      
      // Check if click is on the profile button itself
      if (profileButton && profileButton.contains(event.target as Node)) {
        return; // Don't close if clicking the profile button
      }
      
      // Check if click is inside either dropdown
      if (profileDropdown && profileDropdown.contains(event.target as Node)) {
        return; // Don't close if clicking inside desktop dropdown
      }
      
      if (mobileProfileDropdown && mobileProfileDropdown.contains(event.target as Node)) {
        return; // Don't close if clicking inside mobile dropdown
      }
      
      // Click is outside, close dropdown
      setShowProfileDropdown(false);
    };

    // Only add listener if dropdown is open
    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <div className="w-full bg-white border-b border-gray-200 relative z-tooltip sm:py-4 shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between py-4 px-4 md:px-8">
     
        <div className="block md:hidden">
          <button onClick={() => setTab((prev) => !prev)} aria-label="Toggle menu" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Image src={bar} alt="Menu" width={28} height={28} />
          </button>
        </div>

   
        <div className="hidden md:flex flex-1 max-w-lg mx-6">
          <div className="flex w-full bg-gray-100 rounded-xl px-4 py-3 items-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <Image
              src={search}
              alt="Search"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="Search for city, neighborhood, or address"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="flex-1 ml-3 bg-transparent outline-none text-base text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleSearch}
              className="ml-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-lg text-base font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Search
            </button>
          </div>
        </div>

      
        <div className="flex items-center space-x-4 ml-auto  p-2 ">
     <div className="relative overflow-visible">
  <div
    className="cursor-pointer p-2 hover:bg-gray-100 relative md:p-3 overflow-visible"
    onClick={gotoNotification}
  >
    <Image
      src={notification}
      alt="Notifications"
      width={24}
      height={24}
      className="md:w-7 md:h-7"
    />
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center justify-center md:text-sm md:px-2.5 md:py-1.5">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    )}
  </div>
</div>


          {/* Profile section with properly positioned dropdown */}
          <div className="relative">
            <div 
              id="profile-button"
              className="flex items-center cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
              onClick={toggleProfileDropdown}
            >
          
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 hover:ring-2 hover:ring-orange-500 transition relative bg-gray-100 flex items-center justify-center shadow-sm">
                {user?.agent?.imgUrl ? (
                  <Image src={user.agent.imgUrl} alt="profile" fill className="object-cover" />
                ) : (
                  <span className="text-xs md:text-base font-bold text-gray-700">
                    {getInitials(fallback)}
                  </span>
                )}
              </div>

              {/* Dropdown arrow */}
              <Image
                src={arrow_down}
                alt="arrow down"
                width={14}
                height={22}
                className={`ml-2 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`}
              />
            </div>

            {/* Desktop dropdown menu - click based like mobile */}
    {showProfileDropdown && typeof document !== 'undefined' && createPortal(
  <div 
    id="profile-dropdown"
    className="fixed right-4 top-[70px] md:top-[100px] w-56 bg-white shadow-xl rounded-xl z-toast border border-gray-200 overflow-hidden"
    style={{ zIndex: 1040 }}
  >
    {DropProfileList.map((item, index) => (
      <DropItem key={index} item={item} index={index} />
    ))}
  </div>,
  document.body
)}

          </div>
        </div>
      </div>
    </div>
  );
}

export default NavHeader;