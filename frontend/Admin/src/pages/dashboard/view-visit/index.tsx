import React, {useContext, useEffect, useState} from 'react';
import {ConsentModal, Input, PropertyCard, PropertyHeader, VisitationCard} from "@/components/Custom";
import {useRouter} from "next/router";
import {_getAllHotProperty, _getProperties} from "@/hooks/property.hooks";
import {PropertyContext} from "@/context/property";
import {CircularProgress} from "@mui/material";
import {Scheduler, VisitCards} from "@/components/schedule";
import Image from "next/image";
import {PendingVisitations} from "../../../constants/data";
import moment from "moment";
import DatePicker from 'react-datepicker';
import { FaCalendarAlt } from "react-icons/fa";

import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TimePicker from "react-time-picker";
import {_approveSchedule, _getSchedule, _updateSchedule} from "@/hooks/schedule.hooks";
import {rankImage} from "@/utils/propertyUtils";


function ViewDashboard(props){

    const router = useRouter();

    //contexts
    // @ts-ignore
    const [hotProperties, setHotProperties, subProperty, setSubProperty, fullProperties, setFullProperties, tempProp] = useContext(PropertyContext);

    //states
    const [loading, setLoading] = useState(false);
    const [loadingP, setLoadingP] = useState(false);
    const [visit, setVisit] = useState<any>(null);
    const [property, setProperty] = useState("");
    const [sProperty, setSProperty] = useState("");
    const [date, setDate] = useState(new Date());
    const [timeStart, setTimeStart] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    const [clientName, setClientName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");

    const [isReschVisit, setIsReschVisit] = useState(false);

    const [isReschModalOpen, setReschModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);


    const data = [];


    const id = router.query?.id;
    console.log({id})

    //functions
    const handleDateChange = (date) => {
        setDate(date);
        setDatePickerOpen(false);
    };

    const handleTimeChange = (time, type) => {
        if(type === "start"){
            setTimeStart(time)
        } else {
            setTimeEnd(time)
        }
        // setSelectedTime(time);
    };


    const onOpenResch = () => {
        setReschModalOpen(true);
    };

    const onCloseResch = () => {
        setReschModalOpen(false);
        setLoading(false);
    };

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

    const _constructor = async () => {
        setLoading(true);
        const scheduleId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
        if (isNaN(scheduleId)) {
            setLoading(false);
            return;
        }
        const res = await _getSchedule(scheduleId);
        console.log({res});
        if(res !== null){
            setVisit(res);
            setProperty(res?.Property?.name ?? "");
            setSProperty(res?.SubProperty?.name ?? "");
            // setLocation(res?.location ?? ""); // Removed as location property doesn't exist
            setTimeStart(res.start);
            setTimeEnd(res.end);
            setClientName(res?.clientName || "");
            setPhone(res?.clientPhone || "");
        }
        setLoading(false);
    }


    const onReschdule = (value) => {
        setIsReschVisit(value);
        setReschModalOpen(false);
    }

    const onApprove = async () => {
        setIsReschVisit(false);
        const scheduleId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
        if (isNaN(scheduleId)) return;

        setLoading(true);
        const res = await _approveSchedule(scheduleId);
        console.log({res});
        if(res !== false){
            setVisit(res);
            onCloseResch();
        }
        setLoading(false);
    }

    const onSave = async() => {
        const scheduleId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
        if (isNaN(scheduleId)) return;

        const data = {
            date: moment(date).format("YYYY-MM-DD"),
            time: `${timeStart} - ${timeEnd}`
        };

        // console.log({data, });

        setLoading(true);

        const res = await _updateSchedule(scheduleId, moment(date).format("YYYY-MM-DD"), `${timeStart} - ${timeEnd}`);
        console.log({res});
        if(res !== false){
            setVisit(res);
            setProperty(res?.Property?.name ?? "");
            setSProperty(res?.SubProperty?.name ?? "");
            // setLocation(res?.location ?? ""); // Removed as location property doesn't exist
            setTimeStart(res.start);
            setTimeEnd(res.end);
            setClientName(res?.clientName || "");
            setPhone(res?.clientPhone || "");
            setIsReschVisit(false);
            setLoading(false);
        }
        setLoading(false);
    }


    useEffect(() => {
        _constructor();
        // return () => setVisit(null);
    }, []);

    return (
        <div className={"w-full h-full text-black px-[30px] flex flex-col overflow-y-scroll"}>
            <div className={"w-full flex md:flex-row overflow-y-scroll flex-col"}>
                {loading ?
                    <div className={"w-full mt-[30px] mb-[30px] flex items-center justify-center"}>
                        <CircularProgress size={50}  />
                    </div>
                        :
                    <div className={"w-full md:w-[70%] flex flex-col-reverse md:flex-col overflow-y-scroll"}>

                        {/*header*/}
                        <div className={"flex flex-row items-center mb-[30px] "}>
                            <Image
                                src={require("../../../../public/icons/person_4.png")}
                                alt={"img"} className={"w-[120px] h-[120px] object-cover rounded-full"}
                            />

                            <div className={"ml-[20px]"}>
                                <h3 className={"text-[14px] font-bold text-black"}>{visit?.Agent?.fullName ?? "User"}</h3>
                                <div className={"flex flex-row items-center mt-[5px]"}>
                                    <h3 className={"text-[13.5px] font-medium text-black"}>{visit?.Agent?.rank} </h3>
                                    <Image
                                        src={require(rankImage(visit?.Agent?.rank))}
                                        alt={"level"} className={"w-[20px] h-[20px]"}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={"my-[10px] w-[95%]"}>
                            <div className={"flex flex-col w-full mb-[15px]"}>

                                <p className={"text-[12px] mb-[15px]"}>Property</p>

                                <Input
                                    type={"default"}
                                    placeholder={"Haven Apartment"}
                                    className={"w-full bg-main-grey"}
                                    value={property}
                                    onChange={(e) => setProperty(e.target.value)}
                                    isDisabled={true}
                                />

                            </div>

                            <div className={"flex flex-col w-full mb-[15px]"}>

                                <p className={"text-[12px] mb-[15px]"}>Sub-Property</p>

                                <Input
                                    type={"default"}
                                    placeholder={"No 2 Square Street Haven Apartment"}
                                    className={"w-full bg-main-grey"}
                                    value={sProperty}
                                    onChange={(e) => setSProperty(e.target.value)}
                                    isDisabled={true}
                                />
                            </div>

                            <div className={"flex flex-col w-full mb-[15px]"}>

                                <p className={"text-[12px] mb-[10px]"}>Date</p>

                                <button
                                    className={"w-full p-[15px] bg-main-grey flex flex-row items-center justify-between cursor-pointer"}
                                    onClick={(e) => setDatePickerOpen(!isDatePickerOpen)}
                                    disabled={!isReschVisit}
                                >
                                    <p className={"text-black text-[12px]"}>{moment(date).format("DD/MM/YYYY")}</p>
                                    <FaCalendarAlt size={15}/>
                                </button>

                            </div>
                            {isDatePickerOpen && (
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    inline
                                />
                            )}


                            <div className={"flex flex-row items-center justify-between w-full mb-[15px]"}>
                                <div className={"flex flex-col w-[48%]"}>

                                    <p className={"text-[12px] mb-[15px]"}>Time Start</p>

                                    {/*<Input type={"default"} placeholder={"10:00am"} className={"w-full bg-main-grey"}*/}
                                    {/*       value={timeStart}*/}
                                    {/*       onChange={(e) => setTimeStart(e.target.value)}*/}
                                    {/*       isDisabled={!isReschVisit}*/}
                                    {/*/>*/}

                                    <TimePicker
                                        onChange={(val) => handleTimeChange(val, "start")}
                                        value={timeStart}
                                        className={"w-full bg-main-grey p-[5px] text-[12px]"}
                                        hourPlaceholder={"10"}
                                        minutePlaceholder={"00"}
                                        secondPlaceholder={"00"}
                                        disabled={!isReschVisit}
                                        disableClock={!isReschVisit}
                                        // format={"12"}
                                    />

                                </div>

                                <div className={"flex flex-col w-[48%]"}>

                                    <p className={"text-[12px] mb-[15px]"}>Time End</p>
                                    <TimePicker
                                        onChange={(val) => handleTimeChange(val, "end")}
                                        value={timeEnd}
                                        className={"w-full bg-main-grey p-[5px] text-[12px]"}
                                        hourPlaceholder={"11"}
                                        minutePlaceholder={"00"}
                                        secondPlaceholder={"00"}
                                        disabled={!isReschVisit}
                                        disableClock={!isReschVisit}
                                    />
                                </div>
                            </div>

                            <div className={"flex flex-col w-full mb-[15px]"}>

                                <p className={"text-[12px] mb-[15px]"}>Client Name</p>

                                <Input type={"default"} placeholder={"Mr. Yusuf Adamu"}
                                       className={"w-full bg-main-grey"}
                                       value={clientName}
                                       onChange={(e) => setClientName(e.target.value)}
                                       isDisabled={true}
                                />
                            </div>

                            <div className={"flex flex-col w-[48%] mb-[15px]"}>

                                <p className={"text-[12px] mb-[15px]"}>Phone</p>

                                <Input type={"default"} placeholder={"+2348012890156"}
                                       className={"w-full bg-main-grey"}
                                       value={phone}
                                       onChange={(e) => setPhone(e.target.value)}
                                       isDisabled={true}
                                />
                            </div>

                            <div className={"flex flex-col w-full mb-[15px]"}>

                                <p className={"text-[12px] mb-[15px]"}>Location</p>

                                <Input type={"default"} placeholder={"No 22 Behind Cast Yard, Asokoro"}
                                       className={"w-full bg-main-grey"}
                                       value={location}
                                       onChange={(e) => setLocation(e.target.value)}
                                       isDisabled={true}
                                />
                            </div>

                            {
                                visit?.status === "pending" &&
                                <div
                                    className={`flex flex-row items-center w-full my-[45px] justify-between ${isReschVisit ? "mx-[0px]" : "mx-[30px]"} `}>

                                    {(!isReschVisit && !loading) &&
                                        <div
                                            className={"w-[48%] border-main-secondary border-[1px] p-[18px] items-center justify-center rounded-[5px] cursor-pointer"}
                                            onClick={() => onReschdule(true)}
                                        >
                                            <p className={"text-main-secondary text-[13px] font-bold text-center self-center"}>
                                                Reschedule Visit
                                            </p>
                                        </div>
                                    }

                                    <div
                                        className={`${isReschVisit || loading ? "w-full" : "w-[48%]"} self-center bg-main-secondary border-[1px] p-[18px] items-center justify-center rounded-[5px] cursor-pointer`}
                                        onClick={() => {
                                            if (isReschVisit) {
                                                onSave();
                                            } else {
                                                onOpenResch();
                                            }
                                        }}
                                    >
                                        {
                                            loading ?
                                                <div className={"w-full flex items-center justify-center"}>
                                                    <CircularProgress size={25}/>
                                                </div>
                                                :
                                                <p className={"text-main-white text-[13px] font-bold text-center self-center"}>{isReschVisit ? "Update Visit" : "Approve Visit"}</p>
                                        }
                                    </div>
                                </div>
                            }
                        </div>

                    </div>
                }

                <div className={"md:w-[30%] overflow-y-scroll hidden md:block"}>
                    <div className={"mb-[40px]"}>
                        {/*Header*/}
                        {/*<PropertyHeader text={"Pending Approval"} onClick={() => console.log("Properties...")} noExternal />*/}

                        {/*Properties body*/}
                        <div className={"w-full flex flex-row flex-wrap"}>
                            <VisitCards/>
                        </div>
                    </div>

                    <Scheduler seeFull={true} />

                </div>
            </div>


            {
                isReschModalOpen &&
                    <ConsentModal
                        isOpen={isReschModalOpen}
                        onSubmit={() => onApprove()}
                        onClose={onCloseResch}
                    />
            }
        </div>

    );
}

export default ViewDashboard;

const styles = {
    container: "",
}
