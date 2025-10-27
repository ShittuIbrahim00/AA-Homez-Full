import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

function DropItem({ item, index }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleClick = (i) => {
    if (i.id === 2) {
      // Use the new auth hook for logout
      logout();
    } else {
      router.push(i.route, undefined, { shallow: true });
    }
  };

  return (
    <div
      onClick={() => handleClick(item)}
      className="w-[95%] self-center py-2 my-0.5 cursor-pointer rounded hover:bg-gray-50 transition-colors duration-150"
    >
      <div className="flex items-center px-3">
        <Image
          src={item.icon}
          alt={item.name}
          width={22}
          height={22}
          className="mr-2.5 object-contain"
        />
        <h2 className="text-gray-700 text-sm font-normal">{item.name}</h2>
      </div>
    </div>
  );
}

export default DropItem;
