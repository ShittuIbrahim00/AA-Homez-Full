import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {useRouter} from "next/router";
import {GlobalContext} from "@/context/global";
import {_getAllApprovedSchedules, _getAllPendingSchedules} from "@/hooks/schedule.hooks";
import {toast} from "react-toastify";
import {VisitationCard} from "@/components/Custom";
import {CircularProgress} from "@mui/material";

function VisitCards(props) {

    const router = useRouter();

    // @ts-ignore
    const [data, setData, loader, setLoader] = useContext(GlobalContext);

    const [loading, setLoading] = useState(false);

    // constants
    const apprVisits = data?.aSch ?? [];

    // console.log({apprVisits});

    //functions
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

    useLayoutEffect(() => {
        const _constructor = async() => {
            try {
                setLoading(true);

                const aSch = await _getAllApprovedSchedules();

                if(Array.isArray(aSch) && aSch.length > 0){
                    setData({aSch});
                    setLoading(false);
                }

                setLoading(false);

            } catch (e: any) {
                setLoading(false);
                toast.error(e.message);
            }
        }

        // @ts-ignore
        // _constructor();

    }, []);

    return (
        <div>
            {
                loading ?
                    <div className={"w-full mt-[30px] mb-[30px] flex items-center justify-center"}>
                        <CircularProgress size={55}  />
                    </div>
                    :
                apprVisits?.length == 0 && !loading ?
                    <div className={"w-[95%] mt-[30px] mb-[30px] flex items-center justify-center self-center"}>
                        <h2 className={"font-medium text-[13px] text-gray-800 text-center"}>No upcoming visitation at the moment</h2>
                    </div>
                    :
                apprVisits?.map((visit, index) => (
                    <>
                        <p className={"font-light text-black ml-[40px] text-[14px] mb-[-10px]"}>{visit?.date}</p>
                        <VisitationCard
                            onClick={() => gotoPage("/schedule/view", {id: visit?.scid})}
                            item={visit}
                            key={index}
                            containerStyles={{width: "98%"}}
                        />
                    </>
                ))
            }
        </div>
    );
}

export default VisitCards;
