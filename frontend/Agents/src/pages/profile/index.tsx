import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Custom";
import { useRouter } from "next/router";
import { UserContext } from "@/context/user";
import { _getUser } from "@/hooks/user.hooks";
import Link from "next/link";
import BackHeader from "@/components/Custom/BackHeader";

const defaultProfileImg = require("../../../public/images/user.png");

function Profile() {
  const router = useRouter();

  // context
  // @ts-ignore
  const [user, setUser] = useContext(UserContext);

  const [copySuccess, setCopySuccess] = useState("");

  const _constructor = async () => {
    const userData = await _getUser();
    if (userData !== false) {
      setUser(userData);
    }
  };

  const gotoPage = (val: string) => {
    router.push(val, undefined, { shallow: true });
  };

  useEffect(() => {
    _constructor();
  }, []);

  // Access agent data correctly
  const agentData = user?.agent;

  const referralLink = `${router.basePath}/auth/signup?code=${agentData?.referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch {
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 md:py-8 md:mt-24 text-black bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="w-full max-w-7xl flex items-center mb-6">
        <BackHeader text="Back " />
      </div>

      {/* Profile Card */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 flex flex-col items-center">
        <Image
          src={agentData?.imgUrl || defaultProfileImg}
          alt="Profile Picture"
          className="rounded-full object-cover"
          width={180}
          height={180}
        />

        <h1 className="mt-6 text-2xl font-semibold text-gray-900">{agentData?.fullName}</h1>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 w-full max-w-md">
          <Button
            text="Update Account"
            variant="primary"
            onClick={() => gotoPage("/profile/update")}
          />
          {!agentData?.ninVerified && (
            <Button
              text="Verify Account"
              variant="primary"
              onClick={() => gotoPage("/profile/verify")}
            />
          )}
          <Button
              text="Change Password"
              variant="secondary"
              onClick={() => gotoPage("/profile/change")}
            />
          </div>

          {agentData?.ninVerified && (
            <p className="mt-3 text-green-600 font-medium">Your profile is verified!</p>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full max-w-4xl mt-10 bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Referral Link */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Referral Link</h2>
            <div className="flex items-center space-x-4">
              <Link
                href={referralLink}
                className="text-orange-500 underline text-sm truncate max-w-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                {referralLink}
              </Link>
              <button
                aria-label="Copy referral link"
                onClick={copyToClipboard}
                className="p-2 rounded hover:bg-gray-100 transition"
              >
                <Image
                  src={require("../../../public/svg/share_main.svg")}
                  alt="Share"
                  width={24}
                  height={24}
                />
              </button>
              {copySuccess && (
                <span className="text-green-600 text-sm ml-2 select-none">{copySuccess}</span>
              )}
            </div>
          </section>

          {/* Bio */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
              <div>
                <p className="font-semibold mb-1">Full Name</p>
                <p>{agentData?.fullName || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Address</p>
                <p>{agentData?.address || "N/A"}</p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
              <div>
                <p className="font-semibold mb-1">Email Address</p>
                <p>{agentData?.email || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Phone Number</p>
                <p>{agentData?.phone || "N/A"}</p>
              </div>
            </div>
          </section>

          {/* Bank Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bank Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700 text-sm">
              <div>
                <p className="font-semibold mb-1">Bank Name</p>
                <p>{agentData?.bankName || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Account Number</p>
                <p>{agentData?.accountNumber || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Account Name</p>
                <p>{agentData?.accountName || "N/A"}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

export default Profile;
