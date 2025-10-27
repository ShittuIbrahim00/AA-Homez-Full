import React from 'react';
import {Scheduler} from "@/components/schedule";
import {VisitationCard} from "@/components/Custom";

const Calendar = (props) => (
    <div style={styles.container}>
        <h1 className={"text-black my-[22px] text-[20px] font-bold"}>Calendar</h1>
        <div className={"w-[95%] self-center items-center"} >
            <Scheduler containerStyle={""} full />
        </div>

        <VisitationCard
            containerStyles={{width: "95%", alignSelf: "center", alignItems: "center"}}
        />

    </div>
);

export default Calendar;


const styles = {
    container: {
        width: "100%",
        padding: "20px",
        flex: 1
    }
}
