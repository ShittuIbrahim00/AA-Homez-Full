import React, {useState, useRef, Fragment, useEffect, useContext} from 'react';
import Image from "next/image";
import {Button, Dropdown, Input, Map, PropertyCard, PropertyCard2, PropertyHeader, Tooltip} from "@/components/Custom";
import {HottestProperties, Properties, PropertyImages} from "../../../../constants/data";
import {useRouter} from "next/router";
import { Dialog, Transition } from '@headlessui/react'
import {ShareModal} from "@/components/modal";
import {_getProperty, _getSubProperty} from "@/hooks/property.hooks";
import {PropertyContext} from "@/context/property";
import {SchedulerContext} from "@/context/scheduler";
import {FaChevronLeft, FaChevronRight, FaImage, FaPlus, FaTrash} from "react-icons/fa";
import {FaRotateLeft, FaRotateRight} from "react-icons/fa6";

function EditProperty(props) {

    const router = useRouter();
    const {id} = router.query;
    const house1 = require("../../../../../public/images/house2.png");

    const tags = [
        {
            id: 1,
            name: "For Sale",
            value: "forSale",
        },
        {
            id: 2,
            name: "Sold",
            value: "sold",
        },
    ];

    const FormatImage = [
        {
            id: 1,
            name: "replace",
            icon: (() => <FaImage color={"#fff"} size={20} />)
        },
        {
            id: 2,
            name: "rotate 90 degree",
            icon: (() => <FaRotateLeft color={"#fff"} size={20} />)
        },
        {
            id: 3,
            name: "rotate -90 degree",
            icon: (() => <FaRotateRight color={"#fff"} size={20} />)
        },
        {
            id: 4,
            name: "delete",
            icon: (() => <FaTrash color={"#fff"} size={20} />)
        },
    ]

    // refs
    const imgInputRef = useRef<any>(null);



    // context
    // @ts-ignore
    const [hot, setHot, sub, setSub, full, setFull, tempProp, setTempProp] = useContext(PropertyContext);
    // @ts-ignore
    const [temp, setTemp] = useContext(SchedulerContext);

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [property, setProperty] = useState<any>(null);

    const [images, setImages] = useState<any>([]);
    const [selectedImage, setSelImage] = useState<any>({id: 0, icon: null});
    const [pName, setPName] = useState("Congo Valley");
    const [tag, setTag] = useState<string | null>(null);
    const [desc, setDesc] = useState("Congo Valley Apartments is a Hamza Abdullahi street Asokoro, Abuja Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate Hamza Abdullahi street Asokoro, Abuja");
    const [address, setAddress] = useState("Congo Valley");
    const [startPrice, setStartPrice] = useState("N172m");
    const [endPrice, setEndPrice] = useState("N210m");
    // const [images, setImages] = useState([]);

    // functions

    const onPickImg = () => {

    }

    const showImgPicker = () => {
        imgInputRef?.current.click();
    };

    const handleImgChange = (event) => {
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {

            console.log({file});
            // const obj = {
            //     uri: res.assets[0].uri,
            //     type: "image/png",
            //     name: "Profile_image"
            // };

            const reader = new FileReader();

            reader.onloadend = () => {
                // Do something with the selected image (e.g., display it)
                // setImage(reader?.result);
                console.log("reader: ", reader, {file})
            };

            reader.readAsDataURL(file);

        } else {
            // Handle the case where a non-image file is selected
            alert('Please select a valid image file.');
        }
    };

    const gotoPage = (value: string, query: boolean = false) => {
        if(query){
            router.push(
                {pathname: value,
                    query:{
                        live: true
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


    const data = [
        {
            id: 1,
            name: "6 . Bedrooms",
        },
        {
            id: 2,
            name: "2 . Guest rooms",
        },
        {
            id: 3,
            name: "Garden",
        },
        {
            id: 4,
            name: "50 x 50 Sqms",
        },
        {
            id: 5,
            name: "3 . Pay",
        },
        {
            id: 6,
            name: "1 . Store",
        },
        {
            id: 7,
            name: "1 . Kitchen",
        },
    ];

    const _constructor = async () => {
        console.log({id});

        setLoading(true);
        const data = await _getProperty(id);

        if(data !== false){
            setProperty(data);
            setPName(data?.name);
            setAddress(data?.location);
            setStartPrice(data?.startPrice ?? "0");
            setEndPrice(data?.endPrice ?? "0");
            setDesc(data?.description);
            setImages(data?.images);
            setSelImage({icon: data?.images[0], index: 0})
        }
        // set

        console.log({data});
        setLoading(false);


    };

    const onImgLeft = () => {
        if(selectedImage){
            const index = selectedImage?.id
            if(index !== 0){
                setSelImage({icon: property?.images[index - 1], id: selectedImage?.id - 1})
            }
        } else {
            setSelImage({icon: property?.images[0], id: 0})
        }
    }

    const onImgRight = () => {
        if(selectedImage){
            const index = selectedImage?.id
            if(index !== (property?.images.length - 1)){
                setSelImage({icon: property?.images[index + 1], id: selectedImage?.id + 1})
            }
        } else {
            setSelImage({icon: property?.images[0], id: 0})
        }
    }

    const _setSelImage = (icon, id) => {
        setSelImage({icon, id});
    }

    useEffect(() => {
        _constructor();
    }, []);

    return (
        <div className={"w-full h-full text-black px-[30px] flex flex-col max-w-[90vw] mb-10 pb-[20px] overscroll-none"}>
            {
                loading ?
                    <div className={"w-[150px] h-[100px] mt-[30%] flex self-center animate-bounce"}>
                        <Image src={require("../../../../../public/icons/logo.png")} alt={"logo"} />
                    </div>
                    :
                // !property ?
                //     <div>
                //         <h2>Could not find property.</h2>
                //     </div>
                //     :
                    <div
                        className={"w-full flex flex-row items-start justify-between overscroll-none"}
                    >
                        <div className={"w-[70%] p-[20px] flex flex-col overflow-y-scroll"}>

                            <h1
                                className={"my-[30px] text-black font-semibold text-[22px]"}
                            >
                                {property?.name}
                            </h1>

                            <div
                                className={"w-full h-[580px] justify-center flex rounded-[20px] relative"}
                            >
                                <Image
                                    src={selectedImage?.icon ?? house1} alt={"house"}
                                    width={200}
                                    height={300}
                                    className={"w-full h-full rounded-[20px]"}
                                />

                                <div
                                    className={
                                        "flex flex-row self-center items-center justify-between z-20 absolute bg-transparent w-[100%] py-[20px] " +
                                        "px-[30px]"
                                    }
                                >
                                    <div
                                        style={{padding: 20, backgroundColor: "rgba(0, 0, 0, 0.32)", borderRadius: 10, alignItems: "center", justifyItems: "center"}}
                                        className={"cursor-pointer"}
                                        onClick={() => onImgLeft()}
                                    >
                                        <FaChevronLeft size={15} color={"white"} />
                                    </div>


                                    <div
                                        style={{padding: 20, backgroundColor: "rgba(0, 0, 0, 0.32)", borderRadius: 10, alignItems: "center", justifyItems: "center"}}
                                        className={"cursor-pointer"}
                                        onClick={() => onImgRight()}
                                    >
                                        <FaChevronRight size={15} color={"white"} />
                                    </div>

                                    {/*<Image*/}
                                    {/*    src={require("../../../../../public/svg/share.svg")} alt={"share button"}*/}
                                    {/*    className={"w-[25px] h-[25px] mr-[10px] cursor-pointer"}*/}
                                    {/*    onClick={() => setModalOpen(true)}*/}
                                    {/*/>*/}

                                </div>


                                <div
                                    className={
                                        "flex flex-row bottom-[20px] items-center justify-center z-20 absolute bg-[#E9E9E9] w-[100%] p-[25px] overflow-x-scroll " +
                                        ""
                                    }
                                >
                                    {
                                        property?.images.map((item, index) => (
                                            <div
                                                className={"w-[85px] h-[85px] rounded-[10px] mx-[10px] cursor-pointer"}
                                                style={index === selectedImage?.id ? {borderWidth: 3, borderColor: "#E14B0F" } : {}}
                                                onClick={() => _setSelImage(item, index)}
                                            >
                                                <Image
                                                    src={item}
                                                    alt={"house"}
                                                    width={85}
                                                    height={85}
                                                    className={"object-cover w-full h-full rounded-[8px]"}
                                                />
                                            </div>
                                        ))
                                    }

                                </div>
                            </div>

                            <div
                                className={"w-full p-[20px] flex flex-col"}
                            >
                                <div
                                    className={"w-full flex flex-row items-start justify-between"}
                                >
                                    <div className={"w-[76%] "}>

                                        <div className={"flex flex-col w-full mb-[15px]"}>
                                            <h2 className={"font-light text-black text-[13px] my-[8px]"}>Property name</h2>
                                            <Input type={"default"} 
                                                   placeholder={"Haven Apartment"} 
                                                   className={"w-full bg-main-grey"}
                                                   value={pName}
                                                   onChange={(e) => setPName(e.target.value)}
                                            />
                                        </div>

                                        <div
                                            className={"flex flex-row w-full items-center justify-between"}
                                        >
                                            <div className={"flex flex-col w-[40%] mb-[15px]"}>
                                                <h2 className={"font-light text-black text-[13px] my-[8px]"}>Price Range Start</h2>
                                                <Input type={"default"}
                                                       placeholder={"Congo Valley"}
                                                       className={"w-full bg-main-grey"}
                                                       value={startPrice}
                                                       onChange={(e) => setStartPrice(e.target.value)}
                                                />
                                                <h2 className={"font-light text-black text-[9px] my-[8px]"}>Least sub-property amount</h2>

                                            </div>

                                            <div className={"flex flex-col w-[40%] mb-[15px]"}>
                                                <h2 className={"font-light text-black text-[13px] my-[8px]"}>Price Range End</h2>
                                                <Input type={"default"}
                                                       placeholder={"Congo Valley"}
                                                       className={"w-full bg-main-grey"}
                                                       value={endPrice}
                                                       onChange={(e) => setEndPrice(e.target.value)}
                                                />
                                                <h2 className={"font-light text-black text-[9px] my-[8px]"}>Highest sub-property amount</h2>

                                            </div>
                                        </div>

                                        <div className={"flex flex-col w-full mb-[15px]"}>
                                            <h2 className={"font-light text-black text-[13px] my-[8px]"}>Address</h2>
                                            <Input type={"default"}
                                                   placeholder={"Congo Valley"}
                                                   className={"w-full bg-main-grey"}
                                                   value={address}
                                                   onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </div>

                                        <div className={"flex flex-col w-full mb-[15px]"}>
                                            <h2 className={"font-light text-black text-[13px] my-[8px]"}>Property description </h2>
                                            <Input type={"default"}
                                                   placeholder={"Congo Valley"}
                                                   className={"w-full bg-main-grey"}
                                                   value={desc}
                                                   onChange={(e) => setDesc(e.target.value)}
                                            />
                                        </div>

                                    </div>

                                    <div className={"w-[28%] pt-[50px]"}>
                                        <Dropdown
                                            data={tags}
                                            placeholder={"Select Tag"}
                                            onChange={(e) => {
                                                // console.log("time: ", e.target.value)
                                                setTag(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>



                            <div className={"flex flex-col items-center justify-center w-[100%] self-center mb-[40px] cursor-pointer"}>
                                <Button
                                    text={"Save Property"}
                                    onClick={() => {
                                        // setTempProp(property);
                                        gotoPage(`/properties/${id}/edit`);
                                    }}
                                />
                            </div>

                            {/*<div*/}
                            {/*    className={"w-full mt-[20px] flex flex-col"}*/}
                            {/*>*/}
                            {/*    <PropertyHeader text={"Other Sub-Properties"} noExternal />*/}
                            {/*    <div*/}
                            {/*        className={"flex flex-row w-full overflow-hidden overflow-x-scroll"}*/}
                            {/*    >*/}
                                    {/*checkout*/}
                                    {/*{*/}
                                    {/*    property.SubProperties?.length == 0 ?*/}
                                    {/*        <div className={"flex flex-col w-full mt-[5%] justify-center items-center self-center"}>*/}
                                    {/*            <h2 className={"flex flex-col items-center justify-center text-[13px] text-grey-800"}>No Sub-properties found!</h2>*/}
                                    {/*        </div>*/}
                                    {/*        :*/}
                                    {/*    property.SubProperties.map((item, index) => (*/}
                                    {/*        <PropertyCard2*/}
                                    {/*            item={item} onClick={() => gotoPage(`/properties/${item.pid}/sub-property`)}*/}
                                    {/*            key={index} index={index} sold={false}*/}
                                    {/*        />*/}
                                    {/*    ))*/}
                                    {/*}*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*<div className={"flex flex-col items-center justify-center w-[50%] self-center mb-[10px] bottom-[50px]"}>*/}
                            {/*    <div className={"py-[30px]"}>*/}

                            {/*    </div>*/}
                            {/*</div>*/}

                        </div>

                        <div
                            className={"flex flex-col w-[28%] overflow-y-scroll"}
                        >
                            <h1
                                className={"my-[30px] text-black font-semibold text-[22px]"}
                            >
                                Sub-Properties
                            </h1>

                            <div className={"w-full flex flex-row flex-wrap lg:justify-start justify-evenly mb-[30px] "}>
                                {
                                    property?.SubProperties?.length == 0 ?
                                        <div className={"w-[95%] mt-[30px] mb-[30px] flex items-center justify-center"}>
                                            <h2 className={"font-medium text-[13px] text-gray-800"}>No sub properties found!</h2>
                                        </div>
                                        :
                                    property?.SubProperties.map((item, index) => (
                                        <PropertyCard
                                            item={item} index={index}
                                            key={index}
                                            // onClick={() => gotoView(item)}
                                            details={false} visitation={false} sold={false}
                                            containerStyle={{width: "100%"}}
                                        />
                                    ))
                                }
                            </div>

                            <Button
                                text={"Add Sub-Property"}
                                white
                                containerStyle={{width: "80%", marginBottom: 30, alignSelf: "center"}}
                                onClick={() => gotoPage(`/properties/${id}/sub-property/add`)}
                            />

                        </div>

                    </div>
            }
        </div>
    );
}

export default EditProperty;
