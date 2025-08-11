"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <>
      <nav className="bg-gray-700 flex justify-between items-center px-4 h-12">
        {/* Drop down */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <div className="logo  font-bold">Get me a Coke</div>
        </div>

        {session ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-3">
                <button
                  id="dropdownDefaultButton"
                  data-dropdown-toggle="dropdown"
                  className="text-white bg-black px-4 py-2 hover:bg-white hover:text-black rounded-md cursor-pointer flex items-center gap-2 relative"
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowDropdown(false);
                    }, 300);
                  }}
                >
                  Welcome {session.user.name}
                  <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>

                <div
                  id="dropdown"
                  className={`${
                    showDropdown
                      ? "z-10 mt-12 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 absolute"
                      : "hidden"
                  }`}
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    <li>
                      <Link
                        href={`/dashboard`}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/${session.user.name}`}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Your Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/settings`}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Settings
                      </Link>
                    </li>

                    <li className="cursor-pointer">
                      <Link
                        href={`/`}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                        onClick={() => signOut()}
                      >
                        Sign out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Link href="/login">
            <button className="bg-gray-500 px-3 py-1 rounded-md cursor-pointer">
              Login
            </button>
          </Link>
        )}
      </nav>
    </>
  );
};

export default Navbar;
