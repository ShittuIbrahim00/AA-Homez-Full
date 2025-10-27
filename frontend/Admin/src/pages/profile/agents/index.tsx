import React, { useContext, useEffect, useState } from "react";
import { NotificationCard, PropertyHeader } from "@/components/Custom";
import Image from "next/image";
import { PendingVisitations } from "../../../constants/data";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { AgentTable } from "@/components/agents";
import { GlobalContext } from "@/context/global";
import { _getAgents } from "@/hooks/agent.hooks";
import { rankImage } from "@/utils/propertyUtils";

function Notifications(props) {
  const router = useRouter();

  const gotoPage = (value: string) => {
    router.push(value, undefined, { shallow: true });
  };

  const query = router.query;

  console.log(query, "djhdbdjdjdhsjhds");

  // @ts-ignore
  const [data, setData, loader, setLoader] = useContext<any>(GlobalContext);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // constants
  const unvAgents = data?.agents ?? [];

  console.log(unvAgents, "jjjjjj");

  const getAllAgents = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const agents = await _getAgents(page, limit);

      console.log({ agents: agents[0] });
      if (agents !== false && agents.length > 0) {
        // console.log({agents});
        setData({ agents });
        setLoading(false);
        return agents;
        // setUnvAgents(agents);
      }

      setLoading(false);
    } catch (e: any) {
      console.log("error: ", e.message);
    }
  };

  useEffect(() => {
    const _constructor = async () => {
      await getAllAgents(currentPage, rowsPerPage);
    };
    _constructor();
  }, [currentPage, rowsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //states
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  //functions

  console.log(data?.agents);

  return (
    <div
      className={
        "w-full h-full bg-blue text-black px-[30px] flex flex-col items-center justify-center"
      }
    >
      <div className={"w-full flex flex-col-reverse overflow-y-scroll"}>
        {/*Visitation body*/}
        <div className={"w-full flex flex-col mt-[10px] pb-[30px]"}>
          {/*Header*/}
          <PropertyHeader
            text={"Agents"}
            onClick={() => console.log("Properties...")}
            // data={unvAgents}
          />
          {/*{*/}
          {/*    PendingVisitations.length == 0 ?*/}

          {/*        <div className={"w-[95%] mt-[20%] flex items-center justify-center"}>*/}
          {/*            <h2 className={"font-medium text-[13px] text-gray-800"}>No unverified agents found!</h2>*/}
          {/*        </div>*/}
          {/*        :*/}
          {/*        <div className={"w-[95%] mt-[20px] items-center self-start"}>*/}
          {/*            <table className={"w-full bg-main-milk border-black border-2 rounded-[25px] p-[30px] flex flex-col pl-[40px]"}>*/}
          {/*                <tr className={"flex items-center justify-evenly mb-[20px] "}>*/}
          {/*                    <th> </th>*/}
          {/*                    <th>Agent Name</th>*/}
          {/*                    <th>Contact</th>*/}
          {/*                    <th>Email</th>*/}
          {/*                    <th>Date</th>*/}
          {/*                </tr>*/}

          {/*                {    loading ?*/}
          {/*                    <div className={"w-full mt-[20%] flex items-center justify-center"}>*/}
          {/*                        <CircularProgress size={70}  />*/}
          {/*                    </div>*/}
          {/*                    :*/}
          {/*                    PendingVisitations.map((item, index) => (*/}
          {/*                        <tr*/}
          {/*                            className={"flex items-center justify-evenly ml-[-40px] py-[20px] mt-[10px] mb-[10px] border-b-[1px] border-black cursor-pointer"}*/}
          {/*                            onClick={() => gotoPage("/agents/view-agent")}*/}
          {/*                        >*/}
          {/*                            <td><Image src={item.image} alt={"user"} className={"w-[35px] h-[35px] rounded-full object-cover"} /></td>*/}
          {/*                            <td>{item.name}</td>*/}
          {/*                            <td>{item.date}</td>*/}
          {/*                            <td>{item.property}</td>*/}
          {/*                            <td>{item.time}</td>*/}
          {/*                        </tr>*/}
          {/*                    ))*/}
          {/*                }*/}
          {/*            </table>*/}
          {/*        </div>*/}
          {/*}*/}

          <AgentTable
            title={"Agents"}
            loading={loading}
            data={unvAgents}
            clickable={true}
            pagination
            totalRows={totalRows}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />

          {/* <PropertyHeader
            text={"All Agents"}
            onClick={() => console.log("agents...")}
            style={"mt-[45px]"}
          />
          <AgentTable
            title={"All Agents"}
            loading={loading}
            data={unvAgents}
            clickable={true}
          /> */}
          {/* {unvAgents.length == 0 ? (
            <div
              className={"w-[95%] mt-[20%] flex items-center justify-center"}
            >
              <h2 className={"font-medium text-[13px] text-gray-800"}>
                No active agents found!
              </h2>
            </div>
          ) : (
            <div
              className={
                "w-[95%] mt-[20px] flex flex-row items-center flex-wrap"
              }
            >
              {loading ? (
                <div
                  className={"w-full mt-[20%] flex items-center justify-center"}
                >
                  <CircularProgress size={70} />
                </div>
              ) : (
                unvAgents.map((item, index) => (
                  <div
                    className={
                      "flex flex-col w-[250px] md:w-[280px] md:h-[200px] items-center justify-center py-[10px] px-[80px] mt-[10px] mb-[10px] border-gray-700 border-[1px] m-[15px] cursor-pointer"
                    }
                    onClick={() => gotoPage(`/agents/${item.aid}/view-agent`)}
                    key={index}
                  >
                    <Image
                      src={
                        item.imgUrl ??
                        require("../../../public/icons/person_4.png")
                      }
                      alt={"user_image"}
                      className={
                        "w-[70px] h-[70px] mt-[20px] object-cover rounded-full"
                      }
                    />

                    <h3
                      className={
                        "text-black font-bold text-[13px] my-[5px] w-full text-center"
                      }
                    >
                      {item?.fullName}
                    </h3>
                    <div className={"flex flex-row items-center"}>
                      <h3
                        className={"text-black text-[13px] my-[10px] mr-[5px]"}
                      >
                        {item.rank}
                      </h3>
                      <Image
                        src={require(rankImage(`${item?.rank}`))}
                        alt={"sliver art"}
                        className={
                          "flex flex-row items-center my-[15px] w-[20px] h-[20px]"
                        }
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
