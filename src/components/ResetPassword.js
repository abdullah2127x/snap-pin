"use client";
import React, { useEffect, useState, useTransition } from "react";
import Form from "./Form";
import { useSearchParams } from "next/navigation";
import { checkCode } from "@/actions/auth/checkCode";
import { useRouter } from "next/navigation";
import { saveUser } from "@/actions/auth/saveUser";
import { signIn } from "next-auth/react";

const ResetPassword = () => {
  const params = useSearchParams();

  const router = useRouter();

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const email = params.get("email");
  const code = params.get("code");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const response = await checkCode({
        email,
        code,
        provider: "credentials",
      });
      if (response && response.error) {
        router.push("/auth/signin");
      }
    })();
  }, [email, code, router]);

  const handleFormSubmit = async (formData) => {
    startTransition(async () => {
      const { password, confirm } = formData;

      if (password !== confirm) {
        setError(true);
        setSuccess(false);
        setMessage("Enter same passwords");
        return;
      }

      const isSavePass = await saveUser({
        email,
        password,
        provider: "credentials",
      });
      if (isSavePass && isSavePass.success) {
        const isSignin = await signIn("credentials", {
          email,
          callbackUrl: "/dashboard",
          redirect: false,
        });
        if (isSignin.ok) {
          setSuccess(true);
          setError(false);

          setMessage("Password saved successfully");
          router.push("/dashboard");
        } else {
          setError(true);
          setSuccess(false);
          setMessage("Try Again Later");
        }
      } else {
        setSuccess(false);
        setError(true);
        setMessage("Internal server error");
      }
    });
  };
  const resetPasswordFields = [
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "**********",
      required: true,
    },
    {
      name: "confirm",
      label: "Confirm",
      type: "password",
      placeholder: "**********",
      required: true,
    },
  ];

  return (
    <div className=" w-full">
      {/* Forget Password Form */}
      <Form
        title="Create a New Password"
        description="Enter your new password and confirm to update it."
        buttonText="Save Password"
        onSubmit={handleFormSubmit}
        fields={resetPasswordFields}
        success={success}
        error={error}
        message={message}
        footerText="Already Remembered?"
        footerLinkText="Sign In"
        footerLinkHref="/auth/signin"
        isLoading={isPending}
      />
    </div>
  );
};

export default ResetPassword;
