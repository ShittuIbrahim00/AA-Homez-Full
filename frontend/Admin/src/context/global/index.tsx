import {createContext, useState} from "react";


// @ts-ignore
export const GlobalContext = createContext();

export const GlobalProvider = (props) => {

    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <GlobalContext.Provider value={[data, setData, loading, setLoading]}>
            {props.children}
        </GlobalContext.Provider>
    )
}
