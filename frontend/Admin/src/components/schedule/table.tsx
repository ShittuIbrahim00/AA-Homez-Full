import React from 'react';
import {CircularProgress} from "@mui/material";
import Image from "next/image";
import {useRouter} from "next/router";

const Table = ({title, data, loading}) => {

    const router = useRouter();

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
        <div>
            {
                data.length == 0 && !loading ?

                    <div className={"w-[95%] mt-[30px] mb-[30px] flex items-center justify-center"}>
                        <h2 className={"font-medium text-[13px] text-gray-800"}>No {title} visitation found!</h2>
                    </div>
                    :
                    <div className={"w-[95%] mt-[20px] items-center self-start"}>
                        <table className={"w-full bg-main-milk border-black border-2 rounded-[25px] p-[30px] flex flex-col pl-[40px]"}>

                            <tr className={"flex items-center justify-evenly mb-[20px] self-start w-full "}>
                                <th className={"w-[5%]"}>  </th>
                                <th className={"w-[20%] text-center"}>Agent Name</th>
                                <th className={"w-[20%] text-center"}>Date</th>
                                <th className={"w-[20%] text-center"}>Property</th>
                                <th className={"w-[20%] text-center"}>Time</th>
                            </tr>

                            {
                                loading ?
                                    <div className={"w-full mt-[30px] mb-[30px] flex items-center justify-center"}>
                                        <CircularProgress size={55}  />
                                    </div>
                                    :
                                    data.map((item, index) => (
                                        <tr
                                            className={"flex items-center self-end justify-evenly ml-[-40px] w-full " +
                                                "py-[20px] mt-[10px] mb-[10px] border-b-[1px] border-black cursor-pointer"
                                            }
                                            onClick={() => {
                                                // console.log({item})
                                                gotoPage("/dashboard/view-visit", {id: item?.scid});
                                            }}
                                            key={index}
                                        >
                                            <td className={"w-[12%]"}>
                                                <Image
                                                    src={item?.Agent?.image ?? require("../../../public/icons/person_4.png")}
                                                    alt={"user"}
                                                    className={"w-[35px] h-[35px] rounded-full object-cover"}
                                                />
                                            </td>
                                            <td className={"w-[20%]"}>{item?.Agent?.fullName}</td>
                                            <td className={"w-[20%]"}>{item?.date}</td>
                                            <td className={"w-[20%] mr-[20px]"}>{item?.Property?.name}</td>
                                            <td className={"w-[20%]"}>{item?.time}</td>
                                        </tr>
                                    ))
                            }
                        </table>
                    </div>
            }
        </div>
    );
};

export default Table;
