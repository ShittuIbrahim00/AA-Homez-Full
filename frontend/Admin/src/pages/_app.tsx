import "leaflet/dist/leaflet.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "@/layouts/AppLayout";
import Loader from "@/layouts/Loader";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "@/utils/toastMsg";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import ErrorBoundary from "@/components/Custom/ErrorBoundary";

// Import axios configuration for global setup
import "@/utils/axiosConfig";

import { UserProvider } from "@/context/user";
import { GlobalProvider } from "@/context/global";
import { PropertyProvider } from "@/context/property";
import { SchedulerProvider } from "@/context/scheduler";
import { UnreadCountProvider } from "@/context/useUnreadCount";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

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
  //   "🔍 AuthWrapper - Loading:",
  //   isLoading,
  //   "Authenticated:",
  //   isAuthenticated,
  //   "Public:",
  //   isPublicRoute,
  //   "Path:",
  //   router.pathname
  // );

  // Show loader while checking authentication
  if (isLoading) {
    // console.log("⏳ AuthWrapper - Showing loader (isLoading)");
    return <Loader />;
  }

  // If user is not authenticated and trying to access protected route, show loader
  // (the redirect will happen via useAuth hook)
  if (!isAuthenticated && !isPublicRoute) {
    // console.log(
    //   "🛑 AuthWrapper - Blocking access to protected route:",
    //   router.pathname
    // );
    return <Loader />;
  }

  // console.log("✅ AuthWrapper - Allowing access to:", router.pathname);
  return <>{children}</>;
}

function AppWrapper({ Component, pageProps, ...appProps }) {
  const router = useRouter();
  const isAuthRoute = router.pathname.startsWith("/auth");
  const LayoutWrapper = isAuthRoute ? React.Fragment : AppLayout;

  // Scroll to top on route change with smooth behavior
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup function to remove the event listener
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Set default title
  const [pageTitle, setPageTitle] = useState("A&A Homes - Creating an environment that nurtures");

  // Update title based on route
  useEffect(() => {
    // You can customize titles for specific routes here
    if (router.pathname === "/auth/login") {
      setPageTitle("A&A Homes - Login");
    } else if (router.pathname === "/auth/signup") {
      setPageTitle("A&A Homes - Sign Up");
    } else if (router.pathname === "/dashboard") {
      setPageTitle("A&A Homes - Dashboard");
    } else {
      setPageTitle("A&A Homes - Creating an environment that nurtures");
    }
  }, [router.pathname]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="A&A Homes - Creating an environment that nurtures" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FE783D" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/icons/logo.png" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aa-homes-admin.vercel.app/" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content="A&A Homes - Creating an environment that nurtures" />
        <meta property="og:image" content="/icons/logo.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://aa-homes-admin.vercel.app/" />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content="A&A Homes - Creating an environment that nurtures" />
        <meta property="twitter:image" content="/icons/logo.png" />
      </Head>
      <UserProvider>
        <GlobalProvider>
          <SchedulerProvider>
            <PropertyProvider>
              <UnreadCountProvider>
                <GoogleOAuthProvider clientId="540720650198-udm3p7bd6scj8u3vt1s56o5j9jbe8rj8.apps.googleusercontent.com">
                  <AuthWrapper>
                    <LayoutWrapper>
                      <Component {...pageProps} />
                    </LayoutWrapper>
                  </AuthWrapper>

                  <ToastContainer
                    {...toastConfig}
                  />
                </GoogleOAuthProvider>
              </UnreadCountProvider>
            </PropertyProvider>
          </SchedulerProvider>
        </GlobalProvider>
      </UserProvider>
    </>
  );
}

export default function App({ Component, pageProps, ...appProps }: AppProps) {
  return (
    <AppWrapper Component={Component} pageProps={pageProps} {...appProps} />
  );
}