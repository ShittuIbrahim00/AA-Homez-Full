import React from 'react';
import Image from "next/image";
import {useRouter} from "next/router";

function Referral(props) {
    const router = useRouter();

    const _goBack = () => {
        router.back();
    };

    return (
        <div className={"w-full h-full text-black px-[20px] flex flex-col"}>
            <div
                className={"w-[40px] h-[40px] object-contain cursor-pointer"}
                onClick={() => _goBack()}

            >
                <Image src={require("../../../public/icons/arrow_back.png")} alt={"back"} />
            </div>

            <div className={"flex flex-col self-center w-full mb-[30px]"}>
                <div className={"items-center justify-center mb-[25px] self-center"}>
                    <Image
                        src={require("../../../public/images/image2.jpg")} alt={"img"}
                        className={"rounded-[600px] w-[180px] h-[180px]"}
                    />
                </div>

                <div
                    className={"flex flex-col items-center justify-center w-full"}
                >
                    <h1
                        className={"font-bold text-black text-[25px] mb-[8px]"}
                    >
                        Abdulmalik Muhammad
                    </h1>


                    <div className={"flex flex-row items-center"}>
                        <p className={"font-light text-[15px]"}>Sliver</p>
                        <Image
                            src={require("../../../public/icons/Silver.png")} alt={"Sliver"}
                            className={"w-[20px] h-[20px] ml-[5px]"}
                        />
                    </div>
                </div>
            </div>

            <div
                className={"w-full my-[20px]"}
            >
                <div>
                    <h1 className={"font-semibold text-black text-[22px] mb-[20px]"}>Bio</h1>

                    <div
                        className={""}
                    >
                        <p className={"text-[19px]"}>Full name</p>
                        <p className={"text-[17px]"}>Abdulmalik Muhammad</p>
                    </div>
                </div>

            </div>

            <div
                className={"w-full my-[20px]"}
            >
                <div>
                    <h1 className={"font-semibold text-black text-[22px] mb-[20px]"}>Contact Information</h1>

                    <div
                        className={"mb-[20px]"}
                    >
                        <p className={"text-[19px]"}>Phone</p>
                        <p className={"text-[17px]"}>+2347061811464</p>
                    </div>

                    <div
                        className={"mb-[20px]"}
                    >
                        <p className={"text-[19px]"}>Email Address</p>
                        <p className={"text-[17px]"}>malikberry_coachdom@hotmail.com</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Referral;
