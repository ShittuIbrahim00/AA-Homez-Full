// ✅ src/hooks/useCooldown.ts
import { useEffect, useState } from "react";

export const useCooldown = (key: string, duration: number) => {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const storedUntil = localStorage.getItem(key);
    if (storedUntil) {
      const cooldownUntil = parseInt(storedUntil, 10);
      const now = Date.now();
      if (cooldownUntil > now) {
        const secondsLeft = Math.ceil((cooldownUntil - now) / 1000);
        setCooldown(secondsLeft);
      }
    }
  }, [key]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const start = () => {
    const cooldownUntil = Date.now() + duration * 1000;
    localStorage.setItem(key, cooldownUntil.toString());
    setCooldown(duration);
  };

  return { cooldown, start };
};
