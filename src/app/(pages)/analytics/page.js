"use client";
import React, { useState, useEffect, Suspense } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserUrls } from "@/actions/url/getUrerUrls";
import { BarChart2, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

const UrlAnalyticsContent = () => {
  const params = useSearchParams();
  const router = useRouter();
  const urlId = params.get("urlId");
  const [selectedUrl, setSelectedUrl] = useState(""); // get the url id but shows shortUrl
  const [timeRange, setTimeRange] = useState("1"); // show to the input for the time range
  const [analyticsData, setAnalyticsData] = useState(null); // need array of obj like {data:"23/3/524", clicks:67}
  const [selectedUrlData, setSelectedUrlData] = useState(null); // need obj that same as obj.shortUrl === selectedUrl
  const [urls, setUrls] = useState(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (session == null && session !== undefined) {
      redirect("/");
    }
  }, [session]);

  const email = session?.user?.email;
  const provider = session?.user?.provider;

  // set the selected url
  useEffect(() => {
    if (urlId) {
      setSelectedUrl(urlId);
      router.push("/analytics");
    }
  }, [urlId, router]);

  //get the data from server
  useEffect(() => {
    (async () => {
      try {
        const userUrls = await getUserUrls({ email, provider });

        if (userUrls && userUrls.success && userUrls.urls) {
          const urlArray = JSON.parse(userUrls.urls);
          setUrls(urlArray);
        }
      } catch (error) {
        console.error("Error fetching user URLs:", error);
      }
    })();
  }, [email, provider,router]);

  // set the selcted url data that match the selected Url
  useEffect(() => {
    if (selectedUrl && urls) {
      const selectedUrlObj = urls.find((url) => url.id === selectedUrl);
      setSelectedUrlData(selectedUrlObj);
      setTimeRange("1");
    }
  }, [selectedUrl, urls]);

  // set the analytics data that match the selected Url
  useEffect(() => {
    if (selectedUrlData) {
      const array = selectedUrlData?.clickAt;
      if (array) {
        // get the exact number of days from the end same as timerange.
        const analyticsArray = array.slice(-timeRange);
        setAnalyticsData(analyticsArray);
      }
    }
  }, [selectedUrl, timeRange, selectedUrlData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            <span className="font-medium">{payload[0].value}</span> clicks
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className=" p-8  w-full bg-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Analytics</h1>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* select url */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select URL
              </label>
              <select
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="w-full p-2 mx2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >

                <option value="">Select a URL</option>
                {urls?.map((url) => (
                  <option key={url.id} value={url?.id}>
                    {url.shortUrl}
                  </option>
                ))}
              </select>
            </div>

            {/* select time range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                disabled={!selectedUrl}
                className="w-full p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {selectedUrlData?.clicks > 0 ? (
                  Array.from(
                    { length: Math.min(selectedUrlData.clickAt.length, 7) },
                    (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        Last {index + 1} {index + 1 === 1 ? "Day" : "Days"}
                      </option>
                    )
                  )
                ) : (
                  <option value="">No views yet!</option>
                )}
                {selectedUrlData?.clickAt.length >= 15 && (
                  <option value={15}>Last 15 Days</option>
                )}
                {selectedUrlData?.clickAt.length >= 30 && (
                  <option value={30}>Last 30 Days</option>
                )}
              </select>
            </div>
          </div>

          {/* show the message if there is no views on url */}
          {selectedUrl && selectedUrlData?.clicks == 0 ? (
            <Card className="bg-white border-none shadow-md">
              <CardContent className="flex items-center justify-center h-[200px]">
                <p className="text-gray-500 text-lg">
                  No Views yet to your url
                </p>
              </CardContent>
            </Card>
          ) : selectedUrl && selectedUrlData ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-white border-none shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Clicks
                    </CardTitle>
                    <BarChart2 className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {selectedUrlData?.clicks && selectedUrlData.clicks}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Time Period
                    </CardTitle>
                    <Clock className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {selectedUrlData?.clicks && timeRange && timeRange == 1
                        ? `${timeRange} Day`
                        : timeRange && timeRange > 1
                        ? `${timeRange} Days`
                        : ""}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Graph */}
              <Card className="bg-white border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Click Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analyticsData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="colorClicks"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3B82F6"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3B82F6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E5E7EB"
                        />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: "#6B7280" }}
                          tickLine={false}
                          axisLine={{ stroke: "#E5E7EB" }}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: "#6B7280" }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => value.toLocaleString()}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          fill="url(#colorClicks)"
                          dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                          activeDot={{
                            r: 6,
                            fill: "#2563EB",
                            stroke: "#white",
                            strokeWidth: 2,
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-white border-none shadow-md">
              <CardContent className="flex items-center justify-center h-[200px]">
                <p className="text-gray-500 text-lg">
                  Select a URL to view analytics
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};


const UrlAnalytics = () => {
  return (
    <Suspense fallback={<p>Loading analytics...</p>}>
      <UrlAnalyticsContent />
    </Suspense>
  );
};

export default UrlAnalytics;
