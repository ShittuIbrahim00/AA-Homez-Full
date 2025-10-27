import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@/components/Custom";
import { getSingleSubPropertes } from "@/utils/api";
import { PropertyContext } from "@/context/property";
import { SchedulerContext } from "@/context/scheduler";

function Details(props) {
  const router = useRouter();
  const { id } = router.query;
  // const params = useParams()

  // contexts
  // @ts-ignore
  const [hot, setHot, sub, setSub, full, setFull, tempProp, setTempProp] =
    useContext(PropertyContext);
  // @ts-ignore
  const [temp, setTemp] = useContext(SchedulerContext);

  //states
  const [selectedV, setSelectedV] = useState("All");
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<any>(null);

  const data = [
    "All",
    "Key Info",
    "Bedrooms",
    "Bathrooms",
    "Interior Features",
    "Appliances",
    "Other rooms",
    "Land Info",
    "Building Info",
    "Utilities",
  ];

  // function
  const _constructor = async () => {
    setLoading(true);
    const subPropertyId = Array.isArray(id) ? id[0] : id;
    const subPropertyData = await getSingleSubPropertes(subPropertyId);
    const prop = subPropertyData?.data || {};
    setProperty(prop);
    setLoading(false);
  };

  const gotoPage = (value: string, query: boolean = false) => {
    if (query) {
      router.push(
        {
          pathname: value,
          query: {
            live: true,
          },
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push(value, undefined, { shallow: true });
    }
  };

  useEffect(() => {
    if (id) _constructor();
  }, [id]);

  return (
    <div
      className={
        "w-full h-full text-black px-[30px] flex flex-col max-w-[90vw] mb-10 pb-[20px] overscroll-none"
      }
    >
      {/*header*/}
      <div className={"flex flex-row items-center w-full mb-[20px]"}>
        <Image
          src={require("../../../../../public/svg/arrow_back_black.svg")}
          alt={"back button"}
          className={"w-[40px] h-[40px] mr-[20px] p-[5px] cursor-pointer"}
          onClick={() => router.back()}
        />

        <h2 className={"text-black text-[14px] font-semibold"}>Details</h2>
      </div>
      <div
        className={
          "w-full p-[20px] border-b-[1px] border-black flex flex-row items-center overflow-hidden overflow-x-scroll"
        }
      >
        {data.map((item, index) => (
          <div
            className={
              "flex flex-row items-center justify-center mx-[15px] cursor-pointer"
            }
            key={index}
            onClick={() => setSelectedV(item)}
          >
            <p
              className={
                selectedV === item
                  ? "text-black font-semibold text-[13px] p-[5px] border-b-[2px] border-main-secondary whitespace-nowrap"
                  : "text-black font-semibold text-[13px] p-[5px] whitespace-nowrap"
              }
            >
              {item}
            </p>
          </div>
        ))}
      </div>

      {loading ? (
        <div
          className={
            "w-[150px] h-[100px] mt-[30%] flex self-center animate-bounce"
          }
        >
          <Image
            src={require("../../../../../public/icons/logo.png")}
            alt={"logo"}
          />
        </div>
      ) : (
        // Body
        <div className={"w-full overflow-y-scroll flex flex-col"}>
          <div className={`w-full grid gap-2 grid-cols-2 p-[30px]`}>
            {/* Key Info */}
            {(selectedV === "All" || selectedV === "Key Info") && (
              <div className={"mr-[20px] ml-[20px] mb-[25px]"}>
                <h2
                  className={"font-semibold text-black text-[14px] mb-[20px]"}
                >
                  Key Info
                </h2>
                <div className={"flex flex-col"}>
                  {property?.keyInfo?.map((item, index) => (
                    <div
                      className={
                        "flex flex-row items-center justify-between mb-[15px]"
                      }
                      key={index}
                    >
                      <p className={"text-black text-[12px]"}>
                        {item.name || item.label}
                      </p>
                      <p className={"text-black text-[12px]"}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bedrooms */}
            {(selectedV === "All" || selectedV === "Bedrooms") && (
              <div className={"mr-[20px] ml-[20px] mb-[25px]"}>
                <h2
                  className={"font-semibold text-black text-[14px] mb-[20px]"}
                >
                  Bedrooms
                </h2>
                <div className={"flex flex-col"}>
                  <div className={"flex flex-row items-center justify-between"}>
                    <p className={"text-black text-[12px]"}>Bedrooms</p>
                    <p className={"text-black text-[12px]"}>
                      {property?.bedrooms}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bathrooms */}
            {(selectedV === "All" || selectedV === "Bathrooms") && (
              <div className={"mr-[20px] ml-[20px] mb-[25px]"}>
                <h2
                  className={"font-semibold text-black text-[14px] mb-[20px]"}
                >
                  Bathrooms
                </h2>
                <div className={"flex flex-col"}>
                  {property?.bathrooms?.map((item, index) => (
                    <div
                      className={
                        "flex flex-row items-center justify-between mb-[15px]"
                      }
                      key={index}
                    >
                      <p className={"text-black text-[12px]"}>
                        {item.type || item.label}
                      </p>
                      <p className={"text-black text-[12px]"}>{item.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interior Features */}
            {(selectedV === "All" || selectedV === "Interior Features") && (
              <div className={"mr-[20px] ml-[20px] mb-[25px]"}>
                <h2
                  className={"font-semibold text-black text-[14px] mb-[20px]"}
                >
                  Interior
                </h2>
                <div className={"flex flex-col"}>
                  {property?.interior?.map((item, index) => (
                    <div
                      className={
                        "flex flex-row items-center justify-between mb-[15px]"
                      }
                      key={index}
                    >
                      <p className={"text-black text-[12px]"}>
                        {typeof item === "string" ? item : item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appliances */}
            {(selectedV === "All" || selectedV === "Appliances") && (
              <div className={"mr-[20px] ml-[20px] mb-[25px]"}>
                <h2
                  className={"font-semibold text-black text-[14px] mb-[20px]"}
                >
                  Appliances
                </h2>
                <div className={"flex flex-col"}>
                  {property?.appliances?.map((item, index) => (
                    <div
                      className={
                        "flex flex-row items-center justify-between mb-[15px]"
                      }
                      key={index}
                    >
                      <p className={"text-black text-[12px]"}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Rooms */}
            {(selectedV === "All" || selectedV === "Other rooms") && (
              <div className={"mr-[20px] ml-[20px] mb-[25px]"}>
                <h2
                  className={"font-semibold text-black text-[14px] mb-[20px]"}
                >
                  Other Rooms
                </h2>
                <div className={"flex flex-col"}>
                  {property?.otherRooms?.map((item, index) => (
                    <div
                      className={
                        "flex flex-row items-center justify-between mb-[15px]"
                      }
                      key={index}
                    >
                      <p className={"text-black text-[12px]"}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Land Info */}
            {(selectedV === "All" || selectedV === "Land Info") && (
              <div className={"mr-[20px] ml-[20px] mb-[25px]"}>
                <h2
                  className={"font-semibold text-black text-[14px] mb-[20px]"}
                >
                  Land Information
                </h2>
                <div className={"flex flex-col"}>
                  {property?.landInfo?.map((item, index) => (
                    <div
                      className={
                        "flex flex-row items-center justify-between mb-[15px]"
                      }
                      key={index}
                    >
                      <p className={"text-black text-[12px]"}>
                        {item.name || item.label}
                      </p>
                      <p className={"text-black text-[12px]"}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Building Info */}
            {(selectedV === "All" || selectedV === "Building Info") && (
              <div className={"mr-[20px] ml-[20px] mb-[25px]"}>
                <h2
                  className={"font-semibold text-black text-[14px] mb-[20px]"}
                >
                  Building Information
                </h2>
                <div className={"flex flex-col"}>
                  {property?.buildInfo?.map((item, index) => (
                    <div
                      className={
                        "flex flex-row items-center justify-between mb-[15px]"
                      }
                      key={index}
                    >
                      <p className={"text-black text-[12px]"}>
                        {item.name || item.label}
                      </p>
                      <p className={"text-black text-[12px]"}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Utilities */}
            {(selectedV === "All" || selectedV === "Utilities") && (
              <div className={"mr-[20px] ml-[20px] mb-[25px]"}>
                <h2
                  className={"font-semibold text-black text-[14px] mb-[20px]"}
                >
                  Utilities
                </h2>
                <div className={"flex flex-col"}>
                  {property?.utilities?.map((item, index) => (
                    <div
                      className={
                        "flex flex-row items-center justify-between mb-[15px]"
                      }
                      key={index}
                    >
                      <p className={"text-black text-[12px]"}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className={
              "flex flex-col items-center justify-center w-[50%] self-center mb-[10px] cursor-pointer"
            }
          >
            <Button
              text={"Schedule Visit"}
              onClick={() => {
                setTemp(property);
                gotoPage("/schedule/create", true);
              }}
            />
          </div>

          <div
            className={
              "flex flex-col items-center justify-center w-[50%] self-center mb-[10px] bottom-[50px]"
            }
          >
            <div className={"py-[30px]"}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;
