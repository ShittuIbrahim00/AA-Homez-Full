import React from 'react';
import Image from "next/image";
import {PropertyCard, PropertyCard2, PropertyHeader, ReferralCard} from "@/components/Custom";
import {HottestProperties, Properties, ReferralsData} from "../../../constants/data";
import {EarningsCard, EarningsRefCard, PortfolioCard, PortfolioRefCard} from "@/components/portfolio";
import {useRouter} from "next/router";

function SalesEarn(props) {

    const router = useRouter();
    const gotoReferral = () => {
        router.push(
            "/referral",
            undefined, {shallow: true}
        );
    }

    return (
        <div
            className={"w-full h-full bg-blue text-black px-[20px] flex flex-row "}
        >
            <div className={"w-[95%] overflow-y-scroll"}>

               <div className={"flex flex-row items-center justify-evenly w-full"}>
                    <EarningsRefCard earn />
                    <PortfolioRefCard earn/>
               </div>

                {/*Sold Properties*/}
                <div className={"my-[35px]"}>
                    {/*Header*/}
                    <PropertyHeader text={"Properties Sold"} onClick={() => console.log("Properties...")} search/>

                    {/*Properties body*/}
                    <div className={"w-full flex flex-row flex-wrap mb-[50px]"}>
                        {
                            Properties.map((item, index) => (
                                <PropertyCard2
                                    item={item} index={index}
                                    key={index} sold={true}
                                    onClick={() => console.log("other... ")}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>

            {/*Referrals*/}
            {/*<div className={"w-[35%] flex flex-col overflow-y-scroll"}>*/}
            {/*    /!*Header*!/*/}
            {/*    <PropertyHeader text={"Referrals"} onClick={() => console.log("Referrals...")}/>*/}
            {/*    {*/}
            {/*        ReferralsData.map((item, index) => (*/}
            {/*            <ReferralCard item={item} index={index} key={index.toString()} onclick={() => gotoReferral()} />*/}
            {/*        ))*/}
            {/*    }*/}

            {/*</div>*/}

        </div>
    );
}

export default SalesEarn;
