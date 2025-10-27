import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { DropItem } from "@/components/header";
import { _getUser } from "@/hooks/user.hooks";
import { UserContext } from "@/context/user";
import { User } from "@/types/user";
import { useUnreadCount } from "@/context/useUnreadCount";
import searchIcon from "../../../public/icons/search.png";
import notification from "../../../public/icons/notifications.png";
import arrow_down from "../../../public/icons/arrow_drop_down.png";
import profileImg from "../../../public/images/user.png";
import logo from "../../../public/icons/logo.png";
import { DropProfileList } from "../../constants/data/header";
// import { useAdminUnreadCount } from "@/hooks/useNotificationCount";



function NavHeader() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  // const logo = require("../../../public/icons/logo.png");

  const userCtx = useContext(UserContext);
  if (!userCtx) throw new Error("UserContext not found");

  const [user, setUser] = userCtx;
  const [imgError, setImgError] = useState(false);
  const { unreadCount } = useUnreadCount();

  // console.log("NavHeader - unreadCount:", unreadCount);

  const gotoHome = () => router.push("/dashboard");
  const gotoNotification = () => router.push("/notifications");

  useEffect(() => {
    if (!user?.token) {
      (async () => {
        const userData = await _getUser();
        //  console.log("Fetched user data:", userData);
        if (userData) setUser(userData);
      })();
    }
  }, [user, setUser]);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      router.push(
        `/properties?search=${encodeURIComponent(searchQuery.trim())}`
      );
    } else {
      // If search is empty, go to properties page without search param
      router.push("/properties");
    }
  };

  const getInitials = (name: string = ""): string => {
    const parts = name.trim().split(" ");
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const fullName =
    user?.fullName?.trim() ||
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    "NN";

  // console.log("user.imgUrl", user?.imgUrl);
  // console.log("Initials:", getInitials(fullName));

  return (
    <header className="w-full bg-white shadow-sm py-2 md:py-3 z-50">
      <div className="flex items-center justify-between py-2 px-2 md:px-6">
        {/* Logo */}
        <div className="cursor-pointer md:hidden" onClick={gotoHome}>
          <Image
            src={logo}
            alt="A & A"
            width={70}
            height={70}
            priority
          />
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="flex w-full bg-gray-100 rounded-lg px-4 py-2 items-center shadow-sm hover:shadow-md transition">
            <Image
              src={searchIcon}
              alt="Search"
              width={18}
              height={18}
              className="cursor-pointer"
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="Search for city, neighborhood, or address"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                // Reset search when input is cleared
                if (value === "") {
                  router.push("/properties");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                } else if (e.key === "Escape") {
                  setSearchQuery("");
                  router.push("/properties");
                }
              }}
              className="flex-1 ml-2 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleSearch}
              className="ml-2 bg-main-primary text-white px-3 py-1 rounded text-sm font-medium hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-main-primary focus:ring-offset-1"
              aria-label="Search"
              type="button"
            >
              Search
            </button>
          </div>
        </div>

        {/* Add Property Button */}
        {/* <div className="hidden md:flex items-center">
          <button
            onClick={() => router.push("/properties/add")}
            className="bg-main-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-main-primary focus:ring-offset-2"
          >
            Add Property
          </button>
        </div> */}

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div
              className="cursor-pointer p-1.5 rounded-full hover:bg-gray-100 transition"
              onClick={gotoNotification}
            >
              <Image
                src={notification}
                alt="Notifications"
                width={24}
                height={24}
              />
            </div>

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-semibold px-1.5 py-[1px] rounded-full z-10">
                {unreadCount > 100 ? '99+' : unreadCount}
              </span>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative group">
            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8 rounded-full border relative group-hover:ring-2 group-hover:ring-orange-500 transition bg-orange-500 text-white flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                {user?.imgUrl && !imgError ? (
                  <Image
                    src={user.imgUrl}
                    alt="profile"
                    fill
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span>{getInitials(fullName)}</span>
                )}
              </div>

              <Image
                src={arrow_down}
                alt="arrow down"
                width={12}
                height={12}
                className="ml-2 transition-transform group-hover:rotate-180"
              />
            </div>

            <div className="absolute right-0 mt-1.5 w-48 bg-white shadow-md rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              {DropProfileList.map((item, index) => (
                <DropItem key={index} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-3 pb-2">
        <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5 shadow-sm">
          <Image
            src={searchIcon}
            alt="Search"
            width={16}
            height={16}
            className="cursor-pointer"
            onClick={handleSearch}
          />
          <input
            type="text"
            placeholder="Search for Property, neighborhood, or address"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              // Reset search when input is cleared
              if (value === "") {
                router.push("/properties");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              } else if (e.key === "Escape") {
                setSearchQuery("");
                router.push("/properties");
              }
            }}
            className="flex-1 ml-2 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
    </header>
  );
}

export default NavHeader;