import React, {Fragment, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import Image from "next/image";
import {shareData} from "../../constants/data";

const ShareModal = (props) => {

    const {modalOpen, setModalOpen} = props;

    const [visible, setVisible] = useState(false);

    const _onShare = (item) => {
        console.log({item})
    }

    return (
        <div>
            <Transition
                show={modalOpen} as={Fragment}
                // afterEnter={() => videoRef.current?.play()}
            >
                <Dialog onClose={() => setModalOpen(false)}>

                    {/* Modal backdrop */}
                    <Transition.Child
                        className="fixed inset-0 z-modal bg-black bg-opacity-50 transition-opacity"
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-out duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        aria-hidden="true"
                    />
                    {/* End: Modal backdrop */}

                    {/* Modal dialog */}
                    <Transition.Child
                        className="fixed inset-0 z-modal flex p-6"
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 scale-75"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-out duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-75"
                    >
                        <div className="max-w-2xl mx-auto flex items-center justify-center w-full bottom-[0px]">
                            <Dialog.Panel
                                className={"w-full rounded-3xl shadow-2xl aspect-video bg-white overflow-hidden flex flex-row items-center justify-center flex-wrap p-[40px]"}
                            >
                                {
                                    shareData.map((item, index) => (
                                        <div
                                            className={"flex flex-col items-center w-[22%] mx-[20px] mb-[20px] mt-[8px] cursor-pointer"}
                                            key={index}
                                            onClick={() => _onShare(item)}
                                        >
                                            <Image
                                                src={item.icon}
                                                alt={"villa"}
                                                className={"w-[28px] h-[28px] mb-[3px]"}
                                            />

                                            <h2 className={"text-[12px] text-black font-semibold"}>{item.name}</h2>
                                        </div>
                                    ))
                                }
                            </Dialog.Panel>
                        </div>
                    </Transition.Child>
                    {/* End: Modal dialog */}

                </Dialog>
            </Transition>
        </div>
    );
};

export default ShareModal;