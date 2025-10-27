import React from "react";
import Image from "next/image";
import NavbarItem from "@/components/layouts/navbar_item";
import { NavbarData } from "../../constants/data";
import { useRouter } from "next/router";

function Navbar() {
  const router = useRouter();
  const logo = require("../../../public/icons/logo.png");

  const gotoHome = () => {
    router.push({ pathname: "/home" }, undefined, { shallow: true });
  };

  return (
    <aside className="w-[240px] bg-white h-screen border-r border-gray-200 hidden sm:flex flex-col px-6 py-8">
      {/* Logo */}
      <div
        onClick={gotoHome}
        className="cursor-pointer flex justify-center mb-16"
      >
        <Image
          src={logo}
          alt="A & A"
          className="w-20 h-20 object-contain"
          width={80}
          height={80}
        />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col justify-start space-y-8 overflow-y-auto flex-1">
        {NavbarData.map((item, index) => (
          <NavbarItem key={index} item={item} index={index} />
        ))}
      </nav>
    </aside>
  );
}

export default Navbar;