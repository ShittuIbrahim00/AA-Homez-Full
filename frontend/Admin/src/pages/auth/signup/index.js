import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Input, Button } from "../../../components/Custom";
import { PasswordMust, Footer } from "../../../components/auth";
import { useRouter } from "next/router";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import authServices from "../../../services/auth.services";
import { UserContext } from "../../../context/user";
import { SignupHandler } from "../../../utils/api";

const initialFormData = {
  fname: "",
  email: "",
  ref_code: "",
  password: "",
};
function Signup(props) {
  useEffect(() => {
    _setPassword("");
  }, []);

  //Context
  const [user, setUser] = useContext(UserContext);

  const router = useRouter();

  //State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    fname: "",
    email: "",
    ref_code: "",
    password: "",
  });
  const [formData, setFormData] = useState(initialFormData);

  const gotoLogin = () => {
    router.push(
      {
        pathname: `/auth/login`,
      },
      undefined,
      { shallow: true }
    );
  };

  const gotoHome = () => {
    router.replace(
      {
        pathname: "/home",
      },
      undefined,
      { shallow: true }
    );
  };

  const _registerAgent = async () => {
    // gotoHome();
    try {
      if (
        errors.fname.length <= 0 &&
        errors.email.length <= 0 &&
        errors.password.length <= 0
      ) {
        // console.log({formData});
        setLoading(true);

        const payload = {
          email: formData.email,
          // firstName: formData.fname.split(" ")?.[0],
          // lastName: formData.fname.split(" ")?.[1],
          fullName: formData.fname,
          code: formData.ref_code,
          password: formData.password,
        };
        console.log({ payload });

        const res = await SignupHandler(payload);
        console.log({ res });
        if (res.status == false) {
          toast.error(res.message);
          setLoading(false);
        } else {
          setUser(res.data);
          localStorage.setItem("$token_key", res.data.token);
          gotoHome();
          setLoading(false);
        }
        setLoading(false);
      } else {
        toast.error("Please fill required fields!");
        console.log({ errors });
        _setFname(formData.fname);
        _setPassword(formData.password);
        setEmail(formData.email);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.log("Error message: ", e.message, " .on._registerAgent");
      toast.error("Something went wrong!");
    }
  };

  /**
   *
   * @param val
   */
  const setEmail = (val) => {
    setData("email", val);
    const regx =
      /^([a-zA-Z0-9_.\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9\s]{2,4})+$/;
    // const regx = /.+@.+\.[A-Za-z]+$/

    if (val.length <= 0) {
      setErrors(
        (prevState) =>
          (prevState = { ...prevState, email: "Email Address is required." })
      );
    } else if (regx.test(`${val}`) === false) {
      setErrors(
        (prevState) =>
          (prevState = { ...prevState, email: "Email Address is not valid." })
      );
    } else {
      setErrors((prevState) => (prevState = { ...prevState, email: "" }));
    }
  };

  /**
   *
   * @param {string} val
   * @private
   */
  const _setFname = (val) => {
    setData("fname", val);

    let data = val.split(" ")[1];

    console.log({ data });

    if (val.length <= 0) {
      setErrors(
        (prevState) =>
          (prevState = { ...prevState, fname: "Full name is required." })
      );
    } else if (!data) {
      setErrors(
        (prevState) =>
          (prevState = { ...prevState, fname: "Full name is not valid." })
      );
    } else {
      setErrors((prevState) => (prevState = { ...prevState, fname: "" }));
    }
  };

  /**
   *
   * @param val
   * @private
   */
  const _setPassword = (val) => {
    setData("password", val);

    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const defNumbers = /[0-9]/;

    // console.log(upperCase.test(val) === true);

    if (val.length < 8 || val.length > 12) {
      setErrors(
        (prevState) =>
          (prevState = {
            ...prevState,
            password:
              "Should be a minimum of 8 characters and maximum of 12 characters",
          })
      );
    } else if (!upperCase.test(val)) {
      setErrors(
        (prevState) =>
          (prevState = {
            ...prevState,
            password: "Include at least one uppercase letter",
          })
      );
    } else if (!lowerCase.test(val)) {
      setErrors(
        (prevState) =>
          (prevState = {
            ...prevState,
            password: "Include at least one lowercase letter",
          })
      );
    } else if (!defNumbers.test(val)) {
      setErrors(
        (prevState) =>
          (prevState = {
            ...prevState,
            password: "Include at least one number",
          })
      );
    } else {
      setErrors((prevState) => (prevState = { ...prevState, password: "" }));
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

  return (
    <div className={`${styles.container}`}>
      <Image
        src={require("../../../../public/images/building1.jpg")}
        alt={"A&A"}
        className={"md:block w-[42%] h-[100vh] bg-contain hidden"}
      />

      <div
        className={"w-full h-[100hv] flex flex-col items-center justify-center"}
      >
        <div
          className={"self-start mt-[8%] ml-[3%] cursor-pointer"}
          onClick={gotoHome}
        >
          <Image
            src={require("../../../../public/icons/logo.png")}
            alt={"logo"}
            className={"w-[80px] h-[50px] bg-contain self-start"}
          />
        </div>

        <div className={"w-[70%] py-8 px-10 shadow-lg bg-main-white"}>
          <div className={"my-3 flex flex-col items-center justify-center"}>
            <h2 className={"font-bold text-black text-[25px] mb-2"}>
              Create an account
            </h2>
            <h2 className={"text-[#808080] text-[15px] font-medium"}>
              In the moment we live and build.
            </h2>
          </div>
          <div className={"mt-8"}>
            <div className="mb-3 grid gap-1">
              <label className={"text-black text-[12px]"}>Full name</label>
              <Input
                placeholder="John Doe"
                type="text"
                onChange={(e) => _setFname(e.target.value)}
              />

              {errors.fname && (
                <small className="text-red-600 text-[12px]">
                  {errors.fname}
                </small>
              )}
            </div>

            <div className="mb-3 grid gap-1">
              <label className={"text-black text-[12px]"}>Email Address</label>
              <Input
                placeholder="john@example.com"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />

              {errors.email && (
                <small className="text-red-600 text-[12px]">
                  {errors.email}
                </small>
              )}
            </div>

            <div className="mb-3 grid gap-1">
              <label className={"text-black text-[12px]"}>
                Referral Code(if applicable)
              </label>
              <Input
                placeholder="87r686bd7fg8rbf"
                type="text"
                onChange={(e) =>
                  setFormData({ ...formData, ref_code: e.target.value })
                }
              />

              {errors.ref_code && (
                <small className="text-red-600 text-[12px]">
                  {errors.ref_code}
                </small>
              )}
            </div>

            <div className="mb-3 grid gap-1">
              <label className={"text-black text-[12px]"}>Password</label>
              <Input
                placeholder="***********"
                type="password"
                onChange={(e) => _setPassword(e.target.value)}
                // className={"text"}
              />

              {/*{errors.password && (*/}
              {/*    <small className="text-red-600 text-[12px]">{errors.password}</small>*/}
              {/*)}*/}
            </div>
          </div>

          <div className={"mt-8 mb-8"}>
            <h2 className={"text-black text-[12px] font-semibold"}>
              Password must:
            </h2>
            <div className={"mt-6"}>
              <PasswordMust
                text={
                  "Be a minimum of 8 characters and maximum of 12 characters"
                }
                status={
                  (errors.password !=
                    "Should be a minimum of 8 characters and maximum of 12 characters" &&
                    errors.password.length <= 0) ||
                  (formData.password.length >= 8 &&
                    formData.password.length <= 12)
                }
              />
              <PasswordMust
                text={"Include at least one uppercase letter"}
                status={
                  (errors.password != "Include at least one uppercase letter" &&
                    errors.password.length <= 0) ||
                  /[A-Z]/.test(formData.password)
                }
              />
              <PasswordMust
                text={"Include at least one lowercase letter"}
                status={
                  (errors.password != "Include at least one lowercase letter" &&
                    errors.password.length <= 0) ||
                  /[a-z]/.test(formData.password)
                }
              />
              <PasswordMust
                text={"Include at least one number"}
                status={
                  (errors.password != "Include at least one number" &&
                    errors.password.length <= 0) ||
                  /[0-9]/.test(formData.password)
                }
              />
            </div>
          </div>

          <Button
            text={"Register"}
            onClick={() => _registerAgent()}
            loading={loading}
          />

          {/*Footer*/}
          <Footer type={"signup"} />
        </div>
      </div>
    </div>
  );
}

export default Signup;

const styles = {
  container: "bg-white w-full h-[100vh] flex flex-row-reverse items-center",
};
