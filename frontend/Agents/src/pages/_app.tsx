"use client";

import "leaflet/dist/leaflet.css";
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Loader from "@/layouts/Loader";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Contexts
import { UserProvider } from "@/context/user";
import { GlobalProvider, useGlobalContext } from "@/context/global";
import { PropertyProvider } from "@/context/property";
import { SchedulerProvider } from "@/context/scheduler";
import { UnreadCountProvider } from "@/context/useUnreadCount";
// Hooks
import { _getUser } from "@/hooks/user.hooks";

// Main AppWrapper that manages layout and auth
function AppWrapper({ Component, pageProps, ...appProps }: AppProps) {
  const router = useRouter();
  const { loading, setLoading } = useGlobalContext();
  const [authChecked, setAuthChecked] = useState(false); // ✅ New state

  const isAuthRoute = router.pathname.startsWith("/auth");

  // Scroll to top on every route change
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("$token_key");

      if (!token && !isAuthRoute) {
        router.replace("/auth/login");
        return;
      }

      if (token) {
        await verifyUser();
      }

      setAuthChecked(true); // ✅ Auth check complete
    };

    checkAuth();
  }, [router.pathname]);

  const verifyUser = async () => {
    setLoading(true);
    const user = await _getUser();

    if (!user) {
      localStorage.clear();
      router.replace("/auth/login");
    } else {
      const aid = user?.agent?.aid;
      if (aid) {
        localStorage.setItem("$agent_id", aid.toString());
      }
    }

    setLoading(false);
  };

  const Layout = isAuthRoute ? AuthLayout : AppLayout;

  // ✅ Block rendering until authChecked
  if (!authChecked && !isAuthRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId="540720650198-udm3p7bd6scj8u3vt1s56o5j9jbe8rj8.apps.googleusercontent.com">
      <Layout inLoader={loading}>
        {loading && !isAuthRoute ? (
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        ) : (
          <div className="w-full min-h-screen">
            <Component {...pageProps} />
          </div>
        )}
      </Layout>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        // Responsive settings
        limit={3}
        toastClassName="relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        bodyClassName="text-sm font-white font-med block p-3"
        className="toast-container"
        style={{
          top: '1rem',
          right: '1rem',
          width: 'auto',
          maxWidth: '90vw',
        }}
        // Additional responsive properties
        role="alert"
        aria-live="polite"
      />
    </GoogleOAuthProvider>
  );
}

// Top-level App with providers
export default function App({ Component, pageProps, ...appProps }: AppProps) {
  return (
    <UserProvider>
      <GlobalProvider>
        <SchedulerProvider>
          <UnreadCountProvider>
            <PropertyProvider>
              <AppWrapper
                Component={Component}
                pageProps={pageProps}
                {...appProps}
              />
            </PropertyProvider>
          </UnreadCountProvider>
        </SchedulerProvider>
      </GlobalProvider>
    </UserProvider>
  );
}