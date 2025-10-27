import React, {useContext, useState} from 'react';
import Image from "next/image";
import {Button, Input} from "@/components/Custom";
import {Footer} from "@/components/auth";
import {useRouter} from "next/router";
import {UserContext} from "@/context/user";

const initialFormData = {
    email: "",
};
function ForgotPassword(props) {

    //variables
    const router = useRouter();


    //states
    // @ts-ignore
    const [user, setUser] = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
    });

    const [formData, setFormData] = useState(initialFormData);

    //functions

    /**
     *
     * @param val
     * @private
     */
    const _setEmail = (val) => {
        setData("email", val);
        const regx = /^([a-zA-Z0-9_.\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9\s]{2,4})+$/;
        // const regx = /.+@.+\.[A-Za-z]+$/

        if(val.length <= 0){
            setErrors(prevState => prevState = {...prevState, email: "Email Address is required."})
        } else if(regx.test(`${val}`) === false) {
            setErrors(prevState => prevState = {...prevState, email: "Email Address is not valid."})
        } else {
            setErrors(prevState => prevState = {...prevState, email: ""})
        }
    };

    /**
     *
     * @param {string} location
     * @param {string} value
     */
    const setData = (location, value) => {
        let data = formData;
        data[location] = value;
        // console.log({data});
        setFormData(data);
    };

    const gotoRoute = (path) => {
        router.push({
            pathname: path
        },undefined, {shallow: true});
    };

    const _forgotPassword = () => {

    }

    return (
        <div className={`${styles.container}`}>

            <div className={"md:w-full w-[42%] h-[100hv] flex flex-col items-center justify-center"}>
                <div className={"w-[70%] py-8 px-10 shadow-lg bg-main-white flex flex-col"}>
                    <div className={"my-3 flex flex-col items-center justify-center"}>
                        <h2 className={"font-bold text-black text-[25px] mb-2"}>Forgot Password</h2>
                        <h2 className={"text-[#808080] text-[22px] font-light font-kanit"}>In the moment we live and build.</h2>
                    </div>
                    <div className={"mt-8"}>

                        <div className="mb-3 grid gap-1">
                            <label className={"text-black text-[12px]"}>Email Address</label>
                            <Input
                                placeholder="john@example.com"
                                type="email"
                                onChange={(e) =>
                                    _setEmail(e.target.value)
                                }
                            />

                            {errors.email && (
                                <small className="text-red-600 text-[12px]">{errors.email}</small>
                            )}
                        </div>

                    </div>

                    {/*Button SignIn*/}
                    <Button onClick={() => _forgotPassword()} loading={loading}>
                        Recover Password
                    </Button>

                    <div className={"my-6 w-full"}>
                        <div
                            className={"border-[1.5px] rounded-[5px] border-main-secondary w-full my-3 cursor-pointer " +
                                "p-3 flex items-center justify-center"
                            }
                            onClick={() => gotoRoute("/auth/signup")}
                        >
                            <h2 className={"text-[13px] text-main-secondary font-semibold"}>Register</h2>
                        </div>

                        <div
                            className={"w-full my-3 cursor-pointer p-3 flex items-center justify-center"}
                            onClick={() => gotoRoute("/auth/login")}
                        >
                            <h2 className={"text-[13px] text-black font-semibold"}>Sign in</h2>
                        </div>
                    </div>

                </div>
            </div>

            <Image
                src={require("../../../../public/images/high_build2.jpeg")}
                alt={"A&A"}
                className={"md:block w-full h-[100vh] bg-contain hidden"}
            />
        </div>
    );
}

export default ForgotPassword;


const styles = {
    container: "bg-white w-full h-[100vh] flex flex-row items-center",
}
