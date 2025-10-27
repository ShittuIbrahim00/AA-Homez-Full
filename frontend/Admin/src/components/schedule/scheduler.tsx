import React, {useState, useContext} from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import {useRouter} from "next/router";
import {GlobalContext} from "@/context/global";

type SchedulerType = {
    seeFull?: boolean,
    full?: boolean,
    containerStyle?: string | any
}

const Scheduler: React.FC<SchedulerType> = ({seeFull, full, containerStyle }) =>{

    //Constants
    const router = useRouter();


    //contexts
    // @ts-ignore
    const [data, setData, loader, setLoader] = useContext(GlobalContext);

    const [loading, setLoading] = useState(false);

    // constants
    const apprVisits = data?.aSch ?? [];

    // const eventsCal = apprVisits.map((v, index) => {v.scid, v.name, v.start, v.end, v.title});

    // console.log({eventsCal});

    const events = [
        {
            id: '1',
            title: 'Meeting 1',
            sid: "1",
            start: '2024-02-25T10:00:00',
            end: '2024-02-27T12:00:00',
        },
        {
            id: '2',
            sid: "1",
            title: 'Meeting 2',
            start: '2023-11-08T14:00:00',
            end: '2023-11-08T16:00:00',
        },
        // Add more events as needed
    ];

    //Functions
    // const gotoPage = (value: string, event?: any)=> {
    //
    //     // router.push(
    //     //     value,
    //     //     undefined,
    //     //     {shallow: true}
    //     // )
    //
    //     console.log({event});
    // }

    const gotoPage = (value: string, query?: any) => {

        if(query){
            // console.log(query);
            router.push(
                {pathname: value,
                    query:{
                        ...query
                    }
                }, undefined,
                {shallow: true}
            );

        } else {
            router.push(
                value,
                undefined, {shallow: true}
            )
        }
    };

    return (
        <div
            className={"flex flex-col"}
        >
            <FullCalendar
                eventColor={"#FE783D"}
                plugins={[dayGridPlugin, timeGridPlugin, resourceTimeGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                eventClick={(e) => gotoPage("/schedule/view", {id: e.event?._def?.extendedProps?.sid})}
                resources={[
                    { id: 'roomA', title: 'Room A' },
                    { id: 'roomB', title: 'Room B' },
                    // Define your resources here
                ]}
                // viewClassNames={"bg-main-grey"}
                slotLabelClassNames={"text-black"}
                moreLinkClassNames={"text-main-white"}
                moreLinkContent={"text-main-black"}
                dayHeaderClassNames={` ${full ? " text-[20px]" : " text-[9px]"} text-black bg-grey===`}
                eventClassNames={` ${full ? " text-[30px]" : " text-[20px]" } text-black`}
                dayCellClassNames={` ${full ? " text-[30px]" : " text-[20px]" } text-black text-center items-center justify-center`}
                nowIndicatorClassNames={"bg-main-primary text-red text-[35px]"}
                // viewClassNames={`${containerStyle}`}
                // eventBackgroundColor={"#000"}

            />

            {
                seeFull &&
                <button
                    className={"self-center my-[20px] "}
                    onClick={() => gotoPage("/schedule/calendar")}
                >
                    <p className={"font-semibold text-main-primary "}>See Calendar</p>
                </button>
            }
        </div>
    );
}

export default Scheduler;
