import React, {useEffect, useRef, useState} from "react";
import {useOnClickOutside} from "@/components/Custom/index";



interface ModalProps {
    isOpen: boolean;
    hasCloseBtn?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    containerStyle?: any;
};

const GModal: React.FC<ModalProps> = ({isOpen, hasCloseBtn, onClose, children, containerStyle}) => {


    const modalRef = useRef<HTMLDialogElement | null>(null);
    const [isModalOpen, setModalOpen] = useState(isOpen);


    // functions
    const handleCloseModal = () => {
        if (onClose) {
            onClose();
        }
        modalRef.current?.close()
        setModalOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
        if (event.key === "Escape") {
            handleCloseModal();
            // console.log("Closing...")
        }
    };


    const ref = useRef();
    useOnClickOutside(ref, onClose);


    useEffect(() => {
        setModalOpen(isOpen);
    }, [isOpen]);


    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement) {
            if (isModalOpen) {
                modalElement.showModal();
            } else {
                modalElement.close();
            }
        }
    }, [isModalOpen]);


    return (
        <dialog
            // ref={modalRef}
            className={`modal fixed z-[1020] backdrop-blur-sm self-center w-[100%] h-full top-0 left-0 bottom-0 bg-[#747474]/[0.1] backdrop-brightness-30 items-center justify-center flex flex-col ${containerStyle}`}
            onKeyDown={handleKeyDown}
        >
            {children}
        </dialog>
    );
}

export default GModal;
