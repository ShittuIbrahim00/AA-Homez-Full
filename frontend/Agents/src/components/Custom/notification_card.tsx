import React from 'react';

function NotificationCard(props) {

    const {image, text} = props;

    return (
        <div
            className={"w-full p-[15px] flex flex-row items-center justify-between bg-main-grey mb-[20px]"}
        >
            <h4 className={"text-black text-[13px] w-[60%]"}>
                Your Request for site visitation to Congo valley, Hamza Abdullahi Street has been Approved for 12th May 2023, 11:00 am - 10pm
            </h4>

            <div
                className={"cursor-pointer w-[10vw] p-[10px] flex flex-col items-center justify-center bg-main-secondary"}
            >
                <h2 className={"text-white font-bold text-[14px]"}>View</h2>
            </div>
        </div>
    );
}

export default NotificationCard;
