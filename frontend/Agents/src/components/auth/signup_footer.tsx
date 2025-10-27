import React from "react";
import { styles } from "@/styles/styled_css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useGoogleLogin } from "@react-oauth/google";

const facebook_img = require("../../../public/icons/logos_facebook.png");
const google_img = require("../../../public/icons/google.png");

// ✅ Define prop types
interface FooterProps {
  type?: "signup"; // only relevant when used on signup page
  user?: any;
  setUser?: (val: any) => void;
}

function Footer({ type, user, setUser }: FooterProps) {
  const router = useRouter();

  // Navigate to Login page
  const gotoLogin = () => {
    router.push("/auth/login", undefined, { shallow: true });
  };

  // Navigate to Signup page
  const gotoSignup = () => {
    router.push("/auth/signup", undefined, { shallow: true });
  };

  // Google OAuth login handler
  const _login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google login success:", tokenResponse);
      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const profile = await res.json();
        console.log("Google user profile:", profile);
        if (setUser) setUser(profile); // ✅ Only runs if setUser is passed
      } catch (err) {
        console.error("Failed to fetch Google user profile", err);
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
    },
  });

  const facebookLogin = () => {
    alert("Facebook login is not implemented yet.");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-[15px]">
      {/* OR separator line */}
      <div className={`${styles.rowView} w-full mb-[18px] self-center`}>
        <div className="w-1/2 bg-black h-[0.6px]" />
        <p className="text-black text-[12px] mx-2">OR</p>
        <div className="w-1/2 bg-black h-[0.6px]" />
      </div>

      {type === "signup" ? (
        <div className="w-full flex flex-col items-center justify-center p-3">
          {/* Link to Login page */}
          <div className={`${styles.rowView} mt-3`}>
            <h2 className="text-black font-light text-[13px] mr-1">
              Already have an account?
            </h2>
            <h2
              className="text-black font-bold text-[13px] cursor-pointer"
              onClick={gotoLogin}
            >
              Sign in
            </h2>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center p-3">
          {/* Link to Signup page */}
          <div className={`${styles.rowView} mt-3`}>
            <h2 className="text-black font-light text-[13px] mr-1">
              Don't have an account?
            </h2>
            <h2
              className="text-black font-bold text-[13px] cursor-pointer"
              onClick={gotoSignup}
            >
              Register
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default Footer;
