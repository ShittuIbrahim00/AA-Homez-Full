import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Button, Dropdown, Input } from "@/components/Custom";
import { useRouter } from "next/router";
import { UserContext } from "@/context/user";
import { _getUser, _verifyAgent } from "@/hooks/user.hooks";
import { VerifyAgent } from "@/pages/api/profile/verify-agent";

const profileImg = require("../../../../public/images/user.png");

function VerifyProfile(props) {
  const router = useRouter();
  //context
  // @ts-ignore
  const [user, setUser] = useContext(UserContext);
  const [formData, setFormData] = useState<VerifyAgent>({
    accountName: (user?.agent as any)?.accountName || "",
    accountNumber: (user?.agent as any)?.accountNumber || "",
    bankCode: (user?.agent as any)?.bankCode || "",
    bankName: (user?.agent as any)?.bankName || "",
    address: (user?.agent as any)?.address || "",
    phone: (user?.agent as any)?.phone || "",
    fullName: (user?.agent as any)?.fullName || "",
    imgUrl: (user?.agent as any)?.imgUrl || "",
  });

  //functions
  const _constructor = async () => {
    const userData = await _getUser();
    if (userData != false) {
      setUser(userData);
    }
  };
  const data = [
    {
      id: 1,
      name: "Male",
      value: "Male",
    },
    {
      id: 2,
      name: "Female",
      value: "Female",
    },
  ];

  useEffect(() => {
    _constructor();
  }, []);

  const verifyCurrentUser = async () => {
    try {
      const res = await _verifyAgent(formData);
      console.log(res);
    } catch (error) {}
  };

  return (
    <div
      className={
        "w-full h-full bg-blue text-black px-[30px] flex flex-col items-center justify-center"
      }
    >
      {/*header*/}
      <div className={"w-full flex flex-row"}>
        <Image
          src={require("../../../../public/svg/arrow_back_black.svg")}
          alt={"back button"}
          className={"w-[90px] h-[90px] p-[25px] cursor-pointer"}
          onClick={() => router.back()}
        />
      </div>

      {/*body*/}
      <div className={"w-full h-full overflow-y-scroll p-[20px] flex flex-col"}>
        <div
          className={
            "self-center flex flex-col items-center justify-center w-full"
          }
        >
          <div className={"cursor-pointer relative flex flex-col"}>
            <Image
              src={profileImg}
              alt={"Img"}
              className={
                "w-[250px] h-[250px] rounded-full p-[25px] object-cover"
              }
            />

            <div
              className={
                "flex flex-col items-center justify-center w-[25px] h-[25px] bg-main-primary rounded-full absolute bottom-[50px] right-[60px]"
              }
            >
              <Image
                src={require("../../../../public/svg/photo_camera.svg")}
                alt={"camera"}
                className={"w-[14px] h-[14px]"}
              />
            </div>
          </div>

          <h2 className={"text-black font-bold text-[15px] my-[20px]"}>
            {(user?.agent as any)?.fullName}
          </h2>
        </div>

        <div className={"w-full grid-cols-2 grid gap-3"}>
          <div className={"my-[20px] mx-[20px]"}>
            <h2 className={"text-[18px] text-black font-bold "}>Bio</h2>
            <div className={"my-[20px]"}>
              <h3 className={"text-black text-[12px]"}>Full name</h3>
              <Input
                placeholder={"John Doe"}
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className={"my-[20px]"}>
              <h3 className={"text-black text-[12px]"}>Gender</h3>
              <Dropdown 
                data={data} 
                placeholder={"Gender"} 
              />
            </div>

            <div className={"my-[20px]"}>
              <h3 className={"text-black text-[12px]"}>DOB</h3>
              <Input 
                placeholder={"DD/MM/YY"} 
                date 
                type={"date"} 
                value={user?.agent?.dob || ""}
              />
            </div>
          </div>

          <div className={"my-[20px] mx-[20px]"}>
            <h2 className={"text-[18px] text-black font-bold "}>
              Contact Information
            </h2>
            <div className={"my-[20px]"}>
              <h3 className={"text-black text-[12px]"}>Phone</h3>
              <Input
                placeholder={"+2347060229045"}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className={"my-[20px]"}>
              <h3 className={"text-black text-[12px]"}>Email</h3>
              <Input 
                placeholder={"user@spendify.com"} 
                value={(user?.agent as any)?.email || ""}
                readOnly
              />
            </div>

            <div className={"my-[20px]"}>
              <h3 className={"text-black text-[12px]"}>Home Address</h3>
              <Input 
                placeholder={""} 
                value={(user?.agent as any)?.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </div>

          <div className={"my-[20px] mx-[20px]"}>
            <h2 className={"text-[18px] text-black font-bold "}>
              Account Details
            </h2>
            <div className={"my-[20px]"}>
              <h3 className={"text-black text-[12px]"}>Account Number </h3>
              <Input
                placeholder={"0011223344"}
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
              />
            </div>

            <div className={"my-[20px]"}>
              <h3 className={"text-black text-[12px]"}>Bank</h3>
              <Input
                placeholder={""}
                value={formData.bankName}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
              />
            </div>

            <div className={"my-[20px]"}>
              <h3 className={"text-black text-[12px]"}>Account Name</h3>
              <Input
                placeholder={""}
                value={formData.accountName}
                onChange={(e) =>
                  setFormData({ ...formData, accountName: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div
          className={"w-1/2 p-[20px] flex flex-col items-center self-center"}
        >
          <Button
            text={"Verify account"}
            onClick={verifyCurrentUser}
            style={""}
          />
        </div>
      </div>
    </div>
  );
}

export default VerifyProfile;
