import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { UserContext } from "@/context/user";
import { _getUser } from "@/hooks/user.hooks";
import { Button } from "@/components/Custom";

import type { Referral } from "@/types/user"; // adjust path if needed

const profileImg = require("../../../public/images/user.png");

const Referral: React.FC = () => {
  const router = useRouter();
  const { aid } = router.query;

  // @ts-ignore
  const [user] = useContext(UserContext);

  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  useEffect(() => {
    const fetchReferral = async () => {
      const userData = await _getUser();
      if (userData && userData?.referralNetwork) {
        const foundReferral = userData.referralNetwork.find(
          (item) => item.aid === Number(aid)
        );
        if (foundReferral) setSelectedReferral(foundReferral);
      }
    };

    if (aid) {
      fetchReferral();
    }
  }, [aid]);

  const gotoPage = (val: string) => {
    router.push(val, undefined, { shallow: true });
  };

  const handleGoBack = () => router.back();

  if (!selectedReferral) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">
        Loading referral...
      </div>
    );
  }

  return (
    <div className="w-full h-full text-black px-5 flex flex-col">
      {/* Header */}
      <div className="w-full flex flex-row">
        <Image
          src={require("../../../public/svg/arrow_back_black.svg")}
          alt="Back"
          className="w-[90px] h-[90px] p-[25px] cursor-pointer"
          onClick={handleGoBack}
        />
      </div>

      {/* Body */}
      <div className="w-full h-full overflow-y-scroll p-5">
        <div className="flex flex-col items-center justify-center w-full">
          <Image
            src={selectedReferral.imgUrl || profileImg}
            alt="Referral Avatar"
            className="w-[250px] h-[250px] rounded-full object-cover"
          />

          <h2 className="text-black font-bold text-lg my-5">
            {selectedReferral.fullName}
          </h2>

          <div className="w-full max-w-xs">
            <Button
              text="Verify account"
              style=""
              onClick={() => gotoPage("/profile/verify")}
            />
          </div>
        </div>

        {/* Referral Info */}
        <div className="mt-10 space-y-6">
          {/* Referral Link */}
          <div>
            <h2 className="text-black font-semibold text-lg mb-2">
              Referral Link
            </h2>
            <div className="flex items-center">
              <p className="text-sm text-gray-700 break-all">
                {"N/A"}
              </p>
              <Image
                src={require("../../../public/svg/share_main.svg")}
                alt="Share"
                className="w-[33px] h-[33px] ml-6"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <h2 className="text-black font-semibold text-lg mb-2">Bio</h2>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-sm text-gray-800">
              {selectedReferral.fullName ?? "N/A"}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-black font-semibold text-lg mb-2">
              Contact Information
            </h2>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="text-sm text-gray-800">
              {user?.agent?.email ?? "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
