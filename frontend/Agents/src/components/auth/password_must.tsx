import React from 'react';
import Image from "next/image";

const checkImg = require("../../../public/svg/check_circle.svg");
const falseCheck = require("../../../public/svg/fade_check.svg");

function PasswordMust(props) {

    const {text, status} = props;

    return (
        <div className={"flex flex-row items-center mb-3"}>
            <Image
                src={status === true ? checkImg : falseCheck}
                alt={"check"}
                className={"w-[14px] h-[14px] object-contain"}
            />
            <h2
                className={
                    status === true ?
                        `text-black text-[12px] ml-2 font-light` : `text-gray-800 text-[12px] ml-2 font-light`
                }>
                {text}
            </h2>
        </div>
    );
}

export default PasswordMust;
