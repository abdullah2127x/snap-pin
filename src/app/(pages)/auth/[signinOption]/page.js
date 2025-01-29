"use client";
import Signin from "@/components/Signin";
import Signup from "@/components/Signup";
import Image from "next/image";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import ForgetPassword from "@/components/ForgetPassword";
import GetCode from "@/components/GetCode";
import ResetPassword from "@/components/ResetPassword";

const SigninOption = () => {
  const params = useParams();
  const router = useRouter();
  const signinOption = params.signinOption;
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1  space-y-8 md:space-y-0  md:min-h-screen  md:pb-0">
      {/* left section */}
      <section className="grid-cols-1 relative  hidden lg:block">
        <Image
          // src="/signOptionBg.jpg"
          src="/authbg.png"
          alt="Background image"
          className="bg-transparent"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </section>

      {/* right section */}
      <section className=" grid-cols-1  flex items-center justify-center px-8 ">


        {signinOption === "signin" || signinOption === "login" ? (
          <Signin />
        ) : signinOption === "signup" ? (
          <Signup />
        ) : signinOption === "forget" ? (
          <ForgetPassword />
        ) : signinOption === "code" ? (
          <GetCode />
        )  : signinOption === "reset" ? (
          <ResetPassword />
        )  : (
          router.push("/")
        )}
      </section>
    </div>
  );
};

export default SigninOption;
