import React, {useContext, useEffect, useState} from 'react';
import {Input, PropertyCard, PropertyHeader, VisitationCard} from "@/components/Custom";
import {useRouter} from "next/router";
import {_getAllHotProperty, _getProperties} from "@/hooks/property.hooks";
import {PropertyContext} from "@/context/property";
import {CircularProgress} from "@mui/material";
import {Scheduler, VisitCards} from "@/components/schedule";
import Image from "next/image";
import {PendingVisitations} from "../../../constants/data";
import moment from "moment";
import {_getSchedule} from "@/hooks/schedule.hooks";
import {rankImage} from "@/utils/propertyUtils";


function ViewDashboard(props){

    const router = useRouter();


    //constants
    const id = router?.query?.id;
    // console.log({id})

    //contexts
    // @ts-ignore
    const [hotProperties, setHotProperties, subProperty, setSubProperty, fullProperties, setFullProperties, tempProp] = useContext(PropertyContext);

    //states
    const [loading, setLoading] = useState(false);
    const [loadingP, setLoadingP] = useState(false);
    const [visit, setVisit] = useState(false);
    const [property, setProperty] = useState("");
    const [sProperty, setSProperty] = useState("");
    const [date, setDate] = useState(new Date());
    const [timeStart, setTimeStart] = useState(new Date());
    const [timeEnd, setTimeEnd] = useState(new Date());
    const [clientName, setClientName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [schedule, setSchedule] = useState<any>(null);

    const data = [];

    //functions
    const gotoProperty = (base) => {
        router.push(
            {pathname: "/properties",
                    query:{
                        base
                    }
                }, undefined,
            {shallow: true}
        );
    }

    const gotoPage = (value: string) => {
        console.log("VIEWS");
        router.push(
            value,
            undefined, {shallow: true}
        );
    }


    useEffect(() => {
        const _constructor = async () => {
            // Validate and convert id to number
            if (!id || Array.isArray(id)) {
                console.error("Invalid schedule ID");
                setLoading(false);
                return;
            }
            
            const scheduleId = Number(id);
            if (isNaN(scheduleId)) {
                console.error("Invalid schedule ID format");
                setLoading(false);
                return;
            }

            setLoading(true);

            const sch = await _getSchedule(scheduleId);
            if(sch !== null){
                console.log({sch});
                setSchedule(sch);
                setLoading(false);

                setProperty(sch?.Property?.name || "");
                setSProperty(sch?.SubProperty?.name || "");
                setDate(sch?.date ? new Date(sch.date) : new Date());
                setTimeStart(sch?.start ? new Date(sch.start) : new Date());
                setTimeEnd(sch?.end ? new Date(sch.end) : new Date());
                setLocation(""); // Location field doesn't exist in Schedule interface
            };

            setLoading(false);

        };

        _constructor();

        return () => setVisit(false);
    }, [id]);

    return (
        <div className={"w-full h-full text-black px-[30px] flex flex-col overflow-y-scroll"}>
            <div className={"w-full flex md:flex-row overflow-y-scroll flex-col"}>
                <div className={"w-full md:w-[70%] flex flex-col-reverse md:flex-col overflow-y-scroll"}>

                    {/*header*/}
                    <div className={"flex flex-row items-center mb-[30px] "}>
                        <Image
                            src={schedule?.Agent?.imgUrl ?? require("../../../../public/icons/person_4.png")}
                            alt={"img"} className={"w-[120px] h-[120px] object-cover rounded-full"}
                        />

                        <div className={"ml-[20px]"}>
                            <h3 className={"text-[14px] font-medium text-black"}>{schedule?.Agent?.fullName}</h3>
                            <div className={"flex flex-row items-center"}>
                                <h3 className={"text-[13.5px] font-medium text-black"}>{schedule?.Agent?.rank ?? ""} </h3>
                                <Image
                                    src={require(rankImage(schedule?.Agent?.rank ?? ""))}
                                    alt={"level"} className={"w-[20px] h-[20px]"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={"my-[10px] w-[95%]"}>
                        <div className={"flex flex-col w-full mb-[15px]"}>
                            <p className={"text-[12px] mb-[15px]"}>Property</p>
                            <Input type={"default"} placeholder={"e.g Heaven Gates Valley"} className={"w-full bg-main-grey"}
                                   value={property}
                                   onChange={(e) => setProperty(e.target.value)}
                                   isDisabled={true}
                            />
                        </div>

                        <div className={"flex flex-col w-full mb-[15px]"}>
                            <p className={"text-[12px] mb-[15px]"}>Sub-Property</p>
                            <Input type={"default"} placeholder={"e.g Green Haven Yard"} className={"w-full bg-main-grey"}
                                   value={sProperty}
                                   onChange={(e) => setSProperty(e.target.value)}
                                   isDisabled={true}
                            />
                        </div>

                        <div className={"flex flex-col w-full mb-[15px]"}>
                            <p className={"text-[12px] mb-[15px]"}>Date</p>
                            <Input type={"default"} placeholder={"e.g 01/01/2024"} className={"w-full bg-main-grey"}
                                   value={moment(date).format("DD/MM/YYYY")}
                                   onChange={(e) => setDate(new Date(e.target.value))}
                                   isDisabled={true}
                            />
                        </div>

                        <div className={"flex flex-row items-center justify-between w-full mb-[15px]"}>
                            <div className={"flex flex-col w-[48%]"}>
                                <p className={"text-[12px] mb-[15px]"}>Time Start</p>
                                <Input type={"default"} placeholder={"e.g 01/01/2024"} className={"w-full bg-main-grey"}
                                       value={moment(timeStart).format("MMMM Do YYYY, h:mm:ss a")}
                                       onChange={(e) => setTimeStart(new Date(e.target.value))}
                                       isDisabled={true}
                                />
                            </div>

                            <div className={"flex flex-col w-[48%]"}>
                                <p className={"text-[12px] mb-[15px]"}>Time End</p>
                                <Input type={"default"} placeholder={"e.g 01/01/2024"} className={"w-full bg-main-grey"}
                                       value={moment(timeEnd ).format("MMMM Do YYYY, h:mm:ss a")}
                                       onChange={(e) => setTimeEnd(new Date(e.target.value))}
                                       isDisabled={true}
                                />
                            </div>
                        </div>

                        <div className={"flex flex-col w-full mb-[15px]"}>
                            <p className={"text-[12px] mb-[15px]"}>Client Name</p>
                            <Input type={"default"} placeholder={"John Doe"} className={"w-full bg-main-grey"}
                                   value={schedule?.clientName}
                                   onChange={(e) => setClientName(e.target.value)}
                                   isDisabled={true}
                            />
                        </div>

                        <div className={"flex flex-col w-[48%] mb-[15px]"}>
                            <p className={"text-[12px] mb-[15px]"}>Client Phone Number</p>
                            <Input type={"default"} placeholder={"08134229044"} className={"w-full bg-main-grey"}
                                   value={schedule?.clientPhone}
                                   onChange={(e) => setPhone(e.target.value)}
                                   isDisabled={true}
                            />
                        </div>

                        <div className={"flex flex-col w-full mb-[15px]"}>
                            <p className={"text-[12px] mb-[15px]"}>Location</p>
                            <Input type={"default"} placeholder={"e.g Haven Apartment"} className={"w-full bg-main-grey"}
                                   value={location}
                                   onChange={(e) => setLocation(e.target.value)}
                                   isDisabled={true}
                            />
                        </div>

                        {/*<div className={"flex flex-row items-center w-full mb-[15px] justify-between"}>*/}
                        {/*    <div className={"w-[48%] border-main-secondary border-[1px] p-[18px] " +*/}
                        {/*        "items-center justify-center rounded-[5px]"*/}
                        {/*    }>*/}
                        {/*        <p className={"text-main-secondary text-[13px] font-bold text-center self-center"}>Reschedule Visit</p>*/}
                        {/*    </div>*/}

                        {/*    <div className={"w-[48%] bg-main-secondary border-[1px] p-[18px] " +*/}
                        {/*        "items-center justify-center rounded-[5px]"*/}
                        {/*    }>*/}
                        {/*        <p className={"text-main-white text-[13px] font-bold text-center self-center"}>Approve Visit</p>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                    </div>

                </div>

                <div className={"md:w-[30%] overflow-y-scroll hidden md:block"}>
                    <div className={"mb-[40px]"}>
                        <div className={"w-full flex flex-row flex-wrap"}>
                            <VisitCards/>
                        </div>
                    </div>

                    <Scheduler />

                </div>
            </div>

        </div>

    );
}

export default ViewDashboard;

const styles = {
    container: "",
}
