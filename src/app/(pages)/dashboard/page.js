"use client";
import React, { useState, useEffect } from "react";
import {
  Copy,
  Trash2,
  ExternalLink,
  BarChart2,
  Clock,
  LineChart,
  CheckCheck,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { getUserUrls } from "@/actions/url/getUrerUrls";
import { deleteUrl } from "@/actions/url/deleteUrl";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

import { useSession } from "next-auth/react";
import { getUserName } from "@/actions/auth/getUserName";

function calculateTimeDifference(lastClick) {
  const lastClickDate = new Date(lastClick);
  const now = Date.now();
  const diffInMs = now - lastClickDate;

  if (diffInMs < 0) {
    return "Invalid date"; // Handle future dates
  }

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}

const Dashboard = () => {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [urls, setUrls] = useState([]);
  const { data: session } = useSession();
  useEffect(() => {
    if (session == null && session !== undefined) {
      redirect("/");
    }
  }, [session]);

  const email = session?.user?.email;
  const provider = session?.user?.provider;
  const name = session?.user?.name;

  // get the name of the user
  useEffect(() => {
    (async () => {
      if (email) {
        console.log("the provider is", provider);
        if (provider == "credentials") {
          const a = await getUserName({ email, provider });
          console.log("the a is ", a);
          if (a && a.success && a.name) {
            console.log("now the name is ", a.name);
            const name = a.name;
            setUserName(name);
          }
        } else {
          console.log("in else the provider is", provider, name);
          setUserName(name);
        }
      }
    })();
  }, [email, provider, session, name]);

  // get the data from the server
  useEffect(() => {
    (async () => {
      try {
        const userUrls = await getUserUrls({ email, provider });
        if (userUrls && userUrls.success && userUrls.urls) {
          const urlArray = JSON.parse(userUrls.urls);

          const dateModifiedUrls = urlArray.map((url) => {
            if (url.lastClick !== undefined && url.lastClick !== null) {
              url.lastClick = calculateTimeDifference(url.lastClick);
            } else {
              url.lastClick = "No Views yet!";
            }
            return url; // Ensure each modified object is returned
          });

          const sortedUrls = dateModifiedUrls.sort(
            (a, b) => b.clicks - a.clicks
          );
          setUrls(sortedUrls);
        }
      } catch (error) {
        console.error("Error fetching user URLs:", error);
      }
    })();
  }, [email, provider]);

  const handleCopy = async (shortUrl, id) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      // showNotification("URL copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      showNotification("Failed to copy URL");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      position: "center",
      customClass: {
        popup: "w-80 h-auto bg-[#EBE0DB]",
        title: "text-xl font-bold", // Custom Tailwind classes for title
        confirmButton: "bg-blue-500 text-white px-4 py-1 rounded", // Tailwind for the 'Yes' button
        cancelButton: "bg-red-500 text-white px-4 py-1 rounded", // Tailwind for the 'No' button
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Delete the URL from the database
        const deletedUrl = await deleteUrl({ email, provider, urlId: id });
        if (deletedUrl?.success) {
          setUrls(urls.filter((url) => url.id !== id));
          showNotification("URL deleted successfully");
        } else {
          showNotification("Failed to delete URL");
        }
      }
    });
  };

  const showNotification = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleAnalytics = (id) => {
    // Handle analytics navigation
    router.push(`analytics?urlId=${id}`);
  };

  return (
    <div className=" bg-blue-50 container mx-auto  p-8 ">
      {userName && (
        <div className="flex flex-col md:flex-row gap-x-2 mb-2 items-center md:items-end  justify-center">
          <span className="text-4xl font-bold text-blue-900">Welcome</span>{" "}
          <h2 className="text-4xl font-bold text-blue-950">
            {userName.slice(0, 1).toUpperCase() + userName.slice(1)}
          </h2>
        </div>
      )}
      <div className=" mx-auto ">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-800">Dashboard</h1>
          <div className="text-gray-600">Total URLs: {urls.length}</div>
        </div>
        {/* <h2 className="text-2xl font-bold text-blue-900">naem</h2> */}

        {showAlert && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        {urls.length > 0 ? (
          <div className="space-y-6">
            {urls.map((url) => (
              <div key={url.id} className="  rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  {/* Original URL */}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <span className="font-medium text-gray-700 min-w-[100px]">
                      Original URL:
                    </span>
                    <div className="flex-1 text-nowrap overflow-x-hidden text-ellipsis  bg-gray-50 max-w-[280px] sm:max-w-[550px] md:max-w-[680px]  p-2 rounded">
                      <a
                        href={url.longUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                      >
                        {url.longUrl}
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Short URL */}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <span className="font-medium text-gray-700 min-w-[100px]">
                      Short URL:
                    </span>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <div className="flex-1 text-nowrap overflow-x-hidden text-ellipsis  max-w-[250px] sm:max-w-[520px] md:max-w-[650px]  bg-gray-50 p-2 rounded break-all">
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {url.shortUrl}
                        </a>
                      </div>
                      <button
                        onClick={() => handleCopy(url.shortUrl, url.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors"
                      >
                        {copiedId === url.id ? (
                          <>
                            <CheckCheck className="w-4 h-4" />
                            <span className="hidden sm:inline">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="hidden sm:inline">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {/* Total Clicks */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <BarChart2 className="w-4 h-4" />
                        <span className="font-medium">Total Clicks</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {url.clicks}
                      </div>
                    </div>

                    {/* Last Visit */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Last Visit</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {url.lastClick}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t flex flex-wrap gap-4 justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Created: {url.createdAt}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAnalytics(url.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded transition-colors"
                      >
                        <LineChart className="w-4 h-4" />
                        <span>Analytics</span>
                      </button>
                      <button
                        onClick={() => handleDelete(url.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-center items-center text-gray-600">
            No URLs found. Shorten your Urls to preview it here
            <Link
              href="/shortener"
              className="bg-blue-600 text-white px-3 py-1 font-bold rounded-md text-base ml-2  hover:bg-blue-700 hover:text-gray-100 "
            >
              Shorten Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
