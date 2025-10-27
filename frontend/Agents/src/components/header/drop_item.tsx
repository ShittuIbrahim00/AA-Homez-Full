import React, { useContext } from 'react';
import Image from "next/image";
import { useRouter } from "next/router";
import { UserContext } from '@/context/user';

function DropItem({ item, index }: { item: any; index: number }) {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext)!;

  const funCollection = (i: any) => {
    if (i.id === 2) {
      // Handle logout
      localStorage.removeItem("$token_key");
      localStorage.removeItem("$agent_id");
      localStorage.clear();
      
      // Reset user context to initial state
      setUser({
        agent: null,
        propertiesSold: [],
        subPropertiesSold: [],
        commissions: {
          history: [],
          totals: {
            sales: 0,
            referral: 0,
            overall: 0,
          },
        },
        referralNetwork: [],
      });
      
      router.replace("/auth/login");
    } else {
      router.push(i.route);
    }
  };

  return (
    <div
      key={index}
      onClick={(e) => {
        e.stopPropagation();
        funCollection(item);
      }}
      className="w-[90%] mx-auto mb-2 cursor-pointer rounded-md border border-transparent
                 hover:border-orange-400 hover:bg-orange-50
                 transition duration-200 ease-in-out
                 shadow-sm hover:shadow-md
                 focus:outline-none focus:ring-2 focus:ring-orange-400
                 group"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
          funCollection(item);
        }
      }}
    >
      <div className="flex items-center px-5 py-3">
        <Image
          src={item.icon}
          alt={item.name}
          width={24}
          height={24}
          className="mr-4 transition-transform duration-200 ease-in-out group-hover:scale-110"
        />
        <h2 className="text-gray-900 text-base font-semibold transition-colors duration-200 group-hover:text-orange-600">
          {item.name}
        </h2>
      </div>
    </div>
  );
}

export default DropItem;