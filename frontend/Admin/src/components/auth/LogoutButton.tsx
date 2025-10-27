import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  confirmLogout?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition",
  children = "Logout",
  confirmLogout = true,
}) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (confirmLogout) {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (!confirmed) return;
    }

    logout();
  };

  return (
    <button onClick={handleLogout} className={className} type="button">
      {children}
    </button>
  );
};

export default LogoutButton;
