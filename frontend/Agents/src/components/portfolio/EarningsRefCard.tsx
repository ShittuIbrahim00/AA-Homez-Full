import React from 'react';

function EarningsRefCard(props) {

    const {styles, earn} = props;

    return (
        <div
            className={
                `w-[600px] h-[300px] my-[20px] px-[50px] rounded-[30px] bg-gradient-to-r from-main-primary to-main-secondary `+
                `p-[20px] items-center justify-between flex flex-row ${styles}`
            }
        >
            <div className={"flex flex-col"}>
                <div className={"my-[25px]"}>
                    <h2 className={"font-semibold text-white text-[25px] mb-[5px]"}>23</h2>
                    <p className={"font-light text-white text-[13px]"}>{ earn ? "Direct Sales" : "Direct Referrals"}</p>
                </div>

                <div className={"my-[25px]"}>
                    <h2 className={"font-semibold text-white text-[25px] mb-[5px]"}>N12,345,000</h2>
                    <p className={"font-light text-white text-[13px]"}>{earn && "Sales"} Earnings</p>
                </div>

            </div>

            <div className={"flex flex-col "}>
                <div className={"my-[25px]"}>
                    <h2 className={"font-semibold text-white text-[25px] mb-[5px]"}>43</h2>
                    <p className={"font-light text-white text-[13px]"}>Indirect {earn ? "Sales" : "Referrals"}</p>
                </div>

                <div className={"my-[25px]"}>
                    <h2 className={"font-semibold text-white text-[25px] mb-[5px]"}>N345,000</h2>
                    <p className={"font-light text-white text-[13px]"}>{earn && "Sales"} Earnings</p>
                </div>
            </div>
        </div>
    );
}

export default EarningsRefCard;
