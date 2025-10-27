import React from 'react';
import {CircularProgress} from "@mui/material";
import Spinner from "@/pages/notifications/Spinner";

function Button(props) {

    const {text, style, textStyle, onClick, loading, white} = props;

    return (
        <div
            className={
               white ? `${styles.containerWhite} ${style} ` :
                   `${styles.container} ${style}`
            }
            onClick={() => onClick?.()}
        >
            {
                loading === true ?
                    <div className="flex items-center justify-center">
                        <Spinner className="h-5 w-5 text-white" />
                    </div>
                    :
                    <h2 className={ `font-bold text-[13px] ${white ? "text-main-secondary" : "text-white"} ${textStyle}`}>{text}</h2>
            }
        </div>
    );
}

const styles = {
    container: "w-[100%] p-3 flex items-center justify-center text-main-primary bg-gradient-to-r from-main-primary to-main-secondary " +
        ` rounded-[6px] cursor-pointer`,
    containerWhite: "w-[100%] p-3 flex items-center justify-center text-main-primary bg-white " +
        ` rounded-[6px] cursor-pointer border-main-secondary border-[2px]`
}

export default Button;