import React, { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context/global";
import { UserContext } from "@/context/user";
import { NavbarData } from "../../constants/data";
import NavbarItem from "@/components/layouts/navbar_item";
import { DropProfileList } from "../../constants/data/header";
import { DropItem } from "@/components/header";
import { FaCalendarAlt } from "react-icons/fa";
import { useUnreadCount } from "@/context/useUnreadCount";
import { _getUser } from "@/hooks/user.hooks";
import { createPortal } from "react-dom";

// Icons
import search from "../../../public/icons/search.png";
import close from "../../../public/icons/close.png";
import notification from "../../../public/icons/notifications.png";
import logo from "../../../public/icons/logo.png";

function MobileMenu() {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext)!;
  const { tab, setTab } = useGlobalContext();
  const [searchText, setSearchText] = useState("");
  const { unreadCount, refreshUnreadCount } = useUnreadCount();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const init = async () => {
      const userData = await _getUser();
      if (userData !== false) {
        setUser(userData);
      }
    };
    init();
  }, [setUser]);

  // Refresh unread count when component mounts
  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileDropdown = document.getElementById('mobile-profile-dropdown');
      const profileButton = document.getElementById('mobile-profile-button');
      
      // Check if click is on the profile button itself
      if (profileButton && profileButton.contains(event.target as Node)) {
        return;
      }
      
      // Check if click is inside mobile dropdown
      if (profileDropdown && profileDropdown.contains(event.target as Node)) {
        return;
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

  const gotoNotification = () => {
    router.push("/notifications");
    setTab(false);
  };

  if (!tab) return null;

  // Get the position of the profile button to position the dropdown
  const getDropdownPosition = () => {
    if (typeof window === 'undefined') return { top: 0, left: 0 };
    
    const button = document.getElementById('mobile-profile-button');
    if (!button) return { top: 0, left: 0 };
    
    const rect = button.getBoundingClientRect();
    const dropdownHeight = 200; // Approximate height of dropdown
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Position dropdown above button if not enough space below
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      return {
        top: rect.top + window.scrollY - dropdownHeight,
        left: rect.left + window.scrollX
      };
    }
    
    // Default positioning below button
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    };
  };

  const dropdownPosition = getDropdownPosition();

  return (
    <>
      {/* Mobile Menu as Full Screen Overlay */}
      <div className="fixed inset-0 bg-white z-max md:hidden mobile-menu-overlay" style={{ zIndex: 9999 }}>
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center">
            <Image 
              src={logo} 
              alt="A & A" 
              width={40} 
              height={40} 
              className="object-contain"
            />
          </div>
          <button 
            onClick={() => setTab(false)} 
            className="p-2 rounded-full hover:bg-white/50 transition-all duration-300 shadow-sm"
            aria-label="Close menu"
          >
            <Image src={close} alt="Close" width={24} height={24} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center bg-white rounded-xl px-3 py-2 shadow-sm">
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
              placeholder="Search properties, agents, or locations..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="ml-2 flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
            <button
              onClick={handleSearch}
              className="ml-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md"
            >
              Search
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {NavbarData.map((item, index) => (
              <NavbarItem key={index} item={item} index={index} showTab />
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => {
                  setTab(false);
                  router.push('/schedule');
                }}
                className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mb-1">
                  <FaCalendarAlt className="text-orange-600 text-base" />
                </div>
                <span className="text-xs font-medium text-gray-700">Schedule</span>
              </button>
           
            </div>
          </div>
        </nav>

        <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-gray-100 sticky bottom-0">
          <div className="flex items-center">
            <div className="relative">
              <div 
                id="mobile-profile-button"
                className="flex items-center cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
                onClick={toggleProfileDropdown}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 hover:ring-2 hover:ring-orange-500 transition relative bg-gray-100 flex items-center justify-center shadow-sm">
                  {user?.agent?.imgUrl ? (
                    <Image src={user.agent.imgUrl} alt="profile" width={40} height={40} className="object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-gray-700">
                      {getInitials(fallback)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Mobile Profile Dropdown - We'll render this with a portal outside the overlay */}
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
              <div className="font-bold text-gray-900 truncate text-sm">{fullName || "User"}</div>
              <div className="text-xs text-gray-600 truncate">{email || "user@example.com"}</div>
            </div>
            <button 
              onClick={() => {
                setTab(false);
                router.push('/profile');
              }}
              className="px-3 py-1.5 bg-white text-orange-600 rounded-lg font-semibold text-xs border border-orange-200 hover:bg-orange-50 transition-colors"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Render profile dropdown using portal to ensure it appears above everything */}
      {showProfileDropdown && typeof document !== 'undefined' && createPortal(
      <div 
  id="mobile-profile-dropdown"
  className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-56 bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden md:hidden"
  style={{ zIndex: 1040 }}
>

          {DropProfileList.map((item, index) => (
            <div 
              key={index}
              onClick={() => {
                setShowProfileDropdown(false);
                setTab(false);
              }}
            >
              <DropItem 
                item={item} 
                index={index} 
              />
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

export default MobileMenu;