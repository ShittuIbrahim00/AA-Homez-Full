import {createContext, useState} from "react";


// @ts-ignore
export const SchedulerContext = createContext();

export const SchedulerProvider = (props) => {

    // const [hotScheduler, setHotScheduler] = useState<any>([]);
    // const [subScheduler, setSubScheduler] = useState<any>([]);
    // const [fullProperties, setFullProperties] = useState<any>([]);
    const [temp, setTemp] = useState<any>(null);

    return (
        <SchedulerContext.Provider
            value={[temp, setTemp]}
        >
            {props.children}
        </SchedulerContext.Provider>
    )
}
