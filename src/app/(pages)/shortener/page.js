"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Link,
  BarChart3,
  List,
  Copy,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CiCircleCheck } from "react-icons/ci";
import { checkShortUrl } from "@/actions/url/checkShortUrl";
import { generateTrackShortUrl } from "@/actions/url/generateTrackShortUrl";
import { useRouter } from "next/navigation";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const Shorten = () => {
  const hostName = process.env.NEXT_PUBLIC_HOSTNAME;
  const router = useRouter();
  const [longUrl, setLongUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isCopyDone, setIsCopyDone] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  //set as when the input change it will false  and show change url if true
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (session == null && session !== undefined) {
      redirect("/");
    }
  }, [session]);

  const email = session?.user?.email;
  const provider = session?.user?.provider;

  // reset all the states when long url is changed
  useEffect(() => {
    setAlert({ type: "", message: "" });
    setShortUrl("");
    setCustomUrl("");
    setLoading(false);
  }, [longUrl]);

  // reset loading state when custom url is changed
  useEffect(() => {
    setAlert({ type: "", message: "" });
    setShortUrl("");
    // setCustomUrl("");
    setLoading(false);
  }, [customUrl]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopyDone(true);
      setTimeout(() => {
        setIsCopyDone(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // handler to submit data to server
  const handleSubmit = async () => {
    startTransition(async () => {
      setLoading(true);
      // first check if the user long url is same as some one's short url?
      const isLongUrlSameAsShort = await checkShortUrl(longUrl);
      if (isLongUrlSameAsShort && isLongUrlSameAsShort.success) {
        setAlert({
          type: "error",
          message: "This URL is already a shortened URL",
        });
        setLoading(false);
        return;
      } else {
        if (customUrl.length > 0) {
          const shortUrl = `${hostName}/${customUrl}`;
          const isCustomExist = await checkShortUrl(shortUrl);
          // if custom url is already exist
          if (isCustomExist && isCustomExist.success) {
            // thorow an error message
            setAlert({
              type: "error",
              message: "This custom URL is already taken",
            });
            setLoading(false);
            return;
          } else {
            // generate the url with custom short url and show success message
            const userUrl = await generateTrackShortUrl({
              email,
              provider,
              longUrl,
              userShortCode: customUrl,
            });
            if (userUrl && userUrl.success && userUrl.shortUrl) {
              setShortUrl(userUrl.shortUrl);
              setAlert({
                type: "success",
                message: "URL shortened successfully!",
              });
            }
          }
        } else {
          // generate the url with random short url and show success message
          const userUrl = await generateTrackShortUrl({
            email,
            provider,
            longUrl,
          });

          if (userUrl && userUrl.success && userUrl.shortUrl) {
            setShortUrl(userUrl.shortUrl);
            setAlert({
              type: "success",
              message: "URL shortened successfully!",
            });
          } else {
            setAlert({
              type: "error",
              message: "Failed to shorten the URL Try Again!",
            });
            setLoading(false);
          }
        }
      }
    });
  };

  return (
    <div className="max-w-4xl min-h-screen pt-[68px] mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800 font-bold">
            URL Shortener
          </CardTitle>
          <CardDescription>
            Create short, memorable links for your long URLs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-blue-800 text-sm font-medium mb-2">
                Enter your long URL
              </label>
              <Input
                required
                ref={inputRef} // Attach the ref to the input element
                onClick={() => {
                  inputRef.current.select(); // Select the input's text when clicked
                }}
                disabled={isPending}
                type="url"
                placeholder="https://example.com/very-long-url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                disabled={isPending}
                type="button"
                variant="outline"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="flex items-center gap-2"
              >
                {showCustomInput ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
                Custom URL
              </Button>
            </div>

            {showCustomInput && (
              <div className="animate-in fade-in slide-in-from-top-1">
                <label className="block text-sm font-medium mb-2">
                  Custom short URL
                </label>
                <Input
                  disabled={isPending}
                  type="text"
                  placeholder="custom-name without spaces"
                  value={customUrl}
                  onChange={(e) =>
                    setCustomUrl(e.target.value.replace(/\s+/g, ""))
                  }
                  className="w-full"
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full flex bg-blue-600 hover:bg-blue-700  items-center justify-center gap-2"
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
                  <Link size={16} />
                  Shorten URL
                </>
              )}
            </Button>
          </form>
          {/* show the area to copy the short url */}
          {shortUrl && (
            <div className="mt-2 flex justify-between items-center py-1 w-full border border-zinc-300 bg-zinc-100 rounded-md px-4  text-black">
              <code className="text-nowrap overflow-hidden text-ellipsis">
                {shortUrl}
              </code>
              {!isCopyDone ? (
                <div
                  onClick={() => copyToClipboard(shortUrl)}
                  className="hover:bg-zinc-200 bg-transparent transition duration-75 cursor-pointer p-1 rounded-md aspect-square"
                >
                  <Copy size="20" color="black" />
                </div>
              ) : (
                <div className="p-1 aspect-square">
                  <CiCircleCheck size="20" color="green" />
                </div>
              )}
            </div>
          )}

          {/* show message */}
          {alert && alert.type && (
            <Alert
              variant={alert.type === "error" ? "destructive" : "success"}
              className="mt-4 "
            >
              {alert.type === "error" ? (
                <AlertCircle size={22} />
              ) : (
                <CheckCircle2 size={22} />
              )}
              <AlertTitle>
                {alert.type === "error" ? "Error" : "Success"}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          {/* direct link to site */}
          {shortUrl && (
            <div className="w-full flex justify-center items-center pt-3">
              <a
                className="text-center hover:text-blue-700 hover:underline"
                href={shortUrl}
                target="_blank"
              >
                Go to your Site
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => router.push("/analytics")}
        >
          <BarChart3 size={24} />
          <span>Show Analytics</span>
        </Button>

        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => router.push("/dashboard")}
        >
          <List size={24} />
          <span>Show Your URLs</span>
        </Button>
      </div>
    </div>
  );
};

export default Shorten;

// "use client"
// import React, { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Copy, Link as LinkIcon } from 'lucide-react';

// const UrlShortener = () => {
//   const [originalUrl, setOriginalUrl] = useState('');
//   const [customAlias, setCustomAlias] = useState('');
//   const [shortenedUrl, setShortenedUrl] = useState('');
//   const [error, setError] = useState('');

//   const handleShorten = () => {
//     // Basic validation
//     if (!originalUrl) {
//       setError('Please enter a valid URL');
//       return;
//     }

//     // URL validation regex
//     const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
//     if (!urlPattern.test(originalUrl)) {
//       setError('Invalid URL format');
//       return;
//     }

//     // In a real app, this would be an API call
//     const baseUrl = 'https://short.url/';
//     const alias = customAlias
//       ? customAlias
//       : Math.random().toString(36).substring(2, 7);

//     setShortenedUrl(`${baseUrl}${alias}`);
//     setError('');
//   };

//   const copyToClipboard = () => {
//     if (shortenedUrl) {
//       navigator.clipboard.writeText(shortenedUrl);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-blue-200">
//         <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
//           URL Shortener
//         </h1>

//         <div className="mb-4">
//           <label htmlFor="originalUrl" className="block text-blue-700 mb-2">
//             Original URL
//           </label>
//           <Input
//             id="originalUrl"
//             type="text"
//             placeholder="Enter your long URL"
//             value={originalUrl}
//             onChange={(e) => setOriginalUrl(e.target.value)}
//             className="w-full border-blue-300 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="customAlias" className="block text-blue-700 mb-2">
//             Custom Alias (Optional)
//           </label>
//           <div className="flex">
//             <div className="mr-2 flex-grow">
//               <Input
//                 id="customAlias"
//                 type="text"
//                 placeholder="Create custom short URL"
//                 value={customAlias}
//                 onChange={(e) => setCustomAlias(e.target.value)}
//                 className="w-full border-blue-300 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div className="text-sm text-blue-600 self-center">
//               short.url/
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-4 text-red-600 text-sm text-center">
//             {error}
//           </div>
//         )}

//         <Button
//           onClick={handleShorten}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//         >
//           <LinkIcon className="mr-2" /> Shorten URL
//         </Button>

//         {shortenedUrl && (
//           <div className="mt-4 bg-blue-50 p-3 rounded flex justify-between items-center">
//             <a
//               href={shortenedUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-800 truncate mr-2"
//             >
//               {shortenedUrl}
//             </a>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={copyToClipboard}
//               className="text-blue-600 hover:bg-blue-100"
//             >
//               <Copy size={16} />
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UrlShortener;
