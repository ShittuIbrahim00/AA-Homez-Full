import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });
  const router = useRouter();

  // Check if user is authenticated
  const checkAuth = () => {
    try {
      const token = localStorage.getItem("business-token");
      const userStr = localStorage.getItem("user");

      // console.log("🔍 Auth Check - Token:", token ? "Present" : "Missing");
      // console.log("🔍 Auth Check - User:", userStr ? "Present" : "Missing");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          // console.log("✅ Auth Check - Valid authentication found");
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user,
          });
          return true;
        } catch (parseError) {
          console.error("❌ Error parsing user data:", parseError);
          // Clear invalid data
          localStorage.removeItem("user");
          localStorage.removeItem("business-token");
        }
      }

      // console.log("❌ Auth Check - No valid authentication found");
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
      return false;
    } catch (error) {
      console.error("❌ Auth check error:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
      return false;
    }
  };

  // Login function
  const login = (userData: any, token: string) => {
    try {
      localStorage.setItem("business-token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: userData,
      });
    } catch (error) {
      console.error("Error saving auth data:", error);
      toast.error("Failed to save login data");
    }
  };

  // Logout function
  const logout = (showMessage = true) => {
    try {
      // Clear all possible token keys
      localStorage.removeItem("business-token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("guard-token");
      localStorage.removeItem("$token_key");
      localStorage.removeItem("user");

      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });

      if (showMessage) {
        toast.success("Logged out successfully");
      }

      // Redirect to login
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check auth on mount and route changes
  useEffect(() => {
    // console.log(
    //   "🔍 useAuth Effect - Route:",
    //   router.pathname,
    //   "Ready:",
    //   router.isReady
    // );

    if (!router.isReady) {
      // console.log("⏳ Router not ready, waiting...");
      return;
    }

    const isAuth = checkAuth();

    // Define public routes that don't require authentication
    const publicRoutes = [
      "/auth/login",
      "/auth/signup",
      "/auth/forgot",
      "/",
      "/home",
    ];

    const isPublicRoute = publicRoutes.some((route) => {
      // Exact match for root path
      if (route === "/" && router.pathname === "/") return true;
      // For other routes, check if they start with the route (but not root)
      if (route !== "/" && router.pathname.startsWith(route)) return true;
      return false;
    });

    // console.log(
    //   "🔍 Route Check - IsAuth:",
    //   isAuth,
    //   "IsPublic:",
    //   isPublicRoute,
    //   "Path:",
    //   router.pathname
    // );

    // If user is not authenticated and not on a public route, redirect to login
    if (!isAuth && !isPublicRoute) {
      // console.log(
      //   "🔐 Redirecting to login - no valid auth found for:",
      //   router.pathname
      // );
      router.replace("/auth/login");
      return;
    }

    // If user is authenticated and on login page, redirect to dashboard
    if (isAuth && router.pathname === "/auth/login") {
      // console.log("✅ User already authenticated, redirecting to dashboard");
      router.replace("/dashboard");
    }
  }, [router.pathname, router.isReady]); // Added router.isReady to dependencies

  // Handle token expiration and 401 errors globally
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "business-token" && !e.newValue) {
        // Token was removed, logout user
        logout(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  };
};
