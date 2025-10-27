import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import DataTable from "react-data-table-component";

function AgentTable({
  loading,
  data,
  title,
  clickable,
  pagination = false,
  totalRows = 0,
  currentPage = 1,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
}) {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const gotoPage = (value: string) => {
    // console.log("VIEWS")
    router.push(value, undefined, { shallow: true });
  };

  useEffect(() => {
    if (data?.length > 0) {
      const updatedData = data?.map((item, index) => ({
        ...item,
        referred: item?.referredBy !== null ? "Yes" : "No",
        phone: item?.phone === null ? "xxxxxxxxxxxx" : item.phone,
        id: index + 1,
        status: item?.status, // Keep the raw status value
        statusLabel:
          item?.status === 1
            ? "Approved"
            : item?.status === 0
            ? "Pending"
            : "Rejected", // Translate status
      }));

      setResults(updatedData);
      setFilteredResults(updatedData);
    }
  }, [data?.length]);

  useEffect(() => {
    const filtered = results?.filter(
      (item: Record<string, any>) =>
        item.fullName?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.email?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.statusLabel?.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [filterText, results]);
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
    },
    {
      name: "Full Name",
      selector: (row) => row.fullName,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Referred",
      selector: (row) => row.referred,
    },
    {
      name: "Status",
      selector: (row) => row.statusLabel, // Use the translated status label
      sortable: true, // Allow sorting by status
    },
  ];

  const rows = [
    {
      id: 1,
      fullName: "John Doe",
      email: "doe@gmail.com",
      phone: "08112959740",
      referred: true ? "Yes" : "No",
    },
    {
      id: 2,
      fullName: "Jane Doe",
      email: "jane@gmail.com",
      phone: "08112959740",
      referred: false ? "Yes" : "No",
    },
    {
      id: 3,
      fullName: "Sheera Maine",
      email: "maine@gmail.com",
      phone: "08112959740",
      referred: true ? "Yes" : "No",
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.status === 1,
      style: {
        backgroundColor: "#d4edda", // Green for approved
      },
    },
    {
      when: (row) => row.status === 0,
      style: {
        backgroundColor: "#fff3cd", // Yellow for pending
      },
    },
    {
      when: (row) => row.status === -1,
      style: {
        backgroundColor: "#f8d7da", // Red for rejected
      },
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="font-medium text-[18px]">{title}</h2>
        <input
          type="text"
          placeholder="Filter by name, email, or verified"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {
        filteredResults?.length === 0 && !loading ? (
          <div
            className={
              "w-[95%] mt-[30px] mb-[30px] flex items-center justify-center"
            }
          >
            <h2 className={"font-medium text-[13px] text-gray-800"}>
              No {title} agent found!
            </h2>
          </div>
        ) : loading ? (
          <div
            className={
              "w-full mt-[30px] mb-[30px] flex items-center justify-center"
            }
          >
            <CircularProgress size={55} />
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={filteredResults}
              fixedHeader
              pagination={pagination}
              paginationServer
              paginationTotalRows={15}
              paginationDefaultPage={currentPage}
              paginationPerPage={rowsPerPage}
              onChangePage={onPageChange}
              onChangeRowsPerPage={onRowsPerPageChange}
              onRowClicked={(row) => {
                if (clickable) {
                  gotoPage(`/agents/${row.aid}/view-agent`);
                }
              }}
              highlightOnHover
              pointerOnHover={clickable}
              conditionalRowStyles={conditionalRowStyles}
            />
          </>
        )
        // <div className={"w-[95%] mt-[20px] items-center self-start"}>
        //     <table className={"w-full bg-main-milk border-black border-2 " +
        //         "rounded-[25px] p-[30px] flex flex-col pl-[40px]"}>
        //         <tr className={"flex items-center justify-evenly mb-[20px]"}>
        //             <th className={"w-[5%]"}> </th>
        //             <th className={"w-[20%]"}>Agent Name</th>
        //             <th className={"w-[20%]"}>Phone</th>
        //             <th className={"w-[20%]"}>Email Address</th>
        //             <th className={"w-[20%]"}>Referred</th>
        //         </tr>

        //         {
        //             loading ?
        //                 <div className={"w-full mt-[30px] mb-[30px] flex items-center justify-center"}>
        //                     <CircularProgress size={55}  />
        //                 </div>
        //                 :
        //                 data.map((item, index) => (
        //                     <tr
        //                         className={"flex items-center justify-evenly ml-[-40px] py-[20px] " +
        //                             "mt-[10px] mb-[10px] border-b-[1px] border-black w-full self-end cursor-pointer"
        //                         }
        //                         onClick={() => {
        //                             if(clickable) {
        //                                 gotoPage(`/agents/${item?.aid}/view-agent`);
        //                             } else {
        //                                 null;
        //                             }
        //                         }}
        //                         key={index}
        //                     >
        //                         <td className={"w-[5%]"}>
        //                             <Image
        //                                 src={item.imgUrl ?? require("../../../public/icons/person_4.png")}
        //                                 alt={"user"}
        //                                 className={"w-[35px] h-[35px] rounded-full object-cover"}
        //                             />
        //                         </td>
        //                         <td className={"w-[20%] text-center"}>{item.fullName}</td>
        //                         <td className={"w-[20%] text-center"}>{item.phone ?? "xxxxx"}</td>
        //                         <td className={"w-[20%] text-center flex flex-column"}>{item.email}</td>
        //                         <td className={"w-[20%] text-center"}>{ item?.referredBy ? "Yes" : "No" }</td>
        //                     </tr>
        //                 ))
        //         }
        //     </table>
        // </div>
      }
    </div>
  );
}

export default AgentTable;
