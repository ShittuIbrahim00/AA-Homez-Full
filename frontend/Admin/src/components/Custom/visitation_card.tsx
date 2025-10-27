import React from 'react';
import Image from "next/image";
import houseImage from "../../../public/images/house1.png";
import { formatPrice } from "@/utils/priceFormatter";

function VisitationCard(props) {

    const {item, onClick, containerStyles} = props;
    // console.log({item});

    return (
        <div className={"w-[350px] h-[200px] px-[15px] mb-[40px]"} style={containerStyles}>
            <div
                className={`w-full h-full rounded-[20px] shadow-md shadow-main-grey2 border-main-greyShadow ` +
                    `hover:shadow-main-greyShadow m-[20px] cursor-pointer bg-main-grey flex flex-row` +
                    ` items-center`
                }
                onClick={onClick}
            >
                <Image
                    src={houseImage}
                    alt={"image"}
                    width={150}
                    height={120}
                />

                <div className={"ml-[10px] w-[150px]"}>
                    <h2 className={"text-black text-[15px] font-bold"}>{item?.Property?.name}</h2>
                   
                    <p className={"text-black text-[18px] font-semibold"}>{formatPrice("230M")}</p>
                    <p className={"text-black text-[13px] font-light mt-[10px]"}>{item?.Agent?.fullName}</p>
                    <p className={"text-black text-[13px] font-light"}>{item?.time}</p>
                </div>
            </div>

        </div>
    );
}

export default VisitationCard;