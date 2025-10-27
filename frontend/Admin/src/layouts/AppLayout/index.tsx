import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar, NavHeader } from "@/components/layouts";
import { NavbarData } from "../../constants/data";
import NavbarItem from "../../components/layouts/navbar_item";
import { useRouter } from "next/router";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../../public/icons/logo.png";

function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenItem, setMobileOpenItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  // const logo = require("../../../public/icons/logo.png");

  // Handle screen size detection - consistent with navbar.tsx
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      // Use 1024px (tailwind's lg breakpoint) to match navbar.tsx
      const mobile = width < 1024;
      setIsMobile(mobile);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const gotoHome = () => {
    router.push("/dashboard");
  };

  return (
    // Changed h-screen to min-h-screen and removed overflow-hidden to ensure bottom content is visible
    <div className="bg-gray-50 w-full min-h-screen flex flex-row text-gray-800 font-sans">
      {/* Sidebar (desktop only) - hidden on mobile/tablet (< 1024px) */}
      <aside className="hidden lg:flex lg:fixed lg:top-0 lg:left-0 lg:z-50 w-[18vw] max-w-[260px] h-screen bg-white border-r border-gray-200 shadow-sm">
        <Navbar />
      </aside>

      {/* Mobile Sidebar Drawer - shown on mobile/tablet (< 1024px) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header with Logo + Close */}
        <div className="flex justify-between items-center p-4 border-b">
          <div
            className="cursor-pointer flex items-center space-x-2"
            onClick={gotoHome}
          >
            <Image
              src={logo}
              alt="A & A"
              width={60}
              height={60}
              priority
            />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-700 hover:text-gray-900"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {NavbarData.map((item, index) => {
            // console.log(
            //   "📱 AppLayout mobile NavbarItem:",
            //   item.name,
            //   "isMobile: true"
            // );
            return (
              <NavbarItem
                item={item}
                key={index}
                noSpace
                closeDrawer={() => {
                  // console.log('🚪 AppLayout closing drawer');
                  setMobileMenuOpen(false);
                  setMobileOpenItem(null);
                }}
                isMobile={true}
                mobileOpenItem={mobileOpenItem}
                setMobileOpenItem={setMobileOpenItem}
              />
            );
          })}
        </nav>
      </div>

      {/* Main Section */}
      <main className="flex-1 flex flex-col lg:ml-[18vw] lg:max-w-[calc(100vw-18vw)]">
        {/* Sticky Top Navbar - ensured it stays fixed with proper z-index */}
        <header className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 sm:px-6">
          <NavHeader />
        </header>

        {/* Content Area - fixed height issues and ensured scrollable content */}
        <section
          className={`flex-1 w-full overflow-y-auto px-0 sm:px-2 lg:px-2 py-0 transition-all duration-300 ${
            router.asPath.includes("/profile") ? "pt-14" : "pt-6"
          }`}
          // Added min-h-0 to ensure content area can shrink and scroll properly
          style={{ minHeight: 0 }}
        >
          <div className=" w-full ">
            {children}
          </div>
        </section>
      </main>

      {/* Floating Hamburger Button (mobile/tablet only) - hidden on desktop (>= 1024px) */}
      {isMobile && (
        <button
          onClick={() => {
            setMobileMenuOpen(true);
          }}
          className="lg:hidden fixed bottom-5 right-5 z-50 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 focus:outline-none"
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default AppLayout;