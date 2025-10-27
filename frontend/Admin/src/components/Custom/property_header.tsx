import React, { useState, useEffect } from "react";
// import { Icon } from "@mui/material";
import Image from "next/image";
import { Input } from "@/components/Custom/index";

const searchIcon = require("../../../public/icons/search.png");

function PropertyHeader(props) {
  const {
    noExternal,
    text,
    style,
    textStyle,
    onClick,
    onSearch, // Add onSearch prop
    searchPlaceholder,
    searchValue,
    data,
  } = props;

  const [showSearch, setShowSearch] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(searchValue || "");
  const [search, setSearch] = useState(true); // Add search state

  // Sync local search value with prop
  useEffect(() => {
    setLocalSearchValue(searchValue || "");
  }, [searchValue]);

  // Handle search input changes
  const handleSearchChange = (value) => {
    setLocalSearchValue(value);
    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle search cancellation
  const handleCancelSearch = () => {
    setShowSearch(false);
    setLocalSearchValue("");
    // Clear search when cancelled
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div
      className={`flex flex-row items-center justify-between w-full mb-[15px] px-[20px] ${style}`}
    >
      <h2 className={`font-bold text-[18px] text-black ${textStyle}`}>
        {text}
      </h2>
      {search && !showSearch ? (
        <div className={"cursor-pointer"} onClick={() => setShowSearch(true)}>
          <Image
            src={searchIcon}
            alt={"Search"}
            className={"w-[22px] h-[22px]"}
          />
        </div>
      ) : search && showSearch ? (
        <Input
          value={localSearchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={searchPlaceholder || "Search"}
          containerStyle={"w-[40%]"}
          cancel
          onCancel={handleCancelSearch}
        />
      ) : (
        // !noExternal ||
        data?.length > 0 && (
          <h3
            className={
              "font-light text-[15px] text-main-primary cursor-pointer"
            }
            onClick={() => onClick("Header")}
          >
            See all
          </h3>
        )
      )}
    </div>
  );
}

export default PropertyHeader;