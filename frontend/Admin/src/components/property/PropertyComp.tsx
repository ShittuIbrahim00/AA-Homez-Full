import React from 'react';
import Image from "next/image";
import {FaPlus} from "react-icons/fa";

interface PropertyCompProps {
    title?: string,
    images?: any,
    onClick?: any,
}

const PropertyComp: React.FC<PropertyCompProps> = ({ title, images, onClick })  => {
    // @ts-ignore

    // console.log({images})
    return (
        <div
            className={"w-[100%] rounded-[10px] border-black my-[20px]"}
        >
            {
                (images ?? []).length > 0 ?
                    <Image
                        src={images[0]}
                        width={200}
                        height={200}
                        alt={title ?? ""}
                        className={"w-full h-[200px]"}
                    />
                    :
                    <div
                        className={"w-full h-[200px] flex flex-col items-center justify-center bg-[#290D03] cursor-pointer"}
                        onClick={onClick}
                    >
                        <div className={"p-[30px] rounded-[8px] border-white border-[2px] mb-[20px]"}>
                            <FaPlus color={"#fff"} size={18} />
                        </div>
                        <p className={"text-white text-[12px] font-bold"}>Add Images</p>
                    </div>
            }

            <div className={"w-full p-[30px] bg-main-grey rounded-b-[8px]"}>
                <p className={"text-black text-[13px] font-bold"}>{title}</p>
            </div>

        </div>
    );
}

export default PropertyComp;
