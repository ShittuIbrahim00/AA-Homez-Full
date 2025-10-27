import React, { useState } from "react";
import { Icon } from "@mui/material";
import Image from "next/image";
import { Input } from "@/components/Custom/index";
import { FaFire, FaHome, FaSearch } from "react-icons/fa";
import Spinner from "@/pages/notifications/Spinner";

const searchIcon = require("../../../public/icons/search.png");

function PropertyHeader(props) {
  const {
    noExternal,
    text,
    style,
    textStyle,
    onClick,
    search,
    setSearchTxt,
    searchTxt,
    data,
    icon,
    loading,
  } = props;

  const [showSearch, setShowSearch] = useState(false);

  const renderIcon = () => {
    if (icon === "fire") return <FaFire className="text-orange-500" />;
    if (icon === "home") return <FaHome className="text-blue-500" />;
    return null;
  };

  if (loading) {
    return (
      <div className={`flex flex-row items-center justify-between w-full mb-[30px] px-[20px] ${style}`}>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-row items-center justify-between w-full mb-[30px] px-[20px] ${style} max-w-full min-w-0`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {renderIcon()}
        <h2 className={`font-bold text-[20px] text-black ${textStyle} truncate`}>
          {text}
        </h2>
      </div>
      {search && !showSearch ? (
        <div 
          className={"cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"}
          onClick={() => setShowSearch(true)}
        >
          <FaSearch className="text-gray-600" />
        </div>
      ) : search && showSearch ? (
        <div className="flex items-center gap-2 w-full max-w-xs min-w-0">
          <Input
            value={searchTxt}
            onChange={(e) => setSearchTxt(e.target.value)}
            placeholder={"Search properties..."}
            containerStyle={"w-full min-w-0"}
            cancel
            type={"text"}
            handleToggle={() => setShowSearch(false)}
          />
        </div>
      ) : (
        !noExternal && data?.length > 0 && (
          <h3
            className={
              "font-medium text-[14px] text-main-primary cursor-pointer hover:underline flex-shrink-0"
            }
            onClick={() => onClick && onClick("Header")}
          >
            See all
          </h3>
        )
      )}
    </div>
  );
}

export default PropertyHeader;