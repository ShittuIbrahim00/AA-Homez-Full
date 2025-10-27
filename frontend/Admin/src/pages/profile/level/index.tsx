import React from 'react';
import {Carousel} from "react-responsive-carousel";
import Image from "next/image";
import {Button, Input} from "@/components/Custom";

function ProfileLevel(props) {
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
                    <h2 className={"text-black text-[15px] font-bold"}>Property Information</h2>
                    <div className={"w-full flex flex-row items-center justify-between my-[20px]"}>
                        <div className={"w-[45%] "}>
                            <div className={"flex flex-col w-full mb-[15px]"}>
                                <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Property Name</h2>
                                <div className={"flex flex-row items-center w-full"}>
                                    <Image
                                        src={require("../../../../public/icons/villa.png")}
                                        alt={"villa"}
                                        className={"w-[20px] h-[20px] mr-[20px]"}
                                    />

                                    <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}  />
                                </div>
                            </div>

                            <div className={"flex flex-col w-full mb-[15px]"}>
                                <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Sub-Property Name</h2>
                                <div className={"flex flex-row items-center w-full"}>
                                    <Image
                                        src={require("../../../../public/icons/home.png")}
                                        alt={"villa"}
                                        className={"w-[20px] h-[20px] mr-[20px]"}
                                    />

                                    <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}  />
                                </div>
                            </div>

                            <div className={"flex flex-col w-full mb-[15px]"}>
                                <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Price</h2>
                                <div className={"flex flex-row items-center w-full"}>
                                    <Image
                                        src={require("../../../../public/icons/sell.png")}
                                        alt={"villa"}
                                        className={"w-[20px] h-[20px] mr-[20px]"}
                                    />

                                    <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}  />
                                </div>
                            </div>
                        </div>

                        <div className={"w-[45%] "}>
                            <div className={"flex flex-col w-full mb-[15px]"}>
                                <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Location</h2>
                                <div className={"flex flex-row items-center w-full"}>
                                    <Image
                                        src={require("../../../../public/icons/home_pin.png")}
                                        alt={"villa"}
                                        className={"w-[20px] h-[20px] mr-[20px]"}
                                    />

                                    <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}  />
                                </div>
                            </div>

                            <div className={"flex flex-col w-full mb-[15px]"}>
                                <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Client Name</h2>
                                <div className={"flex flex-row items-center w-full"}>
                                    <Image
                                        src={require("../../../../public/icons/person_4.png")}
                                        alt={"villa"}
                                        className={"w-[20px] h-[20px] mr-[20px]"}
                                    />

                                    <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}  />
                                </div>
                            </div>

                            <div className={"flex flex-col w-full mb-[15px]"}>
                                <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Phone</h2>
                                <div className={"flex flex-row items-center w-full"}>
                                    <Image
                                        src={require("../../../../public/icons/call.png")}
                                        alt={"villa"}
                                        className={"w-[20px] h-[20px] mr-[20px]"}
                                    />

                                    <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}  />
                                </div>
                            </div>
                        </div>
                    </div>


                    <h2 className={"text-black text-[15px] font-bold"}>Visitation Information</h2>
                    <div className={"w-full flex flex-row items-center justify-between my-[20px]"}>
                        <div className={"flex flex-col w-[45%] mb-[15px]"}>
                            <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Date</h2>
                            <div className={"flex flex-row items-center w-full"}>
                                <Image
                                    src={require("../../../../public/icons/today.png")}
                                    alt={"villa"}
                                    className={"w-[20px] h-[20px] mr-[20px]"}
                                />

                                <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}  />
                            </div>
                        </div>

                        <div className={"flex flex-col w-[45%] mb-[15px]"}>
                            <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Time</h2>
                            <div className={"flex flex-row items-center w-full"}>
                                <Image
                                    src={require("../../../../public/icons/schedule.png")}
                                    alt={"villa"}
                                    className={"w-[20px] h-[20px] mr-[20px]"}
                                />

                                <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}  />
                            </div>
                        </div>
                    </div>

                    <div className={"w-[45%] flex flex-col self-center my-[20px]"}>
                        <Button>Continue</Button>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default ProfileLevel;
