import React from 'react';
import Image from "next/image";

/**
 *
 * @param props{onclick: function,  }
 * @constructor
 */
function ReferralCard(props) {

    const {
        onclick, item, index
    } = props;

    return (
        <div
            className={`flex flex-row items-center justify-between w-full border-[1px] p-[20px] cursor-pointer `}
            onClick={() => onclick()}
        >
            <div
                className={"flex flex-row items-center"}
            >
                <Image
                    src={item.img}
                    alt={"image"}
                    width={0}
                    height={0}
                    className={"rounded-[100px] w-[50px] h-[50px] mr-[15px] object-cover"}
                />



                <div
                    className={""}
                >
                    <h2 className={"font-semibold text-black text-[14px] mb-[10px]"}>{item.name}</h2>
                    <div
                        className={"flex flex-row items-center"}
                    >
                        <h2 className={"font-medium text-black text-[12px] mr-[10px]"}>{item.medal}</h2>

                        {
                            item.medal === "Bronze" ?
                                <Image
                                    src={require("../../../public/icons/Bronze.png")}
                                    alt={"Bronze Medal"}
                                    className={"w-[18px] h-[18px]"}
                                />
                            :
                            item.medal === "Diamond" ?
                                <Image
                                    src={require("../../../public/icons/Diamond.png")}
                                    alt={"Diamond Medal"}
                                    className={"w-[18px] h-[18px]"}
                                />
                            :
                                <Image
                                    src={require("../../../public/icons/Silver.png")}
                                    alt={"Sliver Medal"}
                                    className={"w-[18px] h-[18px]"}
                                />
                        }

                    </div>
                </div>

            </div>

            <p className={"text-black font-light text-[14px]"}>2/3/2023</p>
        </div>
    );
}

export default ReferralCard;
