"use client";
import React, { useState } from "react";
import { Home, Users, BarChart, Settings, Mail } from "lucide-react";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { SiAuthelia } from "react-icons/si";

import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { CiLogin, CiLogout } from "react-icons/ci";
import Swal from "sweetalert2";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const Nevigation = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const pathName = usePathname();
  const authNav = pathName.startsWith("/auth")
    ? pathName.split("/auth/")[1]
    : "";

  let menuItems;
  if (session) {
    menuItems = [
      { icon: <Home size={24} />, label: "Home", path: "/" },
      {
        icon: <LuLayoutDashboard size={24} />,
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        icon: <FaArrowDownWideShort size={24} />,
        label: "Shortener",
        path: "/shortener",
      },
      { icon: <BarChart size={24} />, label: "Analytics", path: "/analytics" },
      {
        icon: <MdOutlineFeaturedPlayList size={24} />,
        label: "Features",
        path: "/features",
      },
    ];
  } else {
    menuItems = [
      { icon: <Home size={24} />, label: "Home", path: "/" },
      {
        icon: <MdOutlineFeaturedPlayList size={24} />,
        label: "Features",
        path: "/features",
      },
    ];
  }
  const navMenu = menuItems.find((menuItem) => menuItem.path == pathName);

  const handleLogOut = () => {
    Swal.fire({
      title: "Do you want to Logout?",
      text: "You will need to login again.",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      position: "center",
      customClass: {
        popup: "w-80 h-auto bg-[#e8f0ff]",
        title: "text-xl font-bold", // Custom Tailwind classes for title
        confirmButton: "bg-blue-500 text-white px-4 py-1 rounded", // Tailwind for the 'Yes' button
        cancelButton: "bg-red-500 text-white px-4 py-1 rounded", // Tailwind for the 'No' button
      },
    }).then((result) => {
      if (result.isConfirmed) {
        signOut();
        return;
      }
      return;
    });
  };
  return (
    <div className="  w-full  bg-blue-50 z-10">
      {/* Top Navigation - Mobile Only */}
      <nav className="lg:hidden fixed z-50 bg-white h-16 w-full shadow-sm p-4">
        <div className="flex justify-start pl-10 items-center gap-x-2 text-blue-600">
          {navMenu ? navMenu.icon : authNav ? <SiAuthelia /> : ""}
          <p className="text-2xl font-bold">
            {navMenu ? navMenu.label : authNav ? authNav.toUpperCase() : ""}
          </p>

          {/* <p className="text-2xl font-bold">{authNav}</p> */}
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar - Desktop & Tablet */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white shadow-lg">
          {/* For large screens - full width sidebar */}
          <div className="hidden xl:flex flex-col h-full w-64">
            <div className="flex justify-start items-center text-white gap-x-1 p-6 bg-blue-600">
              {navMenu ? navMenu.icon : authNav ? <SiAuthelia /> : ""}
              <span className="text-xl font-bold text-white">
                {navMenu ? navMenu.label : authNav ? authNav.toUpperCase() : ""}
              </span>
            </div>
            <nav className="flex-1 px-4 py-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mb-1 transition-colors"
                >
                  {React.cloneElement(item.icon, {
                    className: "text-blue-600",
                  })}
                  <span>{item.label}</span>
                </Link>
              ))}
              {session ? (
                // signout button
                <button
                  onClick={handleLogOut}
                  className=" bg-blue-600  flex items-center gap-x-3 px-8 py-3 text-white font-bold hover:bg-blue-700 hover:text-gray-50 rounded-full mb-1 transition-colors"
                >
                  <CiLogout size={24} color="white" />

                  <span>Logout</span>
                </button>
              ) : (
                // login button
                <button
                  onClick={() => router.push("/auth/login")}
                  className=" bg-blue-600  flex items-center gap-x-3 px-8 py-3 text-white font-bold hover:bg-blue-700 hover:text-gray-50 rounded-full mb-1 transition-colors"
                >
                  <CiLogin size={24} color="white" />

                  <span>Sign in</span>
                </button>
              )}
            </nav>
          </div>

          {/* For large screens - icons only sidebar */}
          <div className="lg:flex xl:hidden flex-col h-full w-20">
            <div className="p-6 bg-blue-600 flex justify-center">
              <p className="text-white">
                {" "}
                {navMenu ? navMenu.icon : authNav ? <SiAuthelia /> : ""}
              </p>
            </div>
            <nav className="flex-1 px-2 py-4">
              {menuItems.map((item, index) => (
                <div key={index} className="relative group">
                  <Link
                    href={item.path}
                    className="flex justify-center p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mb-1 transition-colors"
                  >
                    {React.cloneElement(item.icon, {
                      className: "text-blue-600",
                    })}
                  </Link>
                  <div className="hidden group-hover:block absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              ))}
              {session ? (
                // signout button
                <button
                  onClick={handleLogOut}
                  className="relative group   mx-auto aspect-square bg-blue-600  flex items-center justify-center p-2  text-white  hover:bg-blue-700 hover:text-gray-50 rounded-full  transition-colors"
                >
                  <CiLogout size={24} color="white" />
                  <div className="hidden group-hover:block  text-black absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                    Sign out
                  </div>
                </button>
              ) : (
                // login button
                <button
                  onClick={() => router.push("/auth/login")}
                  className="relative group   mx-auto aspect-square bg-blue-600  flex items-center justify-center p-2  text-white  hover:bg-blue-700 hover:text-gray-50 rounded-full  transition-colors"
                >
                  <CiLogin size={24} color="white" />
                  <div className="hidden group-hover:block  text-black absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                    Login
                  </div>
                </button>
              )}
            </nav>
          </div>
        </aside>

        {/* Bottom Navigation - Mobile Only */}
        <div className="lg:hidden  fixed z-10 bottom-0 left-0 right-0 bg-white  shadow-lg">
          <div className="flex  justify-around py-2 px-4">
            {menuItems.slice(0, 5).map((item, index) => (
              <div key={index} className="relative group  flex items-center">
                <Link
                  href={item.path}
                  className="flex flex-col justify-center items-center text-blue-600"
                >
                  {item.icon}
                </Link>
                <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                  {item.label}
                </div>
              </div>
            ))}

            {session ? (
              // signout button
              <button
                onClick={handleLogOut}
                className="relative group    aspect-square bg-blue-600  flex items-center justify-center p-1  text-white  hover:bg-blue-700 hover:text-gray-50 rounded-full  transition-colors"
              >
                <CiLogout size={22} color="white" className="rotate-180" />
                <div className="hidden group-hover:block text-black  absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                  Logout
                </div>
              </button>
            ) : (
              // login button
              <button
                onClick={() => router.push("/auth/login")}
                className="relative group    aspect-square bg-blue-600  flex items-center justify-center p-1  text-white  hover:bg-blue-700 hover:text-gray-50 rounded-full  transition-colors"
              >
                <CiLogin size={22} color="white" className="rotate-180" />
                <div className="hidden group-hover:block text-black  absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                  Login
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {
          <main
            className={`flex-1 w-full  pt-16 lg:pt-0  transition-all duration-300 ease-in-out ${"lg:ml-20 xl:ml-64"} mb-20 lg:mb-0`}
          >
            {children}
          </main>
        }
      </div>
    </div>
  );
};

export default Nevigation;
