import React, { useContext } from "react";
import { Navbar, NavHeader, MobileMenu } from "@/components/layouts";
import { NavbarData } from "../../constants/data";
import NavbarItem from "../../components/layouts/navbar_item";
import Loader from "@/layouts/Loader";
import { GlobalProvider } from "@/context/global";

function AppLayout({ children, inLoader }) {
  return (
    <>
      {inLoader ? (
        <Loader />
      ) : (
        <div
          className={
            "bg-white w-full min-h-screen flex flex-col md:flex-row overscroll-none relative"
          }
        >
          {/*NavBar Component - Fixed position for all screens */}
          <div className="fixed md:fixed z-navbar h-screen">
            <Navbar />
          </div>

          <div
            className={
              "w-full flex flex-col flex-1 pt-20 md:pt-0 md:ml-[240px]"
            }
          >
            {/*Navbar Header Component - FIXED POSITION FOR ALL SCREENS */}
            <div className="w-full md:w-[calc(100%-240px)] md:left-[240px] fixed top-0 left-0 right-0 z-tooltip">
              <NavHeader />
            </div>

            {/* wrapper childern - FIXED HEIGHT CALCULATION */}
            <div className="flex flex-col items-center w-full flex-1 overflow-y-auto pb-4 pt-5 relative z-0">
              {children}
            </div>
          </div>

          {/* Mobile Menu - Rendered at root level to ensure proper z-index */}
          <MobileMenu />
        </div>
      )}
    </>
  );
}

export default AppLayout;