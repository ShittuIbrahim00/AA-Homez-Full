import React, {useState} from 'react';
import Image from "next/image";
import Spinner from "@/pages/notifications/Spinner";

const hide = require("../../../public/icons/hide.svg");
const show_pass = require("../../../public/icons/show-pass.svg");
const close = require("../../../public/icons/close.png");
const date = require("../../../public/icons/calendar_month_filled.png");


function Input(props) {

    const {
        type, value, onChange, placeholder, classNameStyle, isDisabled, containerStyle, cancel, isDate = false,
        loading,
    } = props;
    const [toggle, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle((prevState) => !prevState);
    };

    if (loading) {
        return (
            <div className={`flex ${containerStyle ?? "w-full"}`}>
                <div className="w-full py-2 px-3 rounded-md border-[1px] font-light border-gray-100 bg-gray-100 animate-pulse"></div>
            </div>
        );
    }

    return (
        <>
            {type === "password" ? ( // add toggle button, if input type is password
                <div className={`flex ${containerStyle ?? "w-full"}`}>
                    <input
                        className={
                        `w-[90%] py-2 px-3 font-light rounded-l border-y-2 border-l-2 border-r-0 
                        text-black text-[12px] 
                        border-y-gray-100 border-l-gray-100 focus:border-gray-100 outline-none ${classNameStyle}`}
                        placeholder={placeholder}
                        type={toggle ? "text" : "password"}
                        readOnly={isDisabled}
                        value={value}
                        onChange={onChange}
                    />
                    <div
                        className="w-[10%] rounded-r border-y-2 border-r-2 border-l-0 border-y-gray-100 border-r-gray-100
                        focus:border-gray-100 outline-none flex justify-center"
                        onClick={handleToggle}
                    >
                        {
                            cancel
                                ? (
                                    <Image
                                        src={close}
                                        alt="close"
                                        // width={14}
                                        // height={14}
                                        className="w-[16px] h-[16px] object-contain self-center  "
                                        priority
                                    />
                                )
                            : isDate
                                ? (
                                    <Image
                                        src={date}
                                        alt="close"
                                        // width={14}
                                        // height={14}
                                        className="w-[16px] h-[16px] object-contain self-center  "
                                        priority
                                    />
                                )
                            :
                            !toggle ? (
                                <Image
                                    src={hide}
                                    alt="Filter"
                                    width={20}
                                    height={20}
                                    className=""
                                    priority
                                />
                            ) : (
                                <Image
                                    src={show_pass}
                                    alt="Filter"
                                    width={20}
                                    height={20}
                                    className=""
                                    priority
                                />
                            )
                        }
                    </div>
                </div>
            ) : (
                <input
                    className={`
                        py-2 px-3 rounded-md border-[1px] font-light border-gray-100 focus:border-gray-100 
                        text-black text-[12px] 
                        outline-none ${classNameStyle} ${containerStyle ?? "w-full"}
                    `}
                    value={value}
                    placeholder={placeholder}
                    type={type}
                    readOnly={isDisabled}
                    onChange={onChange}
                />
            )}
        </>
    );
}

export default Input;