"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaGithub,
  FaGoogle,
  FaRegEyeSlash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

const Form = ({
  title,
  description,
  buttonText,
  onSubmit,
  fields,
  forgetLable,
  forgetLinkHref,
  error,
  success,
  message,
  moreOptions,
  footerText,
  footerLinkText,
  footerLinkHref,
  isLoading,
}) => {
  const [formData, setFormData] = useState(
    fields.reduce(
      (acc, field) => {
        acc[field.name] = ""; // Initialize form data for each field
        return acc;
      },
      { remember: false }
    )
  );

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox
    });
  };

  const handleFormSubmit = () => {
    onSubmit(formData); // Pass form data back to the parent component
  };

  return (
    <div className=" max-w-sm  mx-auto   inset-0 -z-50 bg-opacity-40 backdrop-blur-xl bg-white/10  rounded-lg shadow-xl p-6 md:py-4 md:px-8 space-y-2 ">
      <h1 className="text-2xl font-bold text-gray-900 text-center">{title}</h1>
      <h3 className="text-center text-md   px-2 ">{description}</h3>
      <form action={handleFormSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              {field.label}
            </label>
            <div className="w-full flex justify-between items-center overflow-hidden  border rounded-lg bg-gray-50/50  text-gray-900 border-gray-300 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:border-blue-500">
              <input
                disabled={isLoading}
                value={formData[field.name]}
                onChange={handleInputChange}
                type={
                  field?.type == "password" && showPassword == false
                    ? field.type
                    : "text"
                }
                name={field.name}
                id={field.name}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full py-2 pl-2.5 rounded-s-lg focus:outline-none bg-transparent "
              />

              {field.type === "password" && (
                <div
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  className="cursor-pointer mr-2"
                >
                  {showPassword ? (
                    <IoEyeOutline size={18} />
                  ) : (
                    <FaRegEyeSlash size={18} />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex  items-center justify-end">
          {forgetLable && (
            <div className="ml-auto mr-2">
              <Link
                href={forgetLinkHref}
                className="font-medium text-sm text-zinc-700 hover:underline hover:text-black"
              >
                {forgetLable}
              </Link>
            </div>
          )}
        </div>

        {error ? (
          <div className="py-2 bg-red-500/20 rounded-sm px-4 flex justify-start gap-x-2 items-center">
            <FaExclamationTriangle color="red" size={22} />
            <p className=" text-red-500/90 text-sm">{message && message}</p>
          </div>
        ) : (
          ""
        )}

        {/* show the success message */}
        {success ? (
          <div className="py-2 bg-green-500/20 rounded-sm px-4 flex justify-start gap-x-2 items-center">
            <CiCircleCheck color="green" size={22} />
            <p className=" text-green-500/90  text-sm">{message && message}</p>
          </div>
        ) : (
          ""
        )}

        <button
          disabled={isLoading}
          type="submit"
          className={`disabled:bg-blue-400 disabled:text-gray-100 w-full py-2.5 flex justify-center items-center gap-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
        >
          {isLoading && <Loader2 size={20} />}
          {isLoading ? (
            <>
              <p>Loading...</p>
            </>
          ) : (
            buttonText
          )}
        </button>
      </form>
      {moreOptions && (
        <>
          <div className="flex items-center my-4">
            <hr className="w-full border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <hr className="w-full border-gray-300" />
          </div>
          <div className="flex gap-x-3 justify-center items-center">
            <button
              onClick={() => signIn("google")}
              disabled={isLoading}
              className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <FaGoogle className="mr-2" />
              Google
            </button>
            <button
              // onClick={async () => {
              //   const response = await signIn("github", { redirect: false });

              //   if (response?.ok) {
              //     // Successful sign-in, navigate to the dashboard
              //     router.push("/dashboard");
              //   } else {
              //     // Sign-in failed, set error state
              //     error = true;
              //     success = false;
              //     message = "Try Again Later";
              //   }
              // }}
              onClick={() => signIn("github")}
              disabled={isLoading}
              className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <FaGithub className="mr-2" />
              GitHub
            </button>
          </div>
        </>
      )}

      <p className="text-center pt-2 text-sm text-gray-500 dark:text-gray-400">
        {footerText}{" "}
        <Link
          href={footerLinkHref}
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
};

export default Form;
