import React, { useState } from "react";
import { useRouter } from "next/router";

import { PropertyHeader, ReferralCard } from "@/components/Custom";
// import { ReferralCard } from "@/components/Custom";

import { EarningsRefCard, PortfolioRefCard } from "@/components/portfolio";

import { ReferralsData } from "../../../constants/data";

const SalesReferral: React.FC = () => {
  const router = useRouter();

  const [searchTxt, setSearchText] = useState<string>("");

  // Navigate to referral details page with aid param
  const gotoReferral = (aid?: string | number | null) => {
    if (!aid) return;
    router.push(
      {
        pathname: "/referral",
        query: { aid },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className="w-full h-full bg-blue text-black px-5 flex flex-col overflow-y-auto">
      <div className="flex flex-row items-center justify-evenly w-full">
        <EarningsRefCard />
        <PortfolioRefCard />
      </div>

      <div className="my-9 w-full flex flex-col overflow-y-auto">
        <PropertyHeader
          text="Referrals"
          onClick={(val) => console.log({ val })}
          search
          setSearchTxt={setSearchText}
          searchTxt={searchTxt}
        />

        {ReferralsData.length === 0 ? (
          <p className="text-gray-500 italic mt-4 text-sm text-center">
            No referrals found.
          </p>
        ) : (
          <div className="space-y-4 mt-3">
            {ReferralsData.map((item, index) => (
              <ReferralCard
                key={item.aid ?? index.toString()}
                item={item}
                onClick={() => gotoReferral(item.aid)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReferral;
