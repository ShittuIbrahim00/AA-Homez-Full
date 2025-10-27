import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useProperty } from "@/hooks/useProperty";
import AddSubPropertyForm from "./AddSubPropertyForm";
import Loader from "@/layouts/Loader";
import { FaArrowLeft } from "react-icons/fa";

interface Property {
  name: string;
  pid: number;
}

export default function AddSubPropertyPage() {
  const router = useRouter();
  const { id } = router.query;
  const { property, loading, error } = useProperty(id as string);

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <Loader />
      </div>
    );

  if (error || !property)
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <p className="text-red-500 text-lg">Property not found.</p>
      </div>
    );

  return (
    <div className="max-w-6xl w-full mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <AddSubPropertyForm />
    </div>
  );
}
