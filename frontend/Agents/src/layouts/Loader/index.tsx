import React, { useEffect, useState } from "react";
import Image from "next/image";

interface LoaderProps {
  show?: boolean; // optional controlled mode
}

function Loader({ show }: LoaderProps) {
  const [visible, setVisible] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // === Controlled Mode ===
  useEffect(() => {
    if (show === undefined) return; // fallback to page-load mode
    if (show) {
      setVisible(true);
      setFadeIn(true);
    } else {
      setFadeIn(false);
      setTimeout(() => setVisible(false), 700); // match transition duration
    }
  }, [show]);

  // === Page Mount Mode ===
  useEffect(() => {
    if (show !== undefined) return; // skip if in controlled mode

    const handlePageLoad = () => {
      setFadeIn(false);
      setTimeout(() => setVisible(false), 700);
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => window.removeEventListener("load", handlePageLoad);
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-main-milk z-50 transition-opacity duration-700 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-white to-orange-200 opacity-40"></div>

      {/* Spinning background circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] border-2 border-orange-300 rounded-full animate-spin-slow opacity-20"></div>
      </div>

      {/* Bouncing logo */}
      <div
        className="relative flex items-center justify-center animate-bounce
                   w-[150px] h-[90px]
                   sm:w-[200px] sm:h-[120px]
                   md:w-[250px] md:h-[150px]
                   lg:w-[300px] lg:h-[180px]"
      >
        <Image
          src="/icons/logo.png"
          alt="logo"
          width={300}
          height={180}
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
}

export default Loader;
