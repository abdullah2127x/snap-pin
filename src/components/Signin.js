"use client";
import React, { useState,useTransition } from "react";
import Form from "./Form";
import { handleSignin } from "@/actions/auth/handlers/handleSignin";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const Signin = () => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [isPending, startTransition] = useTransition();
  const handleFormSubmit = async (formData) => {
    startTransition(async () => {
    const { email, password } = formData;
    let response = await handleSignin({ ...formData, provider: "credentials" });

    if (response) {
      if (response.success) {
        //
        const isSignin = await signIn("credentials", {
          email,
          callbackUrl: "/dashboard",
          redirect: false,
        });
        if (isSignin.ok) {
          setError(false);
          setSuccess(true);
          router.push("/dashboard");
        } else {
          setSuccess(false);
          setError(true);
          setMessage("Try Again Later");
        }
      } else {
        setSuccess(false);
        setError(true);
      }
      if (response.message) {
        setMessage(response.message);
      }
    } 
  });
  };

  const signInFields = [
    {
      name: "email",
      label: "Your Email",
      type: "email",
      placeholder: "name@company.com",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      required: true,
    },
  ];

  return (
    <div className="w-full">
      {/* Sign In Form */}
      <Form
        title="Sign In"
        description="Log in to explore your account features."
        buttonText="Sign In"
        onSubmit={handleFormSubmit}
        fields={signInFields}
        forgetLable="Forget Password"
        forgetLinkHref="/auth/forget"
        success={success}
        error={error}
        message={message}
        moreOptions
        footerText="Don't have an Account?"
        footerLinkText="Sign Up"
        footerLinkHref="/auth/signup"
        isLoading={isPending}
      />
    </div>
  );
};

export default Signin;
