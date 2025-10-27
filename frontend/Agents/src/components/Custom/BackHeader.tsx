import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";

interface BackHeaderProps {
  text?: string;
  className?: string;
}

const BackHeader = ({ text = "Back", className = "" }: BackHeaderProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition text-gray-700 font-medium shadow-sm border border-gray-300 hover:border-orange-300 ${className}`}
      aria-label={`Go back to ${text}`}
    >
      <FaArrowLeft className="text-lg" />
      {text}
    </button>
  );
};

export default BackHeader;