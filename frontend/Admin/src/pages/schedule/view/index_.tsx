import React from 'react';
import {Carousel} from "react-responsive-carousel";
import Image from "next/image";
import {Button, Input} from "@/components/Custom";

function ScheduleView(props) {
    return (
        <div className={"w-full h-full bg-blue text-black px-[30px] flex flex-col items-center justify-center"}>
            <div
                className={"w-[85%] shadow-md rounded-[20px] p-[20px] mb-[20px]"}
            >
                <Carousel
                    showArrows={true}
                    // onChange={onChange}
                    // onClickItem={onClickItem}
                    // onClickThumb={onClickThumb}
                >
                    <div>
                        <Image src={require("../../../../public/images/house2.png")} alt={"house"} className={"w-full h-[250px]"} />
                    </div>

                    <div>
                        <Image src={require("../../../../public/images/house2.png")} alt={"house"} className={"w-full h-[250px]"} />
                    </div>

                    <div>
                        <Image src={require("../../../../public/images/house2.png")} alt={"house"} className={"w-full h-[250px]"} />
                    </div>
                </Carousel>

                <div className={"flex flex-col"}>
                    <div className={"w-full flex flex-row items-start justify-between my-[20px]"}>
                        <div className={"w-[45%] "}>
                            <div className={"flex flex-row items-start w-full mb-[30px]"}>
                                <Image
                                    src={require("../../../../public/icons/villa.png")}
                                    alt={"villa"}
                                    className={"w-[20px] h-[20px] mr-[20px]"}
                                />

                                <div className={"flex flex-col w-full"} >
                                    <h2 className={"font-medium text-black text-[15px] mb-[8px]"}>Site visitation to congo valley</h2>
                                    <h2 className={"font-semibold text-black text-[13px] mb-[8px]"}>Approved </h2>
                                </div>
                            </div>

                            <div className={"flex flex-row items-start w-full mb-[30px]"}>
                                <Image
                                    src={require("../../../../public/icons/today.png")}
                                    alt={"villa"}
                                    className={"w-[20px] h-[20px] mr-[20px]"}
                                />

                                <div className={"flex flex-col w-full"} >
                                    <h2 className={"font-medium text-black text-[15px] mb-[8px]"}>Today</h2>
                                    <h2 className={"font-light text-black text-[13px] mb-[8px]"}>13th December, 2023 </h2>
                                    <h2 className={"font-light text-black text-[13px] mb-[8px]"}>11:00am - 02:00pm </h2>
                                </div>
                            </div>

                            <div className={"flex flex-col w-full mb-[15px]"}>
                                <div className={"flex flex-row items-start w-full"}>
                                    <Image
                                        src={require("../../../../public/icons/home_pin.png")}
                                        alt={"villa"}
                                        className={"w-[20px] h-[20px] mr-[20px]"}
                                    />

                                    <div className={"flex flex-col w-full"} >
                                        <h2 className={"font-medium text-black text-[15px] mb-[8px]"}>map.google.com/kdsew/23/</h2>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className={"w-[45%] "}>
                                <div className={"flex flex-row items-start w-full mb-[15px]"}>
                                    <Image
                                        src={require("../../../../public/icons/person_4.png")}
                                        alt={"villa"}
                                        className={"w-[20px] h-[20px] mr-[20px]"}
                                    />

                                    <h2 className={"font-medium text-black text-[15px] mb-[8px]"}>Mr Zubairu Usman</h2>
                                </div>


                                <div className={"flex flex-row items-start w-full mb-[15px]"}>
                                    <Image
                                        src={require("../../../../public/icons/call.png")}
                                        alt={"villa"}
                                        className={"w-[20px] h-[20px] mr-[20px]"}
                                    />

                                    <h2 className={"font-medium text-black text-[15px] mb-[8px]"}>07061811464</h2>
                                </div>
                        </div>
                    </div>


                    <div className={"w-[45%] flex flex-col self-center my-[20px]"}>
                        <Button>Send Client Reminder</Button>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default ScheduleView;
