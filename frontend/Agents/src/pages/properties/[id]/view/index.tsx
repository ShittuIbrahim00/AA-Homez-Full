import React, {
  useState,
  useRef,
  Fragment,
  useEffect,
  useContext,
} from "react";
import Image from "next/image";
import {
  Button,
  Map,
  PropertyCard,
  PropertyCard2,
  PropertyHeader,
} from "@/components/Custom";
import { useRouter } from "next/router";
import { ShareModal } from "@/components/modal";
import { _getAllSubProperties, _getSubProperty } from "@/hooks/property.hooks";
import { PropertyContext } from "@/context/property";
import { SchedulerContext } from "@/context/scheduler";
import { getSingleSubPropertes } from "@/utils/api";

function PropertiesView(props) {
  const router = useRouter();
  const { id } = router.query;

  // context
  // @ts-ignore
  const [hot, setHot, sub, setSub, full, setFull, tempProp, setTempProp] =
    useContext(PropertyContext);
  // @ts-ignore
  const [temp, setTemp] = useContext(SchedulerContext);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [property, setProperty] = useState<any>({});
  const [otherSubProperties, setOtherSubProperties] = useState<any[]>([]);

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

  const _constructor = async () => {
    setLoading(true);
    const subPropertyId = Array.isArray(id) ? id[0] : id;
    const subPropertyData = await getSingleSubPropertes(subPropertyId);
    const prop = subPropertyData?.data || {};
    setProperty(prop);
    console.log(prop)
    const allSubProperties = await _getAllSubProperties();
    setOtherSubProperties(
      Array.isArray(allSubProperties)
        ? allSubProperties.filter(sp => sp?.sid !== subPropertyId)
        : []
    );
    setLoading(false);
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
      ) : !property ? (
        <div>
          <h2>Could not find property.</h2>
        </div>
      ) : (
        <>
          {/* Main Image and Header */}
          <div className="relative w-full h-[250px] rounded-2xl overflow-hidden">
  {property?.images && property.images.length > 0 ? (
    <Image
      src={property.images[0]}
      alt={property.name ?? "Property"}
      fill
      className="object-cover rounded-2xl"
      priority
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
      No Image
    </div>
  )}
</div>


          {/* Property Info */}
          <div className="w-full p-6 flex flex-col gap-2 bg-white rounded-xl shadow mt-6">
            <h2 className="font-bold text-2xl text-orange-700 mb-1">{property?.name}</h2>
            <p className="text-lg font-semibold text-black">{property.priceRange || property.price}</p>
            <p className="text-sm text-gray-600">{property.location} {property.landMark && <>| <span>{property.landMark}</span></>}</p>
            <p className="text-xs text-gray-500">Year Built: {property.yearBuilt}</p>
            <p className="text-xs text-gray-500">Type: {property.type} | Status: {property.listingStatus}</p>
            <p className="text-xs text-gray-500">Foundation: {property.foundation}</p>
            <p className="text-xs text-gray-500">Payment Status: {property.paymentStatus} | Paid: {property.paidAmount} | Deficit: {property.deficitAmount}</p>
            <p className="text-xs text-gray-500">PID: {property.pid} | SID: {property.sid}</p>
          </div>

          {/* Key Info, Bathrooms, Interior, Appliances, Utilities, Other Rooms */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-orange-600 mb-2">Key Info</h3>
              {property?.keyInfo?.length ? property?.keyInfo?.map((item, idx) => (
                <div key={idx} className="text-sm text-black mb-1">{item.label || item.name}: {item.value}</div>
              )) : <div className="text-gray-400">No key info</div>}
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-orange-600 mb-2">Bathrooms</h3>
              {property.bathrooms?.length ? property.bathrooms.map((item, idx) => (
                <div key={idx} className="text-sm text-black mb-1">{item.label || item.type}: {item.count}</div>
              )) : <div className="text-gray-400">No bathroom info</div>}
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-orange-600 mb-2">Interior</h3>
              {property.interior?.length ? property.interior.map((item, idx) => (
                <div key={idx} className="text-sm text-black mb-1">{typeof item === 'string' ? item : item.name}</div>
              )) : <div className="text-gray-400">No interior info</div>}
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-orange-600 mb-2">Appliances</h3>
              {property.appliances?.length ? property.appliances.map((item, idx) => (
                <div key={idx} className="text-sm text-black mb-1">{item}</div>
              )) : <div className="text-gray-400">No appliances info</div>}
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-orange-600 mb-2">Utilities</h3>
              {property.utilities?.length ? property.utilities.map((item, idx) => (
                <div key={idx} className="text-sm text-black mb-1">{item}</div>
              )) : <div className="text-gray-400">No utilities info</div>}
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-orange-600 mb-2">Other Rooms</h3>
              {property.otherRooms?.length ? property.otherRooms.map((item, idx) => (
                <div key={idx} className="text-sm text-black mb-1">{item}</div>
              )) : <div className="text-gray-400">No other rooms info</div>}
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-orange-600 mb-2">Land Info</h3>
              {property.landInfo?.length ? property.landInfo.map((item, idx) => (
                <div key={idx} className="text-sm text-black mb-1">{item.label || item.name}: {item.value}</div>
              )) : <div className="text-gray-400">No land info</div>}
            </div>
          </div>

          {/* Description */}
          <div className="p-6 w-full bg-white rounded-xl shadow mt-6">
            <h3 className="font-semibold text-orange-600 mb-2">Description</h3>
            <p className="text-black text-[14px] font-light">{property.description}</p>
          </div>

          {/* Map */}
          {property.mapLink && (
            <div className="p-6 w-full bg-white rounded-xl shadow mt-6">
              <h3 className="font-semibold text-orange-600 mb-2">Location Map</h3>
              <div className="w-full h-[300px] rounded-lg overflow-hidden">
                <iframe 
                  src={property.mapLink} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full mt-8">
            <Button
              text={"See More Details"}
              white
              onClick={() => gotoPage(`/properties/${id}/details`)}
            />
            <Button
              text={"Schedule Visit"}
              onClick={() => {
                setTemp(property);
                gotoPage("/schedule/create", true);
              }}
            />
          </div>

          {/* Other Sub-Properties */}
          <div className="w-full mt-10 flex flex-col">
            <PropertyHeader text={"Other Sub-Properties"} noExternal />
            <div className="flex flex-row w-full overflow-x-auto gap-4 py-2">
              {otherSubProperties.length === 0 ? (
                <div className="flex flex-col w-full mt-[5%] justify-center items-center self-center">
                  <h2 className="flex flex-col items-center justify-center text-[13px] text-grey-800">No Sub-properties found!</h2>
                </div>
              ) : (
                otherSubProperties.map((item, index) => (
                  <PropertyCard2
                    item={item}
                    onClick={() => gotoPage(`/properties/${item.sid}/sub-property`)}
                    key={index}
                    index={index}
                    sold={false}
                  />
                ))
              )}
            </div>
          </div>

          <ShareModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </>
      )}
    </div>
  );
}

export default PropertiesView;
