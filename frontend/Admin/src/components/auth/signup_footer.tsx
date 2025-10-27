import React from 'react';
import {styles} from "@/styles/styled_css";
import Image from "next/image";
import {useRouter} from "next/router";
import {useGoogleLogin} from "@react-oauth/google";

const facebook_img = require("../../../public/icons/logos_facebook.png");
const google_img = require("../../../public/icons/google.png");

function Footer(props) {

    const {type, user, setUser} = props;

    const router = useRouter();
    const gotoLogin = () => {
        router.push(
            {
                pathname: `/auth/login`,
            },
            undefined,
            { shallow: true },
        );
    }

    const _login = useGoogleLogin({
            onSuccess: (codeResponse) => {
              // console.log(codeResponse)
            },
            onError: (error) => {
              // console.log('Login Failed:', error)
            }
        });

    const gotoSignup = () => {
        router.push(
            {
                pathname: `/auth/signup`,
            },
            undefined,
            { shallow: true },
        );
    }

    return (
        <div className={"w-[100%] flex flex-col items-center justify-center mt-[15px]"}>
            {/*line or*/}
            <div className={`${styles.rowView} w-[100%] mb-[18px] self-center`}>
                <div className={"w-[50%] bg-black h-[0.6px]"} />
                <p className={"text-black text-[12px]"}>OR</p>
                <div className={"w-[50%] bg-black h-[0.6px]"} />
            </div>

            {
                type == "signup" ?

                    <div className={"w-[100%] flex flex-col items-center justify-center p-3"}>
                        <div
                            className={`${styles.rowView} mb-4 cursor-pointer`}
                            onClick={() => _login()}
                        >
                            <Image
                                src={google_img}
                                alt={"google"}
                                className={"w-[15px] h-[15px]"}
                            />
                            <h2 className={"text-black font-semibold ml-3 text-[13px]"}>
                                Register with Google
                            </h2>
                        </div>

                        <div className={`${styles.rowView} mb-4 cursor-pointer`}>
                            <Image
                                src={facebook_img}
                                alt={"facebook"}
                                className={"w-[15px] h-[15px]"}
                            />
                            <h2 className={"text-black font-semibold ml-3 text-[13px]"}>
                                Register with Facebook
                            </h2>
                        </div>

                        <div className={`${styles.rowView} mt-3 `}>
                            <h2 className={"text-black font-light text-[13px] mr-1"}>
                                Already have an account?
                            </h2>
                            <h2 className={"text-black font-bold text-[13px] cursor-pointer "} onClick={gotoLogin}>
                                Sign in
                            </h2>
                        </div>
                    </div>
                    :
                    <div className={"w-[100%] flex flex-col items-center justify-center p-3"}>
                        <div
                            className={`${styles.rowView} mb-4 cursor-pointer`}
                            onClick={() => _login()}
                        >
                            <Image
                                src={google_img}
                                alt={"google"}
                                className={"w-[15px] h-[15px]"}
                            />
                            <h2 className={"text-black font-semibold ml-3 text-[13px]"}>
                                Continue with Google
                            </h2>
                        </div>

                        <div className={`${styles.rowView} mb-3.5 cursor-pointer`}>
                            <Image
                                src={facebook_img}
                                alt={"facebook"}
                                className={"w-[15px] h-[15px]"}
                            />
                            <h2 className={"text-black font-semibold ml-3 text-[13px]"}>
                                Continue with Facebook
                            </h2>
                        </div>

                        <div className={`${styles.rowView} mt-3 `}>
                            <h2 className={"text-black font-light text-[13px] mr-1"}>
                                Didn't have an account?
                            </h2>
                            <h2 className={"text-black font-bold text-[13px] cursor-pointer "} onClick={gotoSignup}>
                                Register
                            </h2>
                        </div>
                    </div>
            }
        </div>
    );
}

export default Footer;
