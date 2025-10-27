import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import Loader from "@/layouts/Loader";

interface WithAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: string;
}

// Higher-order component for protecting pages
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: { redirectTo?: string; requiredRole?: string }
) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        const redirectPath = options?.redirectTo || "/auth/login";
        router.replace(redirectPath);
      }
    }, [isLoading, isAuthenticated, router]);

    // Show loading while checking auth
    if (isLoading) {
      return <Loader />;
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
      return <Loader />;
    }

    // Check role if specified
    if (options?.requiredRole && user?.role !== options.requiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You don't have permission to view this page.
            </p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

// React component version for wrapping JSX
export const ProtectedRoute: React.FC<WithAuthProps> = ({
  children,
  redirectTo = "/auth/login",
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Loader />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
