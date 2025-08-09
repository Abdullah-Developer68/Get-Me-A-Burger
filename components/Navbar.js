"use client";
import React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <>
      <nav className="bg-orange-500 flex justify-between items-center px-4 h-12">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-10 rounded-full" />
          <div className="logo  font-bold">Get me a Burger</div>
        </div>

        {session ? (
          <div className="flex items-center gap-3">
            <p>Signed in as {session.user?.email || session.user?.name}</p>
            <button
              onClick={() => signOut()}
              className="bg-red-500 px-3 py-1 rounded-md"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="bg-green-500 px-4 py-2 rounded-md cursor-pointer">
              Login
            </button>
          </Link>
        )}
      </nav>
    </>
  );
};

export default Navbar;
