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

      {/* Spinning background circle - responsive sizing */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[100px] xs:w-[120px] sm:w-[150px] md:w-[200px] lg:w-[250px] h-[100px] xs:h-[120px] sm:h-[150px] md:h-[200px] lg:h-[250px] border-2 border-orange-300 rounded-full animate-spin-slow opacity-20"></div>
      </div>

      {/* Bouncing logo - responsive sizing */}
      <div
        className="relative flex items-center justify-center animate-bounce"
      >
        <Image
          src="/icons/logo.png"
          alt="logo"
          width={150}
          height={90}
          className="object-contain w-[150px] xs:w-[180px] sm:w-[200px] md:w-[250px] lg:w-[300px] h-auto"
          priority
        />
      </div>
    </div>
  );
}

export default Loader;