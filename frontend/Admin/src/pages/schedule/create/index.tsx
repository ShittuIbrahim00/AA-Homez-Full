import React, {useContext, useEffect, useState} from 'react';
import {Carousel} from "react-responsive-carousel";
import Image from "next/image";
import {Button, Dropdown, Input} from "@/components/Custom";
import {useRouter} from "next/router";
import {SchedulerContext} from "@/context/scheduler";


import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {_createSchedule} from "@/hooks/schedule.hooks";
import moment from "moment";
import {toast} from "react-toastify";

function ScheduleCreate(props) {

    // constants
    const router = useRouter();
    const query = router.query;
    const timeData = [
        {
            id: 1,
            name: "11:00AM - 2:00PM",
            value: "11:00AM - 2:00PM",
        },
        {
            id: 2,
            name: "2:00PM - 4:00PM",
            value: "2:00PM - 4:00PM",
        },
    ];

    // contexts
    // @ts-ignore
    const [temp, setTemp] = useContext(SchedulerContext);

    //states
    const [propName, setPropName] = useState<string>(temp?.name ?? "");
    const [propSubName, setPropSubName] = useState<string>(temp?.name ?? "");
    const [price, setPrice] = useState<string>(temp?.priceRange ?? "");
    const [location, setLocation] = useState<string>(temp?.location ?? "");
    const [clientName, setClientName] = useState<string>(temp?.name ?? "");
    const [phone, setPhone] = useState<string>(temp?.name ?? "");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState<string>("11:00AM - 12:00PM");
    const [loading, setLoading] = useState<boolean>(false);
    const [property, setProperty] = useState(temp);


    // functions
    const _constructor = () => {

    };

    const onSchedule = async() => {
        const data = {
            pid: property?.pid,
            date: moment(date).format('L'),
            time: time
        };

        console.log({data, property});

        if(data.pid && data.date && data.time){
            setLoading(true);
            const res = await _createSchedule(data);
            if(res != false){
                toast.success("Schedule created!");
                // setTimeout(() => {
                    router.push(
                        "/schedule",
                        undefined, {shallow: true}
                    );
                // }, 1);
                setLoading(false);
            }
        } else {
            toast.error("All data are required.");
            setLoading(false);
        }
        setLoading(false);

    };

    useEffect(() => {
        console.log({temp})
        return(() => {
            setTemp(null)
        })
    }, []);
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
                    <div className={"w-full flex flex-col sm:flex-row items-center justify-between my-[20px]"}>
                        <div className={"w-[90%] sm:w-[45%] "}>
                            <div className={"flex flex-col w-full mb-[15px]"}>
                                <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Property Name</h2>
                                <div className={"flex flex-row items-center w-full"}>
                                    <Image
                                        src={require("../../../../public/icons/villa.png")}
                                        alt={"villa"}
                                        className={"w-[20px] h-[20px] mr-[20px]"}
                                    />

                                    <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}
                                        value={propName}
                                        onChange={(e) => setPropName(e.target.value)}
                                    />
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

                                    <Input type={"default"} placeholder={"Behind Haven Apartment"} className={"w-full bg-main-grey"}
                                        value={propSubName}
                                        onChange={(e) => setPropSubName(e.target.value)}
                                    />
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

                                    <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={"w-[90%] sm:w-[45%]"}>
                            <div className={"flex flex-col w-full mb-[15px]"}>
                                <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Location</h2>
                                <div className={"flex flex-row items-center w-full"}>
                                    <Image
                                        src={require("../../../../public/icons/home_pin.png")}
                                        alt={"villa"}
                                        className={"w-[20px] h-[20px] mr-[20px]"}
                                    />

                                    <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
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

                                    <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                    />
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

                                    <Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    <h2 className={"text-black text-[15px] font-bold"}>Visitation Information</h2>
                    <div className={"w-full flex flex-col sm:flex-row items-center justify-between my-[20px]"}>
                        <div className={"flex flex-col w-[90%] sm:w-[45%] mb-[15px]"}>
                            <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Date</h2>
                            <div className={"flex flex-row items-center w-full"}>
                                <Image
                                    src={require("../../../../public/icons/today.png")}
                                    alt={"villa"}
                                    className={"w-[20px] h-[20px] mr-[20px]"}
                                />

                                {/*<Input type={"default"} placeholder={"DD/MM/YYYY"} className={"w-full bg-main-grey"}*/}
                                {/*    value={date}*/}
                                {/*    onChange={(e) => setDate(e.target.value)}*/}
                                {/*/>*/}

                                <DatePicker
                                    placeholderText={"DD/MM/YY"}
                                    onChange={(valD) => {
                                        // console.log("valD: ", moment(valD).format('L'))
                                        setDate(valD);
                                    }}
                                    minDate={new Date()}
                                    selected={date}
                                    className={"text-[12px] border-[1px] py-[5px] pl-[5px] pr-[20px]"}
                                />

                            </div>
                        </div>

                        <div className={"flex flex-col w-[90%] sm:w-[45%] mb-[15px]"}>
                            <h2 className={"font-light text-black text-[13px] ml-[50px] my-[8px]"}>Time</h2>
                            <div className={"flex flex-row items-center w-full"}>
                                <Image
                                    src={require("../../../../public/icons/schedule.png")}
                                    alt={"villa"}
                                    className={"w-[20px] h-[20px] mr-[20px]"}
                                />

                                <Dropdown
                                    data={timeData}
                                    placeholder={"Time"}
                                    onChange={(e) => {
                                        // console.log("time: ", e.target.value)
                                        setTime(e.target.value);
                                    }}
                                />

                                {/*<Input type={"default"} placeholder={"Haven Apartment"} className={"w-full bg-main-grey"}*/}
                                {/*    value={time}*/}
                                {/*    onChange={(e) => setTime(e.target.value)}*/}
                                {/*/>*/}
                            </div>
                        </div>
                    </div>

                    <div className={"w-[45%] flex flex-col self-center my-[20px]"}>
                        <Button onClick={onSchedule} loading={loading}>Continue</Button>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default ScheduleCreate;
