import React from 'react';
import Image from "next/image";
import {LinearProgress} from "@mui/material";

function PortfolioRefCard(props) {

    const {styles, earn} = props;

    return (
        <div className={`w-[600px] h-[300px] rounded-[30px] bg-main-milk p-[40px] border-[3px] ${styles}`}>
            <div
                className={"mb-[20px]"}
            >
                <div className={"flex flex-row items-center mb-[5px]"}>
                    <h2 className={"font-semibold text-black text-[22px] mr-[10px]"}>Abdulmalik </h2>
                    <Image
                        src={require("../../../public/icons/Gold.png")}
                        alt={"Gold"} className={"w-[20px] h-[20px]"}
                    />
                </div>
                <h2 className={"font-semibold text-black text-[15px] mr-[10px]"}>Bronze </h2>

            </div>

            <div
                className={"mt-[30px] flex flex-col items-center justify-center w-full p-[20px]"}
            >

                <div
                    className={"w-[80%] rounded-[10px] self-center cursor-pointer flex flex-col items-center justify-center bg-white p-[10px]"}
                >
                    <h2 className={"font-bold text-black text-[28px] mb-[5px]"}>20</h2>
                    <p className={"font-light font-semibold text-black text-[15px]"}>Sales remaining to Sliver </p>
                </div>
            </div>

            <div className={"flex flex-row w-full self-center items-center"}>
                <h2 className={"text-black font-semibold text-[12px]"}>Bronze</h2>
                <LinearProgress value={60} className={"w-[70%] mx-[20px]"} variant={"determinate"} color={"warning"} />
                <h2 className={"text-gray-500 font-semibold text-[12px]"}>Sliver</h2>
            </div>
        </div>
    );
}

export default PortfolioRefCard;
