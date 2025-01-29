"use client";
import React, { useState, useTransition } from "react";
import Form from "./Form";
import { handleSignup } from "@/actions/auth/handlers/handleSignup";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = async (formData) => {
    startTransition(async () => {
      // setIsLoading(true);
      let response = await handleSignup({
        ...formData,
        provider: "credentials",
      });
      if (response) {
        if (response.message) {
          setMessage(response.message);
        }
        if (response.success) {
          setSuccess(true);
          setError(false);
          // setIsLoading(false)

          setTimeout(() => {
            router.push(`/auth/code?email=${formData?.email}&process=signup`);
          }, 1000);
        } else {
          setSuccess(false);
          setError(true);
          // setIsLoading(false)
        }
      }
    });
  };

  const signUpFields = [
    {
      name: "name",
      label: "Your Name",
      type: "text",
      placeholder: "Your Name",
      required: true,
    },
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
    <div className=" w-full">
      {/* Sign Up Form */}
      <Form
        title="Create an Account"
        description="Create an account to unlock amazing features!"
        buttonText="Sign Up"
        onSubmit={handleFormSubmit}
        fields={signUpFields}
        forgetLable="Forget Password"
        forgetLinkHref="/auth/forget"
        success={success}
        error={error}
        message={message}
        moreOptions
        footerText="Already have an Account?"
        footerLinkText="Sign in"
        footerLinkHref="/auth/signin"
        isLoading={isPending}
      />
    </div>
  );
};

export default Signup;
