import {createContext, useState} from "react";


// @ts-ignore
export const PropertyContext = createContext();

export const PropertyProvider = (props) => {

    const [hotProperty, setHotProperty] = useState<any>([]);
    const [subProperty, setSubProperty] = useState<any>([]);
    const [fullProperties, setFullProperties] = useState<any>([]);
    const [tempProp, setTempProp] = useState<any>(null);

    return (
        <PropertyContext.Provider
            value={[hotProperty, setHotProperty, subProperty, setSubProperty, fullProperties, setFullProperties, tempProp, setTempProp]}
        >
            {props.children}
        </PropertyContext.Provider>
    )
}
