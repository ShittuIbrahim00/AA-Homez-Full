// pages/properties/add-sub/index.tsx
import { useState, useEffect } from "react";
import Loader from "@/layouts/Loader";

// ✅ reusing the AddSubPropertyForm from [id]/add-sub
import AddSubPropertyPage from "../[id]/add-sub/AddSubPropertyForm";

export default function AddSubPropertyStandalone() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fake loading for UX — replace with real API check if needed
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <Loader />
      </div>
    );
  }

  return <AddSubPropertyPage />;
}
