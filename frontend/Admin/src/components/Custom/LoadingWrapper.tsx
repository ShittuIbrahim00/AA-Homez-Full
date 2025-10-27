import React, { ReactNode } from "react";
import Spinner from "./Spinner";
import Loader from "@/layouts/Loader";

interface LoadingWrapperProps {
  loading: boolean;
  children: ReactNode;
  type?: "spinner" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingWrapper({
  loading,
  children,
  type = "spinner",
  size = "lg",
  className = ""
}: LoadingWrapperProps) {
  if (!loading) {
    return <>{children}</>;
  }

  if (type === "full") {
    return <Loader />;
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Spinner size={size} />
    </div>
  );
}