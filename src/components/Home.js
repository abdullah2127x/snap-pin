"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Copy, Loader2 } from "lucide-react";

import {  FaExclamationTriangle } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import Link from "next/link";

import { generateGuestShortUrl } from "@/actions/url/generateGuestShortUrl";
import { useRouter } from "next/navigation";
import { GoLink } from "react-icons/go";

const Home = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCopyDone, setIsCopyDone] = useState(false);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();


  // if the url is changed!
  useEffect(() => {
    setError("");
    setSuccess("");
    setShortUrl("");
    setLoading(false);
  }, [url]);

  const handleSubmit = async () => {
    startTransition(async () => {
      setLoading(true);
      let response = await generateGuestShortUrl(url);
      if (response && response.success) {
        setShortUrl(response.shortUrl);
        setSuccess(response);
      } else {
        setLoading(false);
        setError(response);
      }
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopyDone(true);
      setTimeout(() => {
        setIsCopyDone(false);
      }, 2000);
    } catch (err) {
      console.log("Failed to copy text: ", err.message);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center   p-8 ">
      <div className=" pb-12 md:pb-0   mx-auto grid md:grid-cols-2 lg:gap-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="space-y-6 ">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Shorten Your Links,
            <span className="text-blue-600"> Expand Your Reach</span>
          </h1>

          <p className="text-lg text-slate-600">
            Transform long, unwieldy URLs into clean, manageable links
            instantly. Create an account to track all your shortened URLs in one
            place and access detailed analytics.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Link2 className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-slate-700">
                Track clicks and engagement analytics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Link2 className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-slate-700">Manage all your shortened URLs</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Link2 className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-slate-700">Custom branded links available</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                router.push("/auth/signin");
              }}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {/* <Link href="/auth/signin"> */}
              Sign In
              {/* </Link> */}
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link className="text-zinc-600" href="/features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="    mx-auto lg:mx-6 p-5 rounded-2xl shadow-lg">
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-slate-900">
                Shorten Your URL
              </h2>
              <p className="text-slate-600">
                Paste your long URL below to create a shortened version
              </p>
            </div>

            <div className="space-y-4">
              <Input
              disabled={isPending}
                ref={inputRef} // Attach the ref to the input element
                onClick={() => {
                  inputRef.current.select(); // Select the input's text when clicked
                }}
                type="url"
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                placeholder="Paste your long URL here..."
                className="w-full px-3  placeholder-slate-500 h-12 text-black"
                required
              />

              {shortUrl ? (
                <div className=" flex justify-between items-center py-2 w-full border border-zinc-400 bg-zinc-200 rounded-md px-4  text-black">
                  <code className="text-nowrap overflow-hidden text-ellipsis">
                    {shortUrl}
                  </code>
                  {!isCopyDone ? (
                    <div
                      onClick={() => copyToClipboard(shortUrl)}
                      className="hover:bg-zinc-300 bg-transparent transition duration-75 cursor-pointer p-1 rounded-md aspect-square"
                    >
                      <Copy size="20" color="black" />
                    </div>
                  ) : (
                    <div className="p-1 aspect-square">
                      <CiCircleCheck size="20" color="green" />
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading || isPending}
              >
                {loading ? (
                  <>Change Url</>
                ) : isPending ? (
                  <>
                    <Loader2 size={16} />
                    Shortening URL
                  </>
                ) : (
                  <>
                    <GoLink  size={16} />
                    Shorten URL
                  </>
                )}
              </Button>
              {/* if there get any erro rshow here */}
              {error ? (
                <div className="py-2 bg-red-500/20 rounded-sm px-4 flex justify-start gap-x-2 items-center">
                  <FaExclamationTriangle color="red" size={22} />
                  <p className=" text-red-500/90 text-sm">
                    {error.message ? error.message : ""}
                  </p>
                </div>
              ) : (
                ""
              )}

              {/* show the success message */}
              {success ? (
                <div className="py-2 bg-green-500/20 rounded-sm px-4 flex justify-start gap-x-2 items-center">
                  <CiCircleCheck color="green" size={22} />
                  <p className=" text-green-500/90  text-sm">
                    {success.message ? success.message : ""}
                  </p>
                </div>
              ) : (
                ""
              )}

              {/* if there is no success or error show this message  mean take the sapce for them*/}
              {/* {!success && !error ? (
                // <div className="py-2 opacity-0">
                //   <FaExclamationTriangle  size={22} />
                //   <p className="  text-sm">success or error</p>
                // </div>
                <div className="py-2 opacity-0 rounded-sm px-4 flex justify-start gap-x-2 items-center">
                  <FaExclamationTriangle color="green" size={22} />
                  <p className=" text-green-500/90  text-sm">
                    {success.message ? success.message : ""}
                  </p>
                </div>
              ) : (
                ""
              )} */}

              <div className="flex justify-center flex-col items-center ">
                {shortUrl ? (
                  <a
                    target="blank"
                    className=" hover:text-blue-700 hover:underline text-gray-800 overflow-hidden text-nowrap "
                    href={url}
                  >
                    Click here to go to your page
                  </a>
                ) : (
                  <p className=" text-gray-800 overflow-hidden text-nowrap ">
                    Enter your Url to get it here
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-500 text-center">
              By using our service you agree to our Terms of Service and Privacy
              Policy
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
