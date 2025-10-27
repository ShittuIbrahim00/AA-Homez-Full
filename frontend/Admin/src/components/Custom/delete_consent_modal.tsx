import React, { useState, useEffect, useRef } from 'react';
import {Button, GModal} from "@/components/Custom";
import Image from "next/image";


// export interface ModalData {
//     email: string;
//     frequency: string;
// }

interface ModalProps {
    isOpen: boolean;
    onSubmit: (val?: any) => void;
    onClose: () => void;
    text?: string;
}


const DelConsentModal: React.FC<ModalProps> = ({ onSubmit, isOpen, onClose, text }) => {

    // refs
    const focusInputRef = useRef<HTMLInputElement | null>(null);

    // states
    const [formState, setFormState] = useState<any>();


    useEffect(() => {
        if (isOpen && focusInputRef.current) {
            setTimeout(() => {
                focusInputRef.current!.focus();
            }, 0);
        }
        // console.log("LIVE ", isOpen);
    }, [isOpen]);


    return (
        <GModal
            hasCloseBtn={true}
            isOpen={isOpen}
            onClose={onClose}
            // containerStyle={}
        >
            <div className={"w-[30%] p-[30px] bg-main-white rounded-[15px] items-center flex flex-col"}>

                <Image
                    src={require("../../../public/icons/query.png")}
                    alt={"query"}
                    height={100}
                    width={100}
                    style={{marginBottom: 30,}}
                />

                <h1
                    className={"text-black font-bold text-[14px] my-[30px] text-center"}
                >
                    { text ?? "Are you sure you want to delete this image"}
                </h1>

              <div className={"flex flex-row items-center justify-between w-full"}>
  <Button
    className={"mx-[20px]"}
    variant="primary"  // or whichever variant you want
    onClick={() => onSubmit()}
  >
    Yes
  </Button>

  <Button
    className={"mx-[20px]"}
    variant="primary"
    onClick={() => onClose()}
  >
    No
  </Button>
</div>

            </div>
        </GModal>
    );
};

export default DelConsentModal;
