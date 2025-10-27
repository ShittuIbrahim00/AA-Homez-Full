// components/layouts/Navbar.tsx

import React, { useState } from "react";
import Image from "next/image";
import NavbarItem, { NavbarProvider } from "@/components/layouts/navbar_item";
import { NavbarData } from "../../constants/data";
import { useRouter } from "next/router";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../../public/icons/logo.png";

function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpenItem, setMobileOpenItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen size detection
  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      // Use 1024px (tailwind's lg breakpoint) instead of 768px to include tablet screens
      const mobile = width < 1024;
      // console.log('📏 Screen width:', width, 'isMobile:', mobile);
      setIsMobile(mobile);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const gotoHome = () => {
    router.push("/dashboard");
    setIsOpen(false);
    setMobileOpenItem(null);
  };

  return (
    <NavbarProvider>
      {/* Desktop Sidebar - Only show when not mobile (>= 1024px) */}
      {!isMobile && (
        <div className="w-[240px] h-screen px-6 py-5 flex flex-col bg-white shadow-md">
          {/* {console.log('🖥️ Desktop sidebar rendered (JS controlled)')} */
}
          <div
            className="cursor-pointer flex justify-center items-center mb-10"
            onClick={gotoHome}
          >
            <Image src={logo} alt="A & A" width={100} height={100} priority={true} />
          </div>
          <div className="flex flex-col space-y-4">
            {NavbarData.filter((item) => !router.asPath.includes("/profile")).map(
              (item, idx) => {
                // console.log(
                //   "🖥️ Rendering desktop NavbarItem:",
                //   item.name,
                //   "isMobile: false"
                // );
                return (
                  <NavbarItem item={item} key={item.id || idx} isMobile={false} />
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Mobile Top Navbar - Only show when mobile (< 1024px) */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white shadow-md z-30">
          {/* {console.log('📱 Mobile top navbar rendered (JS controlled)')} */
}
          <div className="cursor-pointer" onClick={gotoHome}>
            <Image src={logo} alt="A & A" width={50} height={50} priority={true} />
          </div>
          <button
            className="text-2xl z-40"
            onClick={() => {
              // console.log('📱 Mobile menu toggle clicked! Current isOpen:', isOpen, 'Will become:', !isOpen);
              setIsOpen((prev) => {
                const newValue = !prev;
                if (prev) {
                  // Closing menu - cleanup state
                  // console.log('🧹 Cleaning up mobile state');
                  setMobileOpenItem(null);
                }
                // console.log('📱 Mobile drawer state changed to:', newValue);
                return newValue;
              });
            }}
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      )}

      {/* Mobile Drawer - Only show when mobile and drawer is open */}
      {isMobile && isOpen && (
        <>
          {/* {console.log('📱 Mobile drawer is OPEN - isMobile:', isMobile, 'isOpen:', isOpen)} */
}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-50"
            onClick={() => {
              // console.log('🧹 Overlay clicked - closing mobile drawer');
              setIsOpen(false);
              setMobileOpenItem(null);
            }}
          >
            <div
              className="absolute top-0 left-0 w-[240px] h-full bg-white p-6 flex flex-col z-60 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="cursor-pointer self-center mb-10"
                onClick={gotoHome}
              >
                <Image src={logo} alt="A & A" width={80} height={80} priority={true} />
              </div>
              <div className="flex flex-col space-y-4">
                <div className="text-xs text-red-500 font-bold mb-2">🔍 MOBILE DRAWER CONTENT (isMobile={isMobile.toString()})</div>
                {NavbarData.filter(
                  (item) => !router.asPath.includes("/profile")
                ).map((item, idx) => {
                  // console.log(
                  //   "📱 Rendering mobile NavbarItem:",
                  //   item.name,
                  //   "mobileOpenItem:",
                  //   mobileOpenItem,
                  //   "isMobile: true (FORCED)"
                  // );
                  return (
                    <NavbarItem
                      key={`mobile-${item.id || idx}`}
                      item={item}
                      closeDrawer={() => {
                        // console.log('🚪 Closing drawer from child');
                        setIsOpen(false);
                        setMobileOpenItem(null);
                      }}
                      isMobile={true}
                      mobileOpenItem={mobileOpenItem}
                      setMobileOpenItem={setMobileOpenItem}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </NavbarProvider>
  );
}

export default Navbar;